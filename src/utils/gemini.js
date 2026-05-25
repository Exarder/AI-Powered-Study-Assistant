function buildRequestBody({ messages, temperature }) {
  const systemMessage = messages.find((m) => m.role === 'system');
  const chatMessages = messages.filter((m) => m.role !== 'system');

  const contents = chatMessages.map((msg) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));

  const body = {
    contents,
    generationConfig: {
      temperature: Number(temperature),
    },
  };

  if (systemMessage?.content) {
    body.systemInstruction = {
      parts: [{ text: systemMessage.content }],
    };
  }

  return body;
}

function extractTextFromChunk(parsed) {
  return parsed?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}

function parseSseBuffer(buffer) {
  const events = [];
  const lines = buffer.split('\n');
  const remainder = lines.pop() ?? '';

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('data:')) continue;

    const payload = trimmed.slice(5).trim();
    if (!payload || payload === '[DONE]') continue;

    try {
      events.push(JSON.parse(payload));
    } catch {
      // skip malformed chunk
    }
  }

  return { events, remainder };
}

/**
 * Stream respons Gemini via REST (SSE).
 * Memanggil onChunk(text) untuk setiap potongan teks baru.
 */
export async function sendChatCompletionStream({
  apiKey,
  model,
  temperature,
  messages,
  signal,
  onChunk,
}) {
  const body = buildRequestBody({ messages, temperature });

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${encodeURIComponent(apiKey)}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const message =
      data?.error?.message ||
      `Permintaan gagal (${response.status}). Periksa API key Gemini (AI Studio) dan konfigurasi.`;
    throw new Error(message);
  }

  if (!response.body) {
    throw new Error('Streaming tidak didukung di browser ini.');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let fullText = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const { events, remainder } = parseSseBuffer(buffer);
    buffer = remainder;

    for (const event of events) {
      const text = extractTextFromChunk(event);
      if (text) {
        fullText += text;
        onChunk(text);
      }
    }
  }

  if (buffer.trim()) {
    const { events } = parseSseBuffer(`${buffer}\n`);
    for (const event of events) {
      const text = extractTextFromChunk(event);
      if (text) {
        fullText += text;
        onChunk(text);
      }
    }
  }

  if (!fullText.trim()) {
    throw new Error('Respons AI kosong. Coba lagi.');
  }

  return fullText.trim();
}

/** Non-streaming fallback */
export async function sendChatCompletion({
  apiKey,
  model,
  temperature,
  messages,
  signal,
}) {
  const body = buildRequestBody({ messages, temperature });

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      data?.error?.message ||
      `Permintaan gagal (${response.status}). Periksa API key Gemini (AI Studio) dan konfigurasi.`;
    throw new Error(message);
  }

  const content = extractTextFromChunk(data);
  if (!content) {
    const blockReason = data?.candidates?.[0]?.finishReason;
    throw new Error(
      blockReason
        ? `Respons diblokir (${blockReason}). Coba ubah pertanyaan.`
        : 'Respons AI kosong. Coba lagi.'
    );
  }

  return content.trim();
}
