'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const TMDB_API_KEY_LOCAL_STORAGE = 'bookverse-tmdb-api-key';

interface SettingsContextType {
  tmdbApiKey: string | null;
  setTmdbApiKey: (key: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [tmdbApiKey, setTmdbApiKeyState] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Load from env var or local storage on mount
  useEffect(() => {
    const envKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    if (envKey) {
      setTmdbApiKeyState(envKey);
    } else {
      try {
        const storedKey = localStorage.getItem(TMDB_API_KEY_LOCAL_STORAGE);
        if (storedKey) {
          setTmdbApiKeyState(storedKey);
        }
      } catch (error) {
        console.error('Failed to access localStorage:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  const setTmdbApiKey = useCallback((key: string) => {
    try {
        localStorage.setItem(TMDB_API_KEY_LOCAL_STORAGE, key);
        setTmdbApiKeyState(key);
    } catch (error) {
        console.error('Failed to save API key to localStorage:', error);
    }
  }, []);

  const value = {
    tmdbApiKey: isLoaded ? tmdbApiKey : null,
    setTmdbApiKey
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
