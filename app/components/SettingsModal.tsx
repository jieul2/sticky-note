'use client';

import { useEffect, useState } from 'react';
import { 
  X, 
  Move, 
  Maximize2, 
  Hash, 
  Layers, 
  Grid3X3,
  Settings2
} from 'lucide-react';
import { useSettings } from './SettingsContext';
import { motion, AnimatePresence } from 'framer-motion';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

interface ToggleItemProps {
  label: string;
  desc: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  icon: React.ReactNode;
  children?: React.ReactNode;
}

const ToggleItem = ({ label, desc, checked, onChange, icon, children }: ToggleItemProps) => (
  <div className="flex flex-col py-4 border-b border-gray-100 dark:border-zinc-800 last:border-0">
    <div className="flex items-center justify-between">
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 p-2 rounded-lg ${checked ? 'bg-yellow-400/10 text-yellow-600 dark:text-yellow-400' : 'bg-gray-100 dark:bg-zinc-800 text-gray-400'}`}>
          {icon}
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900 dark:text-gray-100">{label}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</span>
        </div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 ${
          checked ? 'bg-yellow-400' : 'bg-gray-300 dark:bg-zinc-700'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
    {checked && children && (
      <div className="mt-3 ml-12">
        {children}
      </div>
    )}
  </div>
);

export default function SettingsModal({ isOpen, onClose }: Props) {
  const { settings, updateSettings } = useSettings();
  
  // 💡 해결 방법: tempGridSize의 초기값을 settings.gridSize에서 직접 가져오고
  // 렌더링 도중 상태를 강제 동기화하지 않도록 관리합니다.
  const [tempGridSize, setTempGridSize] = useState<string>(String(settings.gridSize));
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  // 💡 모달이 닫혀 있다가 "열리는 순간"에만 값을 초기화하는 로직
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setTempGridSize(String(settings.gridSize));
    }
  }

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const handleGridSizeBlur = () => {
    let finalValue = Number(tempGridSize);
    if (isNaN(finalValue) || finalValue < 1) {
      finalValue = 1;
    }
    setTempGridSize(String(finalValue));
    updateSettings({ gridSize: finalValue });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-white dark:bg-zinc-950 rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-zinc-800 transition-colors"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 dark:border-zinc-900 bg-white dark:bg-zinc-950">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-yellow-400 rounded-xl shadow-sm">
                <Settings2 className="w-5 h-5 text-yellow-900" />
              </div>
              <h2 className="text-xl font-black italic dark:text-white">Canvas <span className="text-yellow-500 not-italic">Settings.</span></h2>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors group"
            >
              <X className="w-5 h-5 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
            </button>
          </div>

          {/* Body */}
          <div className="px-8 py-4 max-h-[60vh] overflow-y-auto scrollbar-hide">
            <ToggleItem
              label="위치 이동 허용"
              desc="Ctrl + 방향키로 메모를 캔버스 안에서 이동합니다."
              icon={<Move className="w-4 h-4" />}
              checked={settings.isMoveEnabled}
              onChange={(v) => updateSettings({ isMoveEnabled: v })}
            />
            <ToggleItem
              label="크기 조절 허용"
              desc="Alt + 방향키로 메모의 너비와 높이를 조절합니다."
              icon={<Maximize2 className="w-4 h-4" />}
              checked={settings.isResizeEnabled}
              onChange={(v) => updateSettings({ isResizeEnabled: v })}
            />
            <ToggleItem
              label="좌표 및 크기 표시"
              desc="선택된 메모의 하단에 실시간 수치를 표시합니다."
              icon={<Hash className="w-4 h-4" />}
              checked={settings.showCoordinates}
              onChange={(v) => updateSettings({ showCoordinates: v })}
            />
            <ToggleItem
              label="겹침 영역 강조"
              desc="메모가 서로 겹치는 부분에 붉은색 레이어를 표시합니다."
              icon={<Layers className="w-4 h-4" />}
              checked={settings.showOverlapWarning}
              onChange={(v) => updateSettings({ showOverlapWarning: v })}
            />
            <ToggleItem
              label="격자 스냅 (Grid Snap)"
              desc="이동 시 설정된 격자 단위로 딱딱 맞춰 정렬합니다."
              icon={<Grid3X3 className="w-4 h-4" />}
              checked={settings.useGridSnap}
              onChange={(v) => updateSettings({ useGridSnap: v })}
            >
              <div className="flex items-center gap-3 bg-gray-50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800 transition-colors">
                <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">격자 크기</span>
                <div className="flex items-center gap-2 ml-auto">
                  <input
                    type="number"
                    value={tempGridSize}
                    onChange={(e) => setTempGridSize(e.target.value)}
                    onBlur={handleGridSizeBlur}
                    className="w-20 px-3 py-2 text-sm font-black bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:text-white transition-all text-center shadow-inner"
                    min="1"
                  />
                  <span className="text-[10px] text-zinc-400 font-black uppercase">px</span>
                </div>
              </div>
            </ToggleItem>
          </div>

          {/* Footer */}
          <div className="p-8 bg-white dark:bg-zinc-950 border-t border-gray-100 dark:border-zinc-900">
            <button 
              onClick={onClose} 
              className="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-black rounded-2xl hover:scale-[1.02] active:scale-95 transition-all text-base shadow-xl"
            >
              설정 완료
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}