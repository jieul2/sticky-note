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
  overflow: 'visible' | 'hidden' | 'scroll' | 'auto';
};

type Props = { boardId: number | null };

export default function MemoCanvas({ boardId }: Props) {
  const [memos, setMemos] = useState<Memo[]>([]);
  const { registerSaveHandler } = useSave();

  // 최신 memos 참조
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

  // 메모 내용 변경
  const handleChange = (id: number, html: string) => {
    setMemos(prev =>
      prev.map(m => (m.id === id ? { ...m, content: html } : m))
    );
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

  return (
    <div className="relative flex-1 p-6 overflow-hidden">
      {memos.map(memo => (
        <div
          key={memo.id}
          className="absolute rounded shadow-md border border-gray-300 dark:border-gray-600"
          style={{
            left: memo.x,
            top: memo.y,
            width: memo.width,
            height: memo.height,
            backgroundColor: memo.backgroundColor,
            borderWidth: memo.borderWidth,
            borderColor: memo.borderColor || undefined,
            overflow: memo.overflow,
          }}
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
            }}
          />
        </div>
      ))}
    </div>
  );
}
