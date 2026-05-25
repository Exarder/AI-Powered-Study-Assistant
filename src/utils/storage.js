const STORAGE_KEYS = {
  apiKey: 'studyai_api_key',
  chatConfig: 'studyai_chat_config',
  session: 'studyai_session',
};

const GEMINI_MODELS = ["gemini-2.5-flash"];

const DEFAULT_CHAT_CONFIG = {
  model: 'gemini-2.5-flash',
  temperature: 0.7,
  baseSystemPrompt: '',
  course: '',
};

export function loadApiKey() {
  try {
    return localStorage.getItem(STORAGE_KEYS.apiKey) || '';
  } catch {
    return '';
  }
}

export function saveApiKey(key) {
  localStorage.setItem(STORAGE_KEYS.apiKey, key.trim());
}

export function loadChatConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.chatConfig);
    if (!raw) return { ...DEFAULT_CHAT_CONFIG };
    const config = { ...DEFAULT_CHAT_CONFIG, ...JSON.parse(raw) };
    if (!GEMINI_MODELS.includes(config.model)) {
      config.model = DEFAULT_CHAT_CONFIG.model;
    }
    return config;
  } catch {
    return { ...DEFAULT_CHAT_CONFIG };
  }
}

export function saveChatConfig(config) {
  localStorage.setItem(STORAGE_KEYS.chatConfig, JSON.stringify(config));
}

export function loadSession() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEYS.session);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveSession(session) {
  sessionStorage.setItem(STORAGE_KEYS.session, JSON.stringify(session));
}

export function clearSession() {
  sessionStorage.removeItem(STORAGE_KEYS.session);
}

export { DEFAULT_CHAT_CONFIG, GEMINI_MODELS, STORAGE_KEYS };
