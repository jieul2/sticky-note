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

  const { registerSaveHandler, triggerSave } = useSave();
  const { settings } = useSettings();
  const memosRef = useRef<Memo[]>([]);

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

  // 키보드 이벤트 핸들러 강화
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. 보드 자체가 없으면 즉시 리턴
      if (!boardId) return;

      const isCtrlOrMeta = e.ctrlKey || e.metaKey;
      const key = e.key.toLowerCase();

      // 2. Ctrl + S 저장 로직 (최우선순위)
      if (isCtrlOrMeta && key === 's') {
        // 특정 메모(글쓰는 칸)가 선택되어 있거나, 보드 내부를 클릭한 상태라면 저장 실행
        e.preventDefault();
        e.stopPropagation(); // 이벤트가 밖으로 새나가지 않게 막음
        
        console.log("저장 시도... 현재 선택된 메모 ID:", selectedId);
        triggerSave();
        return;
      }

      // 3. Ctrl + A 전체선택 방지
      if (isCtrlOrMeta && key === 'a') {
        if (!selectedId) {
          e.preventDefault();
        }
        return;
      }

      // 4. 메모 조작 (이동/크기)
      if (!selectedId) return;

      const MOVE_STEP = settings.useGridSnap ? 20 : 1; 
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
            if (e.key === 'ArrowLeft') width = Math.max(50, width - RESIZE_STEP);
            if (e.key === 'ArrowRight') width = width + RESIZE_STEP;
            if (e.key === 'ArrowUp') height = Math.max(50, height - RESIZE_STEP);
            if (e.key === 'ArrowDown') height = height + RESIZE_STEP;
          }
          return { ...m, x, y, width, height };
        });
      });
    };

    // 'true' (캡처링)를 사용해 브라우저 기본 단축키보다 먼저 가로챕니다.
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [boardId, selectedId, settings, triggerSave]);

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

  if (!boardId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-zinc-900 text-gray-500 font-medium">
        메모지를 선택하세요
      </div>
    );
  }

  const overlapRects = [];
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

  return (
    <div className="relative flex-1 p-6 overflow-hidden bg-gray-50 dark:bg-zinc-900" onClick={() => setSelectedId(null)}>
      {memos.map(memo => (
        <div
          key={memo.id}
          className={`absolute rounded-none shadow-sm border bg-white dark:bg-zinc-800 transition-shadow ${
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
          onClick={(e) => {
            e.stopPropagation();
            setSelectedId(memo.id);
            setZIndexes(prev => ({ ...prev, [memo.id]: maxZIndex + 1 }));
            setMaxZIndex(prev => prev + 1);
          }}
        >
          <ContentEditable
            html={memo.content}
            onChange={e => setMemos(prev => prev.map(m => (m.id === memo.id ? { ...m, content: e.target.value } : m)))}
            className="w-full h-full p-3 focus:outline-none"
            style={{
              fontSize: memo.fontSize,
              fontWeight: memo.fontWeight,
              fontFamily: memo.fontFamily,
              color: memo.fontColor,
              overflow: 'hidden',
            }}
          />
        </div>
      ))}
    </div>
  );
}