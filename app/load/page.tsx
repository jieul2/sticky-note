"use client";

import { useState } from "react";
import MemoBoardList from "../components/MemoBoardList";
import MemoCanvas from "../components/MemoCanvas";

export default function LoadPage() {
  const [selectedBoardId, setSelectedBoardId] = useState<number | null>(null);

  return (
    // h-screen 대신 h-full을 사용하여 layout의 main 영역(h-16 제외 영역)에 딱 맞춥니다.
    <div className="flex h-full overflow-hidden">
      <MemoBoardList
        selectedBoardId={selectedBoardId}
        onSelect={setSelectedBoardId}
      />
      {/* MemoCanvas가 남은 영역을 모두 차지하도록 설정 */}
      <MemoCanvas boardId={selectedBoardId} />
    </div>
  );
}