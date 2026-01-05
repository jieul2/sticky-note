"use client";

import { useState } from "react";
import MemoBoardList from "../components/MemoBoardList";
import MemoCanvas from "../components/MemoCanvas";

export default function LoadPage() {
  const [selectedBoardId, setSelectedBoardId] = useState<number | null>(null);

  return (
    <div className="flex h-screen">
      <MemoBoardList
        selectedBoardId={selectedBoardId}
        onSelect={setSelectedBoardId}
      />
      <MemoCanvas boardId={selectedBoardId} />
    </div>
  );
}
