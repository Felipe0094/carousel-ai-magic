
import { useState, useEffect } from 'react';

const GEMINI_API_KEY_STORAGE = 'feijo-seguros-gemini-api-key';

export const useGeminiApiKey = () => {
  const [apiKey, setApiKey] = useState<string>('');

  useEffect(() => {
    const savedKey = localStorage.getItem(GEMINI_API_KEY_STORAGE);
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const saveApiKey = (key: string) => {
    if (key.trim()) {
      localStorage.setItem(GEMINI_API_KEY_STORAGE, key);
      setApiKey(key);
    }
  };

  const clearApiKey = () => {
    localStorage.removeItem(GEMINI_API_KEY_STORAGE);
    setApiKey('');
  };

  const hasApiKey = Boolean(apiKey.trim());

  return {
    apiKey,
    saveApiKey,
    clearApiKey,
    hasApiKey
  };
};
