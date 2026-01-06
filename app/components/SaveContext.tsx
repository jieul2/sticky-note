'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';

export type SaveContextType = {
  triggerSave: () => void;
  registerSaveHandler: (handler: () => Promise<void>) => void;
  isSaving: boolean;
};

const SaveContext = createContext<SaveContextType | null>(null);

export function SaveProvider({ children }: { children: ReactNode }) {
  const [saveHandler, setSaveHandler] = useState<() => Promise<void>>(
    async () => console.log('저장할 내용이 없습니다.')
  );
  const [isSaving, setIsSaving] = useState(false);

  const triggerSave = useCallback(async () => {
    if (!saveHandler || typeof saveHandler !== 'function' || isSaving) {
      console.log('저장할 함수가 없거나 저장 중');
      return;
    }

    try {
      setIsSaving(true);
      await saveHandler();
      alert('저장 완료! 🎉');
    } catch (e) {
      console.error('Save failed:', e);
      alert('저장 실패 😢');
    } finally {
      setIsSaving(false);
    }
  }, [saveHandler, isSaving]);

  const registerSaveHandler = useCallback((handler: () => Promise<void>) => {
    if (typeof handler !== 'function') {
      console.error('registerSaveHandler에 함수가 아닌 값 전달됨', handler);
      return;
    }
    setSaveHandler(() => handler);
  }, []);

  return (
    <SaveContext.Provider value={{ triggerSave, registerSaveHandler, isSaving }}>
      {children}
    </SaveContext.Provider>
  );
}

export function useSave() {
  const ctx = useContext(SaveContext);
  if (!ctx) throw new Error('useSave must be used within SaveProvider');
  return ctx;
}
