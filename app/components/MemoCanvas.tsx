'use client';

import { useEffect, useState } from 'react';

type Memo = {
  id: number;
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  backgroundColor: string;
};

type Props = {
  boardId: number | null;
};

export default function MemoCanvas({ boardId }: Props) {
  const [memos, setMemos] = useState<Memo[]>([]);

  useEffect(() => {
    if (!boardId) return;
    fetch(`/api/memos/${boardId}`)
      .then((res) => res.json())
      .then(setMemos);
  }, [boardId]);

  const handleChange = (id: number, newContent: string) => {
    setMemos((prev) =>
      prev.map((m) => (m.id === id ? { ...m, content: newContent } : m))
    );
  };

  if (!boardId) return <div className="flex-1 p-6">보드를 선택하세요</div>;

  return (
    <div className="relative flex-1 p-6">
      {memos.map((memo) => (
        <div
          key={memo.id}
          className="absolute rounded shadow-md p-2"
          style={{
            left: memo.x,
            top: memo.y,
            width: memo.width,
            height: memo.height,
            background: memo.backgroundColor,
            overflow: 'auto',
          }}
          contentEditable
          suppressContentEditableWarning
          onInput={(e) =>
            handleChange(memo.id, (e.target as HTMLDivElement).innerText)
          }
        >
          {memo.content}
        </div>
      ))}
    </div>
  );
}
