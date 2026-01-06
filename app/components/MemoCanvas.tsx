'use client';

import { useEffect, useState, useRef } from 'react';
import ContentEditable from 'react-contenteditable';
import { useSave } from './SaveContext';
import { useSettings } from './SettingsContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Move } from 'lucide-react';

type Memo = {
  id: number;
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  fontColor: string;
  fontWeight: 'normal' | 'bold' | 'lighter' | 'bolder';
  fontFamily: string;
  backgroundColor: string;
  borderWidth: number;
  borderColor: string | null;
  overflow: string;
};

interface OverlapRect {
  key: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

type Props = { boardId: number | null };

export default function MemoCanvas({ boardId }: Props) {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [zIndexes, setZIndexes] = useState<Record<number, number>>({});
  const [maxZIndex, setMaxZIndex] = useState(10);

  const { registerSaveHandler, triggerSave } = useSave();
  const { settings } = useSettings();
  const memosRef = useRef<Memo[]>([]);

  const GRID_SIZE = settings.gridSize || 20;

  useEffect(() => {
    memosRef.current = memos;
  }, [memos]);

  useEffect(() => {
    if (!boardId) return;
    fetch(`/api/memos/${boardId}`)
      .then(res => res.json())
      .then((data: Memo[]) => {
        setMemos(data);
        setSelectedId(null);
      })
      .catch(err => console.error('메모 불러오기 실패:', err));
  }, [boardId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!boardId) return;

      const isCtrlOrMeta = e.ctrlKey || e.metaKey;
      const key = e.key.toLowerCase();

      if (isCtrlOrMeta && key === 's') {
        e.preventDefault();
        e.stopPropagation();
        triggerSave();
        return;
      }

      if (isCtrlOrMeta && key === 'a') {
        if (!selectedId) e.preventDefault();
        return;
      }

      if (!selectedId) return;

      const MOVE_STEP = settings.useGridSnap ? GRID_SIZE : 5;
      const RESIZE_STEP = 10;

      setMemos(prev => {
        return prev.map(m => {
          if (m.id !== selectedId) return m;
          let { x, y, width, height } = m;

          if (settings.isMoveEnabled && isCtrlOrMeta && e.key.startsWith('Arrow')) {
            e.preventDefault();
            if (e.key === 'ArrowLeft') x = Math.max(0, x - MOVE_STEP);
            if (e.key === 'ArrowRight') x = x + MOVE_STEP;
            if (e.key === 'ArrowUp') y = Math.max(0, y - MOVE_STEP);
            if (e.key === 'ArrowDown') y = y + MOVE_STEP;
          }

          if (settings.isResizeEnabled && e.altKey && e.key.startsWith('Arrow')) {
            e.preventDefault();
            if (e.key === 'ArrowLeft') width = Math.max(100, width - RESIZE_STEP);
            if (e.key === 'ArrowRight') width = width + RESIZE_STEP;
            if (e.key === 'ArrowUp') height = Math.max(80, height - RESIZE_STEP);
            if (e.key === 'ArrowDown') height = height + RESIZE_STEP;
          }
          return { ...m, x, y, width, height };
        });
      });
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [boardId, selectedId, settings, triggerSave, GRID_SIZE]);

  useEffect(() => {
    if (!boardId) return;
    registerSaveHandler(async () => {
      const res = await fetch(`/api/memos/${boardId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memos: memosRef.current }),
      });
      if (!res.ok) throw new Error('저장 실패');
    });
  }, [boardId, registerSaveHandler]);

  const overlapRects: OverlapRect[] = [];
  if (settings.showOverlapWarning) {
    for (let i = 0; i < memos.length; i++) {
      for (let j = i + 1; j < memos.length; j++) {
        const m1 = memos[i];
        const m2 = memos[j];
        const x1 = Math.max(m1.x, m2.x);
        const y1 = Math.max(m1.y, m2.y);
        const x2 = Math.min(m1.x + m1.width, m2.x + m2.width);
        const y2 = Math.min(m1.y + m1.height, m2.y + m2.height);
        if (x1 < x2 && y1 < y2) {
          overlapRects.push({ key: `${m1.id}-${m2.id}`, x: x1, y: y1, width: x2 - x1, height: y2 - y1 });
        }
      }
    }
  }

  if (!boardId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#fafafa] dark:bg-zinc-950 text-zinc-400 font-medium relative">
         <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] opacity-50" />
         <p className="z-10 italic font-black">캔버스를 선택하여 아이디어를 펼쳐보세요</p>
      </div>
    );
  }

  return (
    <div 
      className="relative flex-1 p-6 overflow-hidden bg-[#fafafa] dark:bg-zinc-950" 
      onClick={() => setSelectedId(null)}
    >
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:32px_32px]" />

      <AnimatePresence>
        {memos.map(memo => {
          const isSelected = selectedId === memo.id;
          const isOverlapping = overlapRects.some(rect => rect.key.includes(String(memo.id)));

          return (
            <motion.div
              key={memo.id}
              initial={false}
              animate={{ 
                x: memo.x,
                y: memo.y,
                width: memo.width,
                height: memo.height,
              }}
              // 💡 transition 설정 변경: 이동속도를 0으로 만들어 즉시 이동 구현
              transition={{
                x: { duration: 0 }, 
                y: { duration: 0 },
                width: { type: "spring", stiffness: 300, damping: 30 },
                height: { type: "spring", stiffness: 300, damping: 30 },
                scale: { duration: 0.2 }
              }}
              className={`absolute rounded-2xl shadow-sm border ${
                isSelected 
                  ? 'ring-4 ring-yellow-400/30 border-yellow-400 shadow-2xl z-[999]' 
                  : 'border-white dark:border-zinc-800'
              } ${isOverlapping ? 'border-red-500 border-dashed' : ''}`}
              style={{
                backgroundColor: memo.backgroundColor,
                zIndex: isSelected ? 999 : (zIndexes[memo.id] || 1),
                position: 'absolute',
                left: 0,
                top: 0,
                // 위치와 상관없는 속성만 CSS transition 적용
                transition: 'box-shadow 0.2s, border-color 0.2s, background-color 0.2s', 
              }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedId(memo.id);
                setZIndexes(prev => ({ ...prev, [memo.id]: maxZIndex + 1 }));
                setMaxZIndex(prev => prev + 1);
              }}
            >
              {isSelected && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: -20 }}
                  className="absolute -top-4 -right-2 bg-yellow-400 p-1.5 rounded-lg shadow-lg"
                >
                  <Sparkles className="w-3 h-3 text-yellow-900" />
                </motion.div>
              )}

              {settings.showCoordinates && isSelected && (
                <div className="absolute -bottom-8 left-0 right-0 flex justify-between pointer-events-none px-1">
                  <span className="bg-zinc-900/80 dark:bg-white/90 backdrop-blur-md text-white dark:text-zinc-900 text-[9px] font-black px-2 py-1 rounded-lg uppercase italic tracking-tighter">
                    pos {Math.round(memo.x)}, {Math.round(memo.y)}
                  </span>
                  <span className="bg-yellow-400 text-yellow-900 text-[9px] font-black px-2 py-1 rounded-lg uppercase italic tracking-tighter shadow-sm">
                    size {Math.round(memo.width)}×{Math.round(memo.height)}
                  </span>
                </div>
              )}

              <div className="w-full h-full relative p-1">
                <ContentEditable
                  html={memo.content}
                  onChange={e => setMemos(prev => prev.map(m => (m.id === memo.id ? { ...m, content: e.target.value } : m)))}
                  className="w-full h-full p-4 focus:outline-none overflow-hidden cursor-text"
                  style={{
                    fontSize: memo.fontSize,
                    fontWeight: memo.fontWeight,
                    fontFamily: memo.fontFamily,
                    color: memo.fontColor,
                    lineHeight: '1.5',
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {settings.showOverlapWarning && overlapRects.map(rect => (
        <div
          key={rect.key}
          className="absolute bg-red-500/20 border border-red-500/40 pointer-events-none z-[9998] rounded-lg animate-pulse"
          style={{
            left: rect.x,
            top: rect.y,
            width: rect.width,
            height: rect.height,
            backdropFilter: 'blur(2px)',
          }}
        />
      ))}
    </div>
  );
}