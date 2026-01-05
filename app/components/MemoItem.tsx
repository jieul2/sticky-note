"use client";

type MemoItemProps = {
  memo: {
    id: number;
    content: string;
    x: number;
    y: number;
    width: number;
    height: number;
    backgroundColor: string;
  };
};

export default function MemoItem({ memo }: MemoItemProps) {
  return (
    <div
      className="absolute rounded shadow-md p-2"
      style={{
        left: memo.x,
        top: memo.y,
        width: memo.width,
        height: memo.height,
        background: memo.backgroundColor,
      }}
    >
      {memo.content}
    </div>
  );
}
