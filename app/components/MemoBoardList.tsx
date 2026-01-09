'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { 
  ChevronLeft, 
  ChevronRight, 
  FolderOpen, 
  Plus,
  Layout,
  GripVertical
} from "lucide-react";

type MemoBoard = {
  id: number;
  title: string;
  background: string;
  index: number;
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
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const res = await fetch("/api/memoboards");
        
        if (res.status === 401) {
          router.push("/login");
          return;
        }

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "데이터 로드 실패");
        }

        const data = await res.json();
        setBoards(data);
      } catch (err: unknown) {
        // any 대신 unknown을 사용하고 Error 인스턴스인지 확인합니다.
        if (err instanceof Error) {
          console.error("Fetch Error:", err.message);
        } else {
          console.error("An unknown error occurred");
        }
      }
    };

    fetchBoards();
  }, [router]);

  const handleReorder = async (newOrder: MemoBoard[]) => {
    setBoards(newOrder);
    try {
      const res = await fetch("/api/memoboards/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ boardIds: newOrder.map(b => b.id) }),
      });
      if (!res.ok) throw new Error("순서 저장 실패");
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
      }
    }
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <motion.aside
      animate={{ width: isOpen ? 260 : 64 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="relative flex flex-col bg-white dark:bg-zinc-950 border-r border-gray-100 dark:border-zinc-800 shadow-xl overflow-hidden transition-colors duration-300"
    >
      {/* 상단 헤더 & 토글 버튼 */}
      <div className="flex items-center h-16 px-4 shrink-0 relative">
        <AnimatePresence mode="wait">
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-2 flex-1 overflow-hidden"
            >
              <div className="p-1.5 bg-yellow-400 rounded-lg shadow-sm shrink-0">
                <Layout className="w-4 h-4 text-yellow-900" />
              </div>
              <span className="font-black text-sm italic dark:text-white whitespace-nowrap text-ellipsis overflow-hidden">
                My Boards
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        
        <button
          onClick={toggleSidebar}
          className={`w-8 h-8 rounded-xl text-zinc-500 bg-gray-50 dark:bg-zinc-900 flex items-center justify-center hover:bg-yellow-400 hover:text-yellow-900 transition-all active:scale-90 shadow-sm shrink-0 ${!isOpen ? 'mx-auto' : ''}`}
        >
          {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      {/* 내용 영역 */}
      <div 
        className="flex-1 overflow-y-auto px-3 py-2 overflow-x-hidden"
        style={{
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        <div className="space-y-6">
          <div>
            <div className={`flex items-center gap-2 px-3 mb-4 transition-all duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 translate-x-[-10px] pointer-events-none'}`}>
              <FolderOpen size={12} className="text-zinc-400 shrink-0" />
              <span className="text-xs font-black text-zinc-400 uppercase tracking-widest whitespace-nowrap">
                {boards[0]?.user?.name || "User"}&apos;s Workspace
              </span>
            </div>

            <Reorder.Group axis="y" values={boards} onReorder={handleReorder} className="space-y-1.5">
              {boards.map(board => {
                const isSelected = selectedBoardId === board.id;
                
                return (
                  <Reorder.Item key={board.id} value={board} className="relative list-none outline-none">
                    <motion.div
                      whileHover={{ x: isOpen ? 4 : 0 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onSelect(board.id)}
                      className={`group relative flex items-center transition-all cursor-pointer ${
                        isOpen ? "gap-3 p-3.5 rounded-2xl" : "justify-center p-0 h-12 w-12 mx-auto rounded-xl"
                      } ${
                        isSelected 
                          ? "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200/50 dark:border-yellow-700/30" 
                          : "hover:bg-gray-50 dark:hover:bg-zinc-900 border border-transparent"
                      }`}
                    >
                      {isOpen && (
                        <GripVertical size={14} className="text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing" />
                      )}

                      <div 
                        className={`rounded-full shadow-inner ring-2 ring-white dark:ring-zinc-900 shrink-0 ${isOpen ? 'w-2.5 h-2.5' : 'w-3 h-3'}`}
                        style={{ backgroundColor: board.background }}
                      />
                      
                      <div className={`${isOpen ? 'flex-1' : 'hidden'} overflow-hidden`}>
                        <AnimatePresence mode="wait">
                          {isOpen && (
                            <motion.span 
                              initial={{ opacity: 0, x: -5 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -5 }}
                              className={`text-sm font-bold block truncate whitespace-nowrap ${
                                isSelected 
                                  ? "text-yellow-700 dark:text-yellow-400" 
                                  : "text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200"
                              }`}
                            >
                              {board.title}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>

                      {isSelected && isOpen && (
                        <motion.div 
                          layoutId="active-bar"
                          className="absolute left-0 w-1.5 h-6 bg-yellow-400 rounded-r-full shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                        />
                      )}
                    </motion.div>
                  </Reorder.Item>
                );
              })}
            </Reorder.Group>

            <button 
              className={`flex items-center mt-4 border-2 border-dashed border-gray-100 dark:border-zinc-800 text-zinc-400 hover:border-yellow-400 hover:text-yellow-500 transition-all text-sm font-bold group overflow-hidden shrink-0 ${
                isOpen ? "w-full gap-3 p-3.5 rounded-2xl" : "w-12 h-12 mx-auto justify-center rounded-xl"
              }`}
              title={!isOpen ? "New Board" : ""}
            >
              <div className={`flex items-center justify-center bg-gray-100 dark:bg-zinc-800 rounded-lg group-hover:bg-yellow-100 transition-colors shrink-0 ${isOpen ? 'p-1' : 'w-7 h-7'}`}>
                <Plus size={isOpen ? 14 : 18} />
              </div>
              {isOpen && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="whitespace-nowrap"
                >
                  New Board
                </motion.span>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}