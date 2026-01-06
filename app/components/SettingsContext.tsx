'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Settings = {
  isMoveEnabled: boolean;
  isResizeEnabled: boolean;
  showOverlapWarning: boolean;
  useGridSnap: boolean;
  showCoordinates: boolean;
  gridSize: number;
};

type SettingsContextType = {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  isSettingsOpen: boolean;      // 모달 열림 상태 추가
  setIsSettingsOpen: (open: boolean) => void; // 상태 변경 함수 추가
};

const defaultSettings: Settings = {
  isMoveEnabled: true,
  isResizeEnabled: true,
  showOverlapWarning: true,
  useGridSnap: false,
  showCoordinates: true,
  gridSize: 20,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  // 설정값 로컬 스토리지 로드
  const [settings, setSettings] = useState<Settings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('user-settings');
      return saved ? JSON.parse(saved) : defaultSettings;
    }
    return defaultSettings;
  });

  // 모달 상태 (이건 로컬 스토리지에 저장할 필요 없음)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('user-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, isSettingsOpen, setIsSettingsOpen }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
};