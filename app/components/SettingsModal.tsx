'use client';

import { X } from 'lucide-react';
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
}

const ToggleItem = ({ label, desc, checked, onChange }: ToggleItemProps) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-zinc-800 last:border-0">
    <div className="flex flex-col">
      <span className="font-medium text-gray-900 dark:text-gray-100">{label}</span>
      <span className="text-xs text-gray-500 dark:text-gray-400">{desc}</span>
    </div>
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? 'bg-blue-600' : 'bg-gray-200 dark:bg-zinc-700'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);

export default function SettingsModal({ isOpen, onClose }: Props) {
  const { settings, updateSettings } = useSettings();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-zinc-800"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">환경 설정</h2>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="px-6 py-2">
            <ToggleItem
              label="위치 이동 허용"
              desc="Ctrl + 방향키로 메모를 이동합니다."
              checked={settings.isMoveEnabled}
              onChange={(v) => updateSettings({ isMoveEnabled: v })}
            />
            <ToggleItem
              label="크기 조절 허용"
              desc="Alt + 방향키로 메모 크기를 조절합니다."
              checked={settings.isResizeEnabled}
              onChange={(v) => updateSettings({ isResizeEnabled: v })}
            />
            <ToggleItem
              label="좌표 표시"
              desc="선택된 메모의 위치와 크기를 보여줍니다."
              checked={settings.showCoordinates}
              onChange={(v) => updateSettings({ showCoordinates: v })}
            />
            <ToggleItem
              label="겹침 경고 표시"
              desc="메모가 겹칠 때 빨간 점선을 표시합니다."
              checked={settings.showOverlapWarning}
              onChange={(v) => updateSettings({ showOverlapWarning: v })}
            />
            <ToggleItem
              label="격자 스냅 (Grid Snap)"
              desc="이동 시 20px 단위로 정렬합니다."
              checked={settings.useGridSnap}
              onChange={(v) => updateSettings({ useGridSnap: v })}
            />
          </div>

          <div className="p-4 bg-gray-50 dark:bg-zinc-900/50 flex justify-end">
            <button onClick={onClose} className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black font-medium rounded-lg hover:opacity-90 transition-opacity text-sm">
              닫기
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}