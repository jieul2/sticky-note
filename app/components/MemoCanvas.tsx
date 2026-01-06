'use client';

import { useEffect, useState, useRef } from 'react';
import ContentEditable from 'react-contenteditable';
import { useSave } from './SaveContext';
import { useSettings } from './SettingsContext';

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

type Props = { boardId: number | null };

export default function MemoCanvas({ boardId }: Props) {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [zIndexes, setZIndexes] = useState<Record<number, number>>({});
  const [maxZIndex, setMaxZIndex] = useState(10);

  const { registerSaveHandler } = useSave();
  const { settings } = useSettings();
  const memosRef = useRef<Memo[]>([]);

  useEffect(() => {
    memosRef.current = memos;
  }, [memos]);

  useEffect(() => {
    if (!boardId) return;
    fetch(`/api/memos/${boardId}`)
      .then(res => res.json())
      .then((data: Memo[]) => setMemos(data))
      .catch(err => console.error('메모 불러오기 실패:', err));
  }, [boardId]);

  const getOverlapRect = (m1: Memo, m2: Memo) => {
    const x1 = Math.max(m1.x, m2.x);
    const y1 = Math.max(m1.y, m2.y);
    const x2 = Math.min(m1.x + m1.width, m2.x + m2.width);
    const y2 = Math.min(m1.y + m1.height, m2.y + m2.height);
    if (x1 < x2 && y1 < y2) {
      return { x: x1, y: y1, width: x2 - x1, height: y2 - y1 };
    }
    return null;
  };

  const getAllOverlapRects = () => {
    const rects: { key: string; x: number; y: number; width: number; height: number }[] = [];
    for (let i = 0; i < memos.length; i++) {
      for (let j = i + 1; j < memos.length; j++) {
        const overlap = getOverlapRect(memos[i], memos[j]);
        if (overlap) {
          rects.push({ key: `${memos[i].id}-${memos[j].id}`, ...overlap });
        }
      }
    }
    return rects;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedId) return;

      //기본 조절단위 움직이는것 1px , 크기조절 10px
      const MOVE_STEP = settings.useGridSnap ? 20 : 5; 
      const RESIZE_STEP = 10;

      setMemos(prev => {
        return prev.map(m => {
          if (m.id !== selectedId) return m;
          let { x, y, width, height } = m;

          if (settings.isMoveEnabled && e.ctrlKey && e.key.startsWith('Arrow')) {
            e.preventDefault();
            if (e.key === 'ArrowLeft') x = Math.max(0, x - MOVE_STEP);
            if (e.key === 'ArrowRight') x = x + MOVE_STEP;
            if (e.key === 'ArrowUp') y = Math.max(0, y - MOVE_STEP);
            if (e.key === 'ArrowDown') y = y + MOVE_STEP;
          }

          if (settings.isResizeEnabled && e.altKey && e.key.startsWith('Arrow')) {
            e.preventDefault();
            if (e.key === 'ArrowLeft') width = Math.max(50, width - RESIZE_STEP);
            if (e.key === 'ArrowRight') width = width + RESIZE_STEP;
            if (e.key === 'ArrowUp') height = Math.max(50, height - RESIZE_STEP);
            if (e.key === 'ArrowDown') height = height + RESIZE_STEP;
          }
          return { ...m, x, y, width, height };
        });
      });
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, settings]);

  const handleChange = (id: number, html: string) => {
    setMemos(prev => prev.map(m => (m.id === id ? { ...m, content: html } : m)));
  };

  const handleMemoClick = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedId(id);
    setZIndexes(prev => ({ ...prev, [id]: maxZIndex + 1 }));
    setMaxZIndex(prev => prev + 1);
  };

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

  if (!boardId) return <div className="flex-1 p-6 text-center text-gray-500">보드를 선택하세요</div>;

  const overlapRects = getAllOverlapRects();

  return (
    <div className="relative flex-1 p-6 overflow-hidden bg-gray-50 dark:bg-zinc-900" onClick={() => setSelectedId(null)}>
      {memos.map(memo => (
        <div
          key={memo.id}
          className={`absolute rounded-lg shadow-sm border bg-white dark:bg-zinc-800 transition-shadow ${
            selectedId === memo.id ? 'ring-2 ring-blue-500 border-transparent shadow-lg' : 'border-gray-200 dark:border-zinc-700'
          }`}
          style={{
            left: memo.x,
            top: memo.y,
            width: memo.width,
            height: memo.height,
            backgroundColor: memo.backgroundColor,
            borderWidth: memo.borderWidth,
            borderColor: memo.borderColor || undefined,
            overflow: 'hidden',
            zIndex: zIndexes[memo.id] || 1,
            transition: 'box-shadow 0.2s, transform 0.1s', 
          }}
          onClick={(e) => handleMemoClick(memo.id, e)}
        >
          <ContentEditable
            html={memo.content}
            onChange={e => handleChange(memo.id, e.target.value)}
            className="w-full h-full p-3 focus:outline-none"
            style={{
              fontSize: memo.fontSize,
              fontWeight: memo.fontWeight,
              fontFamily: memo.fontFamily,
              color: memo.fontColor,
              overflow: 'hidden',
            }}
          />

          {/* 설정이 ON이고 메모가 선택되었을 때만 좌표 인디케이터 표시 */}
          {settings.showCoordinates && selectedId === memo.id && (
            <div className="absolute bottom-1 right-1 z-50 flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/70 text-[10px] font-mono text-white pointer-events-none select-none backdrop-blur-sm">
              <span>X:{memo.x} Y:{memo.y}</span>
              <span className="opacity-50">|</span>
              <span>{memo.width}×{memo.height}</span>
            </div>
          )}
        </div>
      ))}

      {settings.showOverlapWarning && overlapRects.map(rect => (
        <div
          key={rect.key}
          className="absolute border border-dashed border-red-500 pointer-events-none"
          style={{
            left: rect.x,
            top: rect.y,
            width: rect.width,
            height: rect.height,
            zIndex: 9999,
            backgroundColor: 'rgba(239, 68, 68, 0.05)',
          }}
        />
      ))}
    </div>
  );
}