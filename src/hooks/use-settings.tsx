'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const TMDB_ENABLED_KEY = 'bookverse-tmdb-enabled';
const TMDB_API_KEY = 'bookverse-tmdb-api-key';

type SettingsContextType = {
  isTmdbEnabled: boolean;
  tmdbApiKey: string | null;
  isSettingsLoaded: boolean;
  setTmdbEnabled: (enabled: boolean) => void;
  saveTmdbApiKey: (apiKey: string) => void;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [isTmdbEnabled, setIsTmdbEnabled] = useState(false);
  const [tmdbApiKey, setTmdbApiKey] = useState<string | null>(null);
  const [isSettingsLoaded, setIsSettingsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedEnabled = localStorage.getItem(TMDB_ENABLED_KEY);
      const storedApiKey = localStorage.getItem(TMDB_API_KEY);

      const envApiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

      if (storedApiKey) {
        setTmdbApiKey(storedApiKey);
      } else if (envApiKey) {
        setTmdbApiKey(envApiKey);
      }

      if (storedEnabled !== null) {
        setIsTmdbEnabled(JSON.parse(storedEnabled));
      } else if (envApiKey) {
        // If env var is present, enable by default
        setIsTmdbEnabled(true);
      }
    } catch (error) {
      console.error("Failed to load settings from localStorage", error);
    } finally {
        setIsSettingsLoaded(true);
    }
  }, []);

  const handleSetTmdbEnabled = useCallback((enabled: boolean) => {
    setIsTmdbEnabled(enabled);
    try {
      localStorage.setItem(TMDB_ENABLED_KEY, JSON.stringify(enabled));
    } catch (error) {
       console.error("Failed to save TMDB enabled status to localStorage", error);
    }
  }, []);

  const handleSaveTmdbApiKey = useCallback((apiKey: string) => {
    setTmdbApiKey(apiKey);
    try {
      localStorage.setItem(TMDB_API_KEY, apiKey);
    } catch (error) {
        console.error("Failed to save TMDB API key to localStorage", error);
    }
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        isTmdbEnabled,
        tmdbApiKey,
        isSettingsLoaded,
        setTmdbEnabled: handleSetTmdbEnabled,
        saveTmdbApiKey: handleSaveTmdbApiKey,
      }}
    >
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
