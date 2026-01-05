'use client';

type Props = {
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
};

export default function MemoEditor({ content, setContent }: Props) {
  return (
    <textarea
      className="w-full h-64 p-3 border rounded resize-none"
      value={content}
      onChange={(e) => setContent(e.target.value)}
      autoFocus
    />
  );
}
