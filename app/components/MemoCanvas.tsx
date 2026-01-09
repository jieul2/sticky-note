'use client';

import { useEffect, useState, useRef } from 'react';
import ContentEditable from 'react-contenteditable';
import { useSave } from './SaveContext';
import { useSettings } from './SettingsContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import MemoPropertyModal from './MemoPropertyModal';

// 메모 데이터 타입 정의
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
  textAlign: 'left' | 'center' | 'right';
  verticalAlign: 'top' | 'center' | 'bottom';
};

interface OverlapRect {
  key: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function MemoCanvas({ boardId }: { boardId: number | null }) {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [zIndexes, setZIndexes] = useState<Record<number, number>>({});
  const [maxZIndex, setMaxZIndex] = useState(10);
  const [propertyModalMemoId, setPropertyModalMemoId] = useState<number | null>(null);

  const { registerSaveHandler, triggerSave } = useSave();
  const { settings, isSettingsOpen } = useSettings();
  
  const memosRef = useRef<Memo[]>([]);
  const mousePosRef = useRef({ x: 100, y: 100 });
  const containerRef = useRef<HTMLDivElement>(null);

  const GRID_SIZE = settings.gridSize || 20;

  useEffect(() => {
    memosRef.current = memos;
  }, [memos]);

  useEffect(() => {
    if (propertyModalMemoId || isSettingsOpen) {
      setSelectedId(null);
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }
  }, [propertyModalMemoId, isSettingsOpen]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mousePosRef.current = {
        x: e.clientX - rect.left + containerRef.current.scrollLeft,
        y: e.clientY - rect.top + containerRef.current.scrollTop,
      };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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

  const createNewMemo = async () => {
    if (!boardId) return;

    let { x, y } = mousePosRef.current;
    if (settings.useGridSnap) {
      x = Math.round(x / GRID_SIZE) * GRID_SIZE;
      y = Math.round(y / GRID_SIZE) * GRID_SIZE;
    }

    const newMemoData = {
      content: '',
      x: Math.max(0, x - 125),
      y: Math.max(0, y - 100),
      width: 250,
      height: 200,
      fontSize: 16,
      fontColor: '#18181b',
      fontWeight: 'normal' as const,
      fontFamily: 'inherit',
      backgroundColor: '#ffffff',
      borderWidth: 1,
      borderColor: '#e5e7eb',
      overflow: 'hidden',
      textAlign: 'left' as const,
      verticalAlign: 'top' as const,
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
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!boardId) return;
      const isCtrlOrMeta = e.ctrlKey || e.metaKey;
      const key = e.key.toLowerCase();

      if (e.altKey && key === 'n') {
        e.preventDefault();
        createNewMemo();
        return;
      }

      if (isCtrlOrMeta && key === 's') {
        e.preventDefault();
        e.stopPropagation();
        triggerSave();
        return;
      }

      if (!selectedId) return;

      if (isCtrlOrMeta && key === 'e') {
        e.preventDefault();
        setPropertyModalMemoId(selectedId);
        return;
      }

      const MOVE_STEP = settings.useGridSnap ? GRID_SIZE : 5;
      const RESIZE_STEP = 10;

      setMemos(prev =>
        prev.map(m => {
          if (m.id !== selectedId) return m;

          let { x, y, width, height } = m;

          if (settings.isMoveEnabled && isCtrlOrMeta && e.key.startsWith('Arrow')) {
            e.preventDefault();
            if (e.key === 'ArrowLeft') x = Math.max(0, x - MOVE_STEP);
            if (e.key === 'ArrowRight') x += MOVE_STEP;
            if (e.key === 'ArrowUp') y = Math.max(0, y - MOVE_STEP);
            if (e.key === 'ArrowDown') y += MOVE_STEP;
          }

          if (settings.isResizeEnabled && e.altKey && e.key.startsWith('Arrow')) {
            e.preventDefault();
            if (e.key === 'ArrowLeft') width = Math.max(100, width - RESIZE_STEP);
            if (e.key === 'ArrowRight') width += RESIZE_STEP;
            if (e.key === 'ArrowUp') height = Math.max(80, height - RESIZE_STEP);
            if (e.key === 'ArrowDown') height += RESIZE_STEP;
          }

          return { ...m, x, y, width, height };
        })
      );
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      setPropertyModalMemoId(null);
    } catch (err) {
      console.error(err);
      alert('메모 삭제에 실패했습니다.');
    }
  };

  const updateMemoProperty = (id: number, updates: Partial<Memo>) => {
    setMemos(prev =>
      prev.map(m => (m.id === id ? { ...m, ...updates } : m))
    );
  };

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
          overlapRects.push({
            key: `${m1.id}-${m2.id}`,
            x: x1,
            y: y1,
            width: x2 - x1,
            height: y2 - y1,
          });
        }
      }
    }
  }

  const currentModalMemo = memos.find(m => m.id === propertyModalMemoId) || null;

  if (!boardId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#fafafa] dark:bg-zinc-950 text-zinc-400 font-medium relative">
        <div className="absolute inset-0 bg-[radial-gradient(var(--dot-color)_1px,transparent_1px)] bg-size-[32px_32px] opacity-50" />
        <p className="z-10 italic font-black uppercase tracking-tighter text-xl">캔버스를 선택하여 아이디어를 펼쳐보세요</p>
      </div>
    );
  }

  const maxRight = Math.max(...memos.map(m => m.x + m.width), 0);
  const maxBottom = Math.max(...memos.map(m => m.y + m.height), 0);

  return (
    <div
      ref={containerRef}
      className="relative flex-1 p-20 overflow-auto bg-[#fafafa] dark:bg-zinc-950 scroll-smooth"
      style={{
        // 💡 CSS 변수인 --dot-color를 사용하여 모드별 색상 대응
        backgroundImage: 'radial-gradient(circle, var(--dot-color) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }}
      onClick={() => setSelectedId(null)}
    >
      <AnimatePresence>
        {memos.map(memo => {
          const isSelected = selectedId === memo.id;
          const isOverlapping = overlapRects.some(rect => rect.key.includes(String(memo.id)));

          return (
            <motion.div
              key={memo.id}
              initial={false}
              animate={{ left: memo.x, top: memo.y, width: memo.width, height: memo.height }}
              transition={{
                left: { duration: 0.1 },
                top: { duration: 0.1 },
                width: { type: 'tween', duration: 0 },
                height: { type: 'tween', duration: 0 },
              }}
              className={`absolute rounded-2xl shadow-sm border transition-[box-shadow,border-color,background-color] duration-200 ${
                isSelected
                  ? 'ring-4 ring-yellow-400/30 border-yellow-400 shadow-2xl z-999'
                  : 'border-white dark:border-zinc-800'
              } ${isOverlapping && settings.showOverlapWarning ? 'border-red-500 border-dashed' : ''}`}
              style={{
                backgroundColor: memo.backgroundColor,
                zIndex: isSelected ? 999 : (zIndexes[memo.id] || 1),
                borderWidth: memo.borderWidth,
                borderColor: memo.borderColor || 'transparent',
              }}
              onClick={e => {
                e.stopPropagation();
                setSelectedId(memo.id);
                setZIndexes(prev => ({ ...prev, [memo.id]: maxZIndex + 1 }));
                setMaxZIndex(prev => prev + 1);
              }}
            >
               {isSelected && settings.showCoordinates && (
                  <div className="absolute -bottom-8 left-0 right-0 flex justify-between px-1 pointer-events-none z-1001">
                    <span className="bg-zinc-900/80 text-white text-[11px] px-2.5 py-1.5 rounded-lg">
                      pos {Math.round(memo.x)}, {Math.round(memo.y)}
                    </span>
                    <span className="bg-yellow-400 text-yellow-900 text-[11px] px-2.5 py-1.5 rounded-lg">
                      size {Math.round(memo.width)}×{Math.round(memo.height)}
                    </span>
                  </div>
                )}

              {isSelected && (
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setPropertyModalMemoId(memo.id); 
                  }}
                  className="absolute -top-4 -right-2 bg-yellow-400 p-2 rounded-lg shadow-lg z-1000 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-yellow-900" />
                </motion.button>
              )}

              <div 
                className={`w-full h-full flex flex-col ${
                  memo.verticalAlign === 'center' 
                    ? 'justify-center' 
                    : memo.verticalAlign === 'bottom' 
                    ? 'justify-end' 
                    : 'justify-start'
                }`}
              >
                <ContentEditable
                  html={memo.content}
                  spellCheck={false}
                  onChange={e =>
                    setMemos(prev =>
                      prev.map(m => (m.id === memo.id ? { ...m, content: e.target.value } : m))
                    )
                  }
                  className={`w-full h-full p-4 focus:outline-none cursor-text ${
                    memo.overflow === 'auto' ? 'overflow-auto scrollbar-thin' : 'overflow-hidden'
                  }`}
                  style={{
                    fontSize: memo.fontSize,
                    fontWeight: memo.fontWeight,
                    fontFamily: memo.fontFamily,
                    color: memo.fontColor,
                    textAlign: memo.textAlign,
                    lineHeight: '1.5',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'inherit'
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      <div 
        className="pointer-events-none" 
        style={{ 
          position: 'absolute', 
          left: maxRight + 200, 
          top: maxBottom + 200, 
          width: 1, 
          height: 1 
        }} 
      />

      {settings.showOverlapWarning && overlapRects.map(rect => (
        <div 
          key={rect.key} 
          className="absolute bg-red-500/20 border border-red-500/40 pointer-events-none z-9998 rounded-lg animate-pulse" 
          style={{ 
            left: rect.x, 
            top: rect.y, 
            width: rect.width, 
            height: rect.height, 
            backdropFilter: 'blur(2px)' 
          }} 
        />
      ))}

      <AnimatePresence>
        {currentModalMemo && (
          <MemoPropertyModal
            memo={currentModalMemo}
            onClose={() => setPropertyModalMemoId(null)}
            onUpdate={updates =>
              updateMemoProperty(currentModalMemo.id, updates)
            }
            onDelete={() => deleteMemo(currentModalMemo.id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}