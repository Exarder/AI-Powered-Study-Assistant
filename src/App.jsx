import { useCallback, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import SettingsModal from './components/SettingsModal';
import Toast from './components/Toast';
import LandingPage from './pages/LandingPage';
import ChatPage from './pages/ChatPage';
import {
  loadApiKey,
  loadChatConfig,
  loadSession,
  saveApiKey,
  saveChatConfig,
  saveSession,
} from './utils/storage';

export default function App() {
  const [apiKey, setApiKey] = useState('');
  const [chatConfig, setChatConfig] = useState(() => loadChatConfig());
  const [session, setSession] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    setApiKey(loadApiKey());
    setChatConfig(loadChatConfig());
    setSession(loadSession());
  }, []);

  const handleSessionChange = useCallback((next) => {
    setSession(next);
    saveSession(next);
  }, []);

  function handleSaveSettings(key, config) {
    saveApiKey(key);
    saveChatConfig(config);
    setApiKey(key);
    setChatConfig(config);
    setSettingsOpen(false);
    setToastMessage('Tersimpan');
  }

  function handleOpenSettings() {
    setSettingsOpen(true);
  }

  return (
    <>
      <Layout onOpenSettings={handleOpenSettings}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/chat"
            element={
              <ChatPage
                apiKey={apiKey}
                chatConfig={chatConfig}
                session={session}
                onSessionChange={handleSessionChange}
                onOpenSettings={handleOpenSettings}
              />
            }
          />
        </Routes>
      </Layout>

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        apiKey={apiKey}
        chatConfig={chatConfig}
        onSave={handleSaveSettings}
      />

      {toastMessage && (
        <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
      )}
    </>
  );
}
