'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Settings = {
  isMoveEnabled: boolean;
  isResizeEnabled: boolean;
  showOverlapWarning: boolean;
  useGridSnap: boolean;
  showCoordinates: boolean; // 좌표 표시 설정 추가
  gridSize: number;
};

type SettingsContextType = {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const defaultSettings: Settings = {
  isMoveEnabled: true,
  isResizeEnabled: true,
  showOverlapWarning: true,
  useGridSnap: false,
  showCoordinates: true, // 기본값 ON
  gridSize: 20,
};

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('user-settings');
      return saved ? JSON.parse(saved) : defaultSettings;
    }
    return defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('user-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
};