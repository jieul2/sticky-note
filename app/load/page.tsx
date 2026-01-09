"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import MemoBoardList from "../components/MemoBoardList";
import MemoCanvas from "../components/MemoCanvas";

function LoadPageContent() {
  const searchParams = useSearchParams();

  // 1. 초기 렌더링 시점에 URL의 ID를 상태로 고정 (기능 합침)
  const [localSelectedId, setLocalSelectedId] = useState<number | null>(() => {
    const idParam = searchParams.get("id");
    return idParam ? Number(idParam) : null;
  });

  // 2. URL 파라미터 제거 로직 (기능 합침)
  // localSelectedId에 값이 저장된 후, 주소창만 /load로 깔끔하게 바꿉니다.
  useEffect(() => {
    if (searchParams.has("id")) {
      window.history.replaceState({}, "", "/load");
    }
  }, [searchParams]);

  return (
    // h-screen 대신 h-full을 사용하여 layout의 main 영역에 맞춥니다.
    <div className="flex h-full overflow-hidden">
      <MemoBoardList
        selectedBoardId={localSelectedId}
        onSelect={setLocalSelectedId} // 컴포넌트 내부 interface에 맞춰 onSelect 사용
      />
      {/* MemoCanvas가 남은 영역을 모두 차지하도록 설정 */}
      <MemoCanvas boardId={localSelectedId} />
    </div>
  );
}

export default function LoadPage() {
  return (
    <Suspense fallback={
      <div className="flex h-full items-center justify-center text-muted-foreground">
        보드 목록을 불러오는 중...
      </div>
    }>
      <LoadPageContent />
    </Suspense>
  );
}