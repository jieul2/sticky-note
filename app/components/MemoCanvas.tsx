'use client';

import { useEffect, useState, useRef } from 'react';
import ContentEditable from 'react-contenteditable';
import { useSave } from './SaveContext';

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
  const memosRef = useRef<Memo[]>([]);

  useEffect(() => {
    memosRef.current = memos;
  }, [memos]);

  // 메모 불러오기
  useEffect(() => {
    if (!boardId) return;
    fetch(`/api/memos/${boardId}`)
      .then(res => res.json())
      .then((data: Memo[]) => setMemos(data))
      .catch(err => console.error('메모 불러오기 실패:', err));
  }, [boardId]);

  // 겹친 영역(사각형)을 계산하는 함수
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

  // 모든 메모 쌍에 대해 겹친 영역 리스트를 가져옴
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

  // 키보드 조작 이벤트 핸들러 (Ctrl+이동, Alt+크기조절)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedId) return;

      const MOVE_STEP = 10;
      const RESIZE_STEP = 10;

      setMemos(prev => {
        return prev.map(m => {
          if (m.id !== selectedId) return m;

          let nextX = m.x;
          let nextY = m.y;
          let nextWidth = m.width;
          let nextHeight = m.height;

          // 위치 이동 (Ctrl + 방향키) 및 음수 방지
          if (e.ctrlKey && e.key.startsWith('Arrow')) {
            e.preventDefault();
            if (e.key === 'ArrowLeft') nextX = Math.max(0, m.x - MOVE_STEP);
            if (e.key === 'ArrowRight') nextX = m.x + MOVE_STEP;
            if (e.key === 'ArrowUp') nextY = Math.max(0, m.y - MOVE_STEP);
            if (e.key === 'ArrowDown') nextY = m.y + MOVE_STEP;
          }

          // 크기 조절 (Alt + 방향키)
          if (e.altKey && e.key.startsWith('Arrow')) {
            e.preventDefault();
            if (e.key === 'ArrowLeft') nextWidth = Math.max(50, m.width - RESIZE_STEP);
            if (e.key === 'ArrowRight') nextWidth = m.width + RESIZE_STEP;
            if (e.key === 'ArrowUp') nextHeight = Math.max(50, m.height - RESIZE_STEP);
            if (e.key === 'ArrowDown') nextHeight = m.height + RESIZE_STEP;
          }

          return { ...m, x: nextX, y: nextY, width: nextWidth, height: nextHeight };
        });
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId]);

  const handleChange = (id: number, html: string) => {
    setMemos(prev => prev.map(m => (m.id === id ? { ...m, content: html } : m)));
  };

  const handleMemoClick = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedId(id);
    setZIndexes(prev => ({ ...prev, [id]: maxZIndex + 1 }));
    setMaxZIndex(prev => prev + 1);
  };

  // 저장 버튼 클릭 시만 서버로 PUT
  useEffect(() => {
    if (!boardId) return;
    registerSaveHandler(async () => {
      const res = await fetch(`/api/memos/${boardId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memos: memosRef.current }),
      });
      if (!res.ok) throw new Error('저장 실패');
      console.log('메모 저장 완료!');
    });
  }, [boardId, registerSaveHandler]);

  if (!boardId) return <div className="flex-1 p-6">보드를 선택하세요</div>;

  const overlapRects = getAllOverlapRects();

  return (
    <div className="relative flex-1 p-6 overflow-hidden" onClick={() => setSelectedId(null)}>
      {/* 1. 실제 메모들 */}
      {memos.map(memo => (
        <div
          key={memo.id}
          className={`absolute rounded shadow-md border ${
            selectedId === memo.id ? 'ring-2 ring-blue-500 border-transparent' : 'border-gray-300 dark:border-gray-600'
          }`}
          style={{
            left: memo.x,
            top: memo.y,
            width: memo.width,
            height: memo.height,
            backgroundColor: memo.backgroundColor,
            borderWidth: memo.borderWidth,
            borderColor: memo.borderColor || undefined,
            overflow: 'hidden', // 스크롤 방지
            zIndex: zIndexes[memo.id] || 1,
            transition: 'all 0.1s ease-out',
          }}
          onClick={(e) => handleMemoClick(memo.id, e)}
        >
          <ContentEditable
            html={memo.content}
            onChange={e => handleChange(memo.id, e.target.value)}
            className="w-full h-full p-2 focus:outline-none"
            style={{
              fontSize: memo.fontSize,
              fontWeight: memo.fontWeight,
              fontFamily: memo.fontFamily,
              color: memo.fontColor,
              overflow: 'hidden', // 내부 스크롤 방지
            }}
          />
        </div>
      ))}

      {/* 2. 겹친 영역 표시 (가늘게 수정됨) */}
      {overlapRects.map(rect => (
        <div
          key={rect.key}
          className="absolute border border-dashed border-red-500 pointer-events-none"
          style={{
            left: rect.x,
            top: rect.y,
            width: rect.width,
            height: rect.height,
            zIndex: 9999, // 최상단
            backgroundColor: 'rgba(239, 68, 68, 0.05)', // 배경 강조색도 더 옅게 조정
          }}
        />
      ))}
    </div>
  );
}