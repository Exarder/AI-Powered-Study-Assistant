import { useCallback, useEffect, useRef, useState } from 'react';
import ChatMessage from '../components/ChatMessage';
import TypingIndicator from '../components/TypingIndicator';
import { buildSystemPrompt, STUDY_MODES } from '../utils/prompts';
import { sendChatCompletionStream } from '../utils/gemini';

export default function ChatPage({
  apiKey,
  chatConfig,
  session,
  onSessionChange,
  onOpenSettings,
}) {
  const [mode, setMode] = useState(session?.mode || 'explain');
  const [messages, setMessages] = useState(session?.messages || []);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const abortRef = useRef(null);
  const streamingMessageIdRef = useRef(null);

  useEffect(() => {
    onSessionChange({ mode, messages });
  }, [mode, messages, onSessionChange]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showTyping, isStreaming]);

  const handleSend = useCallback(
    async (e) => {
      e?.preventDefault();
      const text = input.trim();
      if (!text || isStreaming) return;

      if (!apiKey) {
        setError('Masukkan API Key Gemini (AI Studio) di Pengaturan terlebih dahulu.');
        onOpenSettings();
        return;
      }

      setError('');
      setInput('');

      const userMessage = { role: 'user', content: text, id: crypto.randomUUID() };
      const nextMessages = [...messages, userMessage];
      setMessages(nextMessages);
      setIsStreaming(true);
      setShowTyping(true);
      streamingMessageIdRef.current = null;

      const systemPrompt = buildSystemPrompt({
        mode,
        course: chatConfig.course,
        baseSystemPrompt: chatConfig.baseSystemPrompt,
      });

      const apiMessages = [
        { role: 'system', content: systemPrompt },
        ...nextMessages.map(({ role, content }) => ({ role, content })),
      ];

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        await sendChatCompletionStream({
          apiKey,
          model: chatConfig.model,
          temperature: chatConfig.temperature,
          messages: apiMessages,
          signal: controller.signal,
          onChunk: (chunkText) => {
            if (!streamingMessageIdRef.current) {
              const id = crypto.randomUUID();
              streamingMessageIdRef.current = id;
              setShowTyping(false);
              setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: chunkText, id },
              ]);
              return;
            }

            const streamId = streamingMessageIdRef.current;
            setMessages((prev) =>
              prev.map((m) =>
                m.id === streamId ? { ...m, content: m.content + chunkText } : m
              )
            );
          },
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Gagal mendapatkan respons dari AI.');
          if (streamingMessageIdRef.current) {
            setMessages((prev) =>
              prev.filter((m) => m.id !== streamingMessageIdRef.current)
            );
          }
        }
      } finally {
        setIsStreaming(false);
        setShowTyping(false);
        streamingMessageIdRef.current = null;
        abortRef.current = null;
      }
    },
    [input, isStreaming, apiKey, messages, mode, chatConfig, onOpenSettings]
  );

  function handleClearChat() {
    if (isStreaming && abortRef.current) {
      abortRef.current.abort();
    }
    setMessages([]);
    setError('');
    setIsStreaming(false);
    setShowTyping(false);
    streamingMessageIdRef.current = null;
  }

  function handleModeChange(newMode) {
    setMode(newMode);
    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        id: crypto.randomUUID(),
        content: `Mode diubah ke **${STUDY_MODES[newMode].label}**. ${
          STUDY_MODES[newMode].description
        }. Silakan lanjutkan pertanyaan Anda.`,
      },
    ]);
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-3.5rem)] max-w-4xl flex-col px-4 py-4 sm:px-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Chat Tutor</h1>
          <p className="text-sm text-slate-500">
            {chatConfig.course
              ? `Mata kuliah: ${chatConfig.course}`
              : 'Pilih mata kuliah di Pengaturan (opsional)'}
          </p>
        </div>
        <button
          type="button"
          onClick={handleClearChat}
          className="self-start rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 sm:self-auto"
        >
          Hapus riwayat sesi
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {Object.values(STUDY_MODES).map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => handleModeChange(m.id)}
            disabled={isStreaming}
            className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === m.id
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
            }`}
          >
            {m.icon} {m.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto rounded-xl border border-slate-200 bg-white p-4">
        {messages.length === 0 && !isStreaming && (
          <div className="flex h-full min-h-[200px] flex-col items-center justify-center text-center">
            <p className="text-4xl">🎓</p>
            <p className="mt-3 font-medium text-slate-900">Mulai sesi belajar</p>
            <p className="mt-1 max-w-sm text-sm text-slate-500">
              Tanyakan materi, minta rangkuman, atau latihan soal. Tutor AI siap membantu.
            </p>
          </div>
        )}

        <div className="space-y-4">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {showTyping && <TypingIndicator />}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <form onSubmit={handleSend} className="mt-4 flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Ketik pertanyaan atau permintaan Anda..."
          rows={2}
          disabled={isStreaming}
          className="flex-1 resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-indigo-600 focus:ring-2 disabled:bg-slate-50"
        />
        <button
          type="submit"
          disabled={isStreaming || !input.trim()}
          className="self-end rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Kirim
        </button>
      </form>
    </div>
  );
}
