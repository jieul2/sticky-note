"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type MemoBoard = {
  id: number;
  title: string;
  background: string;
  user?: { name: string | null };
};

export default function MemoBoardList({
  selectedBoardId,
  onSelect,
}: {
  selectedBoardId: number | null;
  onSelect: (id: number) => void;
}) {
  const [boards, setBoards] = useState<MemoBoard[]>([]);
  const [isOpen, setIsOpen] = useState(true); // 기본 닫힘
  const [contentVisible, setContentVisible] = useState(false); // 내용 렌더링 제어

  useEffect(() => {
    fetch("/api/memoboards")
      .then(res => {
        if (!res.ok) throw new Error("로그인 필요");
        return res.json();
      })
      .then(setBoards)
      .catch(err => console.error(err));
  }, []);

  const toggleSidebar = () => {
    if (isOpen) {
      // 닫을 때: 내용 먼저 제거
      setContentVisible(false);
      // 조금 지연 후 폭 줄이기
      setTimeout(() => setIsOpen(false), 10);
    } else {
      // 열 때: 폭 먼저 늘리기
      setIsOpen(true);
    }
  };

  return (
    <motion.aside
      animate={{ width: isOpen ? 240 : 48 }}
      transition={{ type: "tween", duration: 0.3 }}
      className="relative flex flex-col bg-white shadow-md"
    >
      {/* 토글 버튼 */}
      <button
        onClick={toggleSidebar}
        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm shadow-sm hover:bg-gray-300 focus:outline-none"
      >
        {isOpen ? "◀" : "▶"}
      </button>

      {/* 내용 영역: 폭 완전히 열렸을 때만 렌더링 */}
      {isOpen && contentVisible && (
        <div className="flex-1 overflow-y-auto p-4 mt-10">
          {/* 사용자 이름 제목 */}
          <h3 className="mb-3 font-bold">
            📁 {boards[0]?.user?.name || "익명"}의 보드
          </h3>

          {/* 보드 목록 */}
          {boards.map(board => (
            <div
              key={board.id}
              onClick={() => onSelect(board.id)}
              className={`mb-2 cursor-pointer rounded p-2 ${
                selectedBoardId === board.id ? "border-2 border-black" : ""
              }`}
              style={{ background: board.background }} // 메모지 색상 유지
            >
              {board.title}
            </div>
          ))}
        </div>
      )}

      {/* 열린 상태에서만 border-r */}
      {isOpen && (
        <div className="absolute top-0 right-0 h-full border-r border-gray-300 pointer-events-none" />
      )}

      {/* 사이드바 열릴 때 내용 fade-in */}
      {isOpen && !contentVisible && (
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{ pointerEvents: "none" }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            onAnimationComplete={() => setContentVisible(true)}
          />
        </div>
      )}
    </motion.aside>
  );
}
