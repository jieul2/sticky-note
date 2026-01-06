'use client';

import { useEffect, useState, useRef } from 'react';
import ContentEditable from 'react-contenteditable';
import { useSave } from './SaveContext';
import { useSettings } from './SettingsContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import MemoPropertyModal from './MemoPropertyModal'; // 분리한 컴포넌트 import

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
  key: string; x: number; y: number; width: number; height: number;
}

export default function MemoCanvas({ boardId }: { boardId: number | null }) {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [zIndexes, setZIndexes] = useState<Record<number, number>>({});
  const [maxZIndex, setMaxZIndex] = useState(10);
  const [propertyModalMemo, setPropertyModalMemo] = useState<Memo | null>(null);

  const { registerSaveHandler, triggerSave } = useSave();
  const { settings, isSettingsOpen } = useSettings();
  const memosRef = useRef<Memo[]>([]);
  const mousePosRef = useRef({ x: 100, y: 100 });
  const containerRef = useRef<HTMLDivElement>(null);

  const GRID_SIZE = settings.gridSize || 20;

  useEffect(() => { memosRef.current = memos; }, [memos]);

  // 모달 열릴 때 선택 해제 로직
  useEffect(() => {
    if (propertyModalMemo || isSettingsOpen) {
      setSelectedId(null); 
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }
  }, [propertyModalMemo, isSettingsOpen]);

  // ... 마우스 트래킹 및 데이터 페칭 로직 (이전과 동일)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mousePosRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (!boardId) return;
    fetch(`/api/memos/${boardId}`)
      .then(res => res.json())
      .then((data: Memo[]) => { setMemos(data); setSelectedId(null); })
      .catch(err => console.error('메모 불러오기 실패:', err));
  }, [boardId]);

  const createNewMemo = async () => {
    if (!boardId) return;
    let { x, y } = mousePosRef.current;
    if (settings.useGridSnap) {
      x = Math.round(x / GRID_SIZE) * GRID_SIZE;
      y = Math.round(y / GRID_SIZE) * GRID_SIZE;
    }
    const newMemoData = {
      content: '', x: x - 20, y: y - 20, width: 250, height: 200,
      fontSize: 16, fontColor: '#18181b', fontWeight: 'normal',
      fontFamily: 'inherit', backgroundColor: '#ffffff',
      borderWidth: 1, borderColor: '#e5e7eb', overflow: 'hidden',
    };
    try {
      const res = await fetch(`/api/memos/${boardId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMemoData),
      });
      if (!res.ok) throw new Error('DB 저장 실패');
      const savedMemo = await res.json();
      setMemos(prev => [...prev, savedMemo]);
      setSelectedId(savedMemo.id);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!boardId) return;
      const isCtrlOrMeta = e.ctrlKey || e.metaKey;
      const isAlt = e.altKey;
      const key = e.key.toLowerCase();

      if (isAlt && key === 'n') { e.preventDefault(); createNewMemo(); return; }
      if (isCtrlOrMeta && key === 's') { e.preventDefault(); e.stopPropagation(); triggerSave(); return; }
      if (!selectedId) return;
      if (isCtrlOrMeta && key === 'e') {
        e.preventDefault();
        const targetMemo = memosRef.current.find(m => m.id === selectedId);
        if (targetMemo) setPropertyModalMemo(targetMemo);
        return;
      }

      const MOVE_STEP = settings.useGridSnap ? GRID_SIZE : 5;
      const RESIZE_STEP = 10;
      setMemos(prev => prev.map(m => {
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
      }));
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

  const deleteMemo = async (id: number) => {
    try {
      const res = await fetch(`/api/memos/detail/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`삭제 실패: ${res.status}`);
      setMemos(prev => prev.filter(m => m.id !== id));
      setSelectedId(null);
      setPropertyModalMemo(null);
    } catch (err) {
      console.error(err);
      alert('메모 삭제에 실패했습니다.');
    }
  };

  const updateMemoProperty = (id: number, updates: Partial<Memo>) => {
    setMemos(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
    if (propertyModalMemo?.id === id) {
      setPropertyModalMemo(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  // 겹침 경고 로직 (이전과 동일)
  const overlapRects: OverlapRect[] = [];
  if (settings.showOverlapWarning) {
    for (let i = 0; i < memos.length; i++) {
      for (let j = i + 1; j < memos.length; j++) {
        const m1 = memos[i]; const m2 = memos[j];
        const x1 = Math.max(m1.x, m2.x); const y1 = Math.max(m1.y, m2.y);
        const x2 = Math.min(m1.x + m1.width, m2.x + m2.width);
        const y2 = Math.min(m1.y + m1.height, m2.y + m2.height);
        if (x1 < x2 && y1 < y2) {
          overlapRects.push({ key: `${m1.id}-${m2.id}`, x: x1, y: y1, width: x2 - x1, height: y2 - y1 });
        }
      }
    }
  }

  if (!boardId) return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#fafafa] dark:bg-zinc-950 text-zinc-400 font-medium relative">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:32px_32px] opacity-50" />
      <p className="z-10 italic font-black uppercase tracking-tighter text-xl">캔버스를 선택하여 아이디어를 펼쳐보세요</p>
    </div>
  );

  return (
    <div ref={containerRef} className="relative flex-1 p-6 overflow-hidden bg-[#fafafa] dark:bg-zinc-950" onClick={() => setSelectedId(null)}>
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:32px_32px]" />

      <AnimatePresence>
        {memos.map(memo => {
          const isSelected = selectedId === memo.id;
          const isOverlapping = overlapRects.some(rect => rect.key.includes(String(memo.id)));

          return (
            <motion.div
              key={memo.id}
              initial={false}
              animate={{ x: memo.x, y: memo.y, width: memo.width, height: memo.height }}
              transition={{ 
                x: { duration: 0 }, y: { duration: 0 }, 
                width: { type: "spring", stiffness: 300, damping: 30 }, 
                height: { type: "spring", stiffness: 300, damping: 30 } 
              }}
              className={`absolute rounded-2xl shadow-sm border ${isSelected ? 'ring-4 ring-yellow-400/30 border-yellow-400 shadow-2xl z-[999]' : 'border-white dark:border-zinc-800'} ${isOverlapping ? 'border-red-500 border-dashed' : ''}`}
              style={{ 
                backgroundColor: memo.backgroundColor, 
                zIndex: isSelected ? 999 : (zIndexes[memo.id] || 1), 
                position: 'absolute', left: 0, top: 0,
                borderWidth: memo.borderWidth,
                borderColor: memo.borderColor || 'transparent',
                transition: 'box-shadow 0.2s, border-color 0.2s, background-color 0.2s' 
              }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedId(memo.id);
                setZIndexes(prev => ({ ...prev, [memo.id]: maxZIndex + 1 }));
                setMaxZIndex(prev => prev + 1);
              }}
            >
              {isSelected && (
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setPropertyModalMemo(memo); 
                  }}
                  className="absolute -top-4 -right-2 bg-yellow-400 p-1.5 rounded-lg shadow-lg z-[1000] cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-yellow-900" />
                </motion.button>
              )}

              {settings.showCoordinates && isSelected && (
                <div className="absolute -bottom-8 left-0 right-0 flex justify-between pointer-events-none px-1">
                  <span className="bg-zinc-900/80 dark:bg-white/90 backdrop-blur-md text-white dark:text-zinc-900 text-[9px] font-black px-2 py-1 rounded-lg uppercase italic tracking-tighter shadow-sm">
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
                  className={`w-full h-full p-4 focus:outline-none cursor-text ${memo.overflow === 'auto' ? 'overflow-auto scrollbar-thin scrollbar-thumb-zinc-300' : 'overflow-hidden'}`}
                  style={{ fontSize: memo.fontSize, fontWeight: memo.fontWeight, fontFamily: memo.fontFamily, color: memo.fontColor, lineHeight: '1.5' }}
                />
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* 겹침 영역 강조 레이어 */}
      {settings.showOverlapWarning && overlapRects.map(rect => (
        <div key={rect.key} className="absolute bg-red-500/20 border border-red-500/40 pointer-events-none z-[9998] rounded-lg animate-pulse" style={{ left: rect.x, top: rect.y, width: rect.width, height: rect.height, backdropFilter: 'blur(2px)' }} />
      ))}

      {/* 분리한 모달 사용 */}
      <AnimatePresence>
        {propertyModalMemo && (
          <MemoPropertyModal 
            memo={propertyModalMemo} 
            onClose={() => setPropertyModalMemo(null)}
            onUpdate={(updates) => updateMemoProperty(propertyModalMemo.id, updates)}
            onDelete={() => deleteMemo(propertyModalMemo.id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}