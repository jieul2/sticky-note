'use client';

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { 
  ChevronLeft, 
  ChevronRight, 
  FolderOpen, 
  Plus,
  Layout,
  GripVertical,
  Trash2,
  Edit2,
  Palette,
  Check,
  X
} from "lucide-react";

type MemoBoard = {
  id: number;
  title: string;
  background: string;
  index: number;
  user?: { name: string | null };
};

const COLORS = ["#fbbf24", "#f87171", "#60a5fa", "#34d399", "#a78bfa", "#f472b6"];

export default function MemoBoardList({
  selectedBoardId,
  onSelect,
}: {
  selectedBoardId: number | null;
  onSelect: (id: number) => void;
}) {
  const [boards, setBoards] = useState<MemoBoard[]>([]);
  const [isOpen, setIsOpen] = useState(true);
  const [isSidebarFocused, setIsSidebarFocused] = useState(false);
  const router = useRouter();

  // 메뉴 위치 정보를 담는 상태에 방향(direction) 정보 추가
  const [menuConfig, setMenuConfig] = useState<{ id: number, x: number, y: number, direction: 'down' | 'up' } | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const asideRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const res = await fetch("/api/memoboards");
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        if (!res.ok) throw new Error("데이터 로드 실패");
        const data = await res.json();
        setBoards(data);
      } catch (err: unknown) {
        if (err instanceof Error) console.error("Fetch Error:", err.message);
      }
    };
    fetchBoards();
  }, [router]);

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if (asideRef.current && asideRef.current.contains(e.target as Node)) {
        setIsSidebarFocused(true);
      } else {
        setIsSidebarFocused(false);
      }
    };
    window.addEventListener("mousedown", handleGlobalClick);
    return () => window.removeEventListener("mousedown", handleGlobalClick);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (editingId !== null || !isSidebarFocused) return;

      if (e.key === "F2" && selectedBoardId !== null) {
        e.preventDefault();
        const selectedBoard = boards.find(b => b.id === selectedBoardId);
        if (selectedBoard) {
          setEditingId(selectedBoard.id);
          setEditTitle(selectedBoard.title);
        }
        return;
      }

      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        if (boards.length === 0) return;
        e.preventDefault();
        const currentIndex = boards.findIndex(b => b.id === selectedBoardId);
        let nextIndex = currentIndex;
        if (e.key === "ArrowUp") {
          nextIndex = currentIndex <= 0 ? boards.length - 1 : currentIndex - 1;
        } else if (e.key === "ArrowDown") {
          nextIndex = currentIndex >= boards.length - 1 ? 0 : currentIndex + 1;
        }
        const nextBoard = boards[nextIndex];
        if (nextBoard) onSelect(nextBoard.id);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedBoardId, editingId, boards, onSelect, isSidebarFocused]);

  useEffect(() => {
    const handleClick = () => setMenuConfig(null);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  // 우클릭 시 화면 하단 공간을 계산하여 메뉴 방향 결정
  const handleContextMenu = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    
    const menuHeight = 280; // 예상되는 메뉴의 최대 높이 (단위: px)
    const windowHeight = window.innerHeight;
    const clickY = e.clientY;

    // 하단에 메뉴 높이만큼의 여유 공간이 없으면 위쪽('up')으로 띄움
    const direction = (windowHeight - clickY) < menuHeight ? 'up' : 'down';

    setMenuConfig({ id, x: e.clientX, y: e.clientY, direction });
  };

  const handleUpdate = async (id: number, data: Partial<MemoBoard>) => {
    if (data.title !== undefined && data.title.trim() === "") {
        setEditingId(null);
        return;
    }
    try {
      const res = await fetch(`/api/memoboards/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setBoards(boards.map(b => b.id === id ? { ...b, ...data } : b));
        setEditingId(null);
        setMenuConfig(null);
      }
    } catch (err) {
      console.error("Update Error:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("이 보드를 삭제하시겠습니까? 관련 메모가 모두 사라집니다.")) return;
    try {
      const res = await fetch(`/api/memoboards/${id}`, { method: "DELETE" });
      if (res.ok) {
        setBoards(boards.filter(b => b.id !== id));
        setMenuConfig(null);
      }
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  const handleAddBoard = async () => {
    try {
      const res = await fetch("/api/memoboards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "새 보드", background: "#fbbf24" }),
      });
      if (res.ok) {
        const newBoard = await res.json();
        setBoards([...boards, newBoard]);
        onSelect(newBoard.id);
        setEditingId(newBoard.id);
        setEditTitle("새 보드");
      }
    } catch (err) {
      console.error("Add Error:", err);
    }
  };

  const handleReorder = async (newOrder: MemoBoard[]) => {
    setBoards(newOrder);
    try {
      await fetch("/api/memoboards/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ boardIds: newOrder.map(b => b.id) }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.aside
      ref={asideRef}
      animate={{ width: isOpen ? 260 : 64 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`relative flex flex-col bg-white dark:bg-zinc-950 border-r border-gray-100 dark:border-zinc-800 shadow-xl z-40 transition-colors duration-300 ${isSidebarFocused ? 'ring-1 ring-inset ring-yellow-400/30' : ''}`}
    >
      <div className="flex items-center h-16 px-4 shrink-0 relative z-10">
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
          onClick={() => setIsOpen(!isOpen)}
          className={`w-8 h-8 rounded-xl text-zinc-500 bg-gray-50 dark:bg-zinc-900 flex items-center justify-center hover:bg-yellow-400 hover:text-yellow-900 transition-all active:scale-90 shadow-sm shrink-0 ${!isOpen ? 'mx-auto' : ''}`}
        >
          {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-2 scrollbar-hide">
        <style jsx>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>

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
                const isEditing = editingId === board.id;
                
                return (
                  <Reorder.Item key={board.id} value={board} className="relative list-none outline-none">
                    <motion.div
                      whileHover={{ x: isOpen ? 4 : 0 }}
                      onClick={() => !isEditing && onSelect(board.id)}
                      onContextMenu={(e) => handleContextMenu(e, board.id)}
                      className={`group relative flex items-center transition-all cursor-pointer ${
                        isOpen ? "gap-3 p-3.5 rounded-2xl" : "justify-center p-0 h-12 w-12 mx-auto rounded-xl"
                      } ${
                        isSelected 
                          ? "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200/50 dark:border-yellow-700/30" 
                          : "hover:bg-gray-50 dark:hover:bg-zinc-900 border border-transparent"
                      }`}
                    >
                      {isOpen && (
                        <GripVertical size={14} className="text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab shrink-0" />
                      )}

                      <div 
                        className={`rounded-full shadow-inner ring-2 ring-white dark:ring-zinc-900 shrink-0 ${isOpen ? 'w-2.5 h-2.5' : 'w-3 h-3'}`}
                        style={{ backgroundColor: board.background }}
                      />
                      
                      {isOpen && (
                        <div className="flex-1 overflow-hidden">
                          {isEditing ? (
                            <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                              <input 
                                autoFocus
                                className="w-full bg-transparent border-none outline-none text-sm font-bold p-0 text-zinc-900 dark:text-white"
                                value={editTitle}
                                onChange={e => setEditTitle(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleUpdate(board.id, { title: editTitle })}
                                onBlur={() => handleUpdate(board.id, { title: editTitle })}
                              />
                            </div>
                          ) : (
                            <span className={`text-sm font-bold block truncate transition-all duration-300 ${
                              isSelected 
                                ? "text-yellow-700 dark:text-yellow-400" 
                                : "text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200"
                            }`}>
                              {board.title}
                            </span>
                          )}
                        </div>
                      )}

                      {isSelected && isOpen && !isEditing && (
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
              onClick={handleAddBoard}
              className={`flex items-center mt-4 border-2 border-dashed border-gray-100 dark:border-zinc-800 text-zinc-400 hover:border-yellow-400 hover:text-yellow-500 transition-all text-sm font-bold group overflow-hidden shrink-0 ${
                isOpen ? "w-full gap-3 p-3.5 rounded-2xl" : "w-12 h-12 mx-auto justify-center rounded-xl"
              }`}
            >
              <div className={`flex items-center justify-center bg-gray-100 dark:bg-zinc-800 rounded-lg group-hover:bg-yellow-100 transition-colors shrink-0 ${isOpen ? 'p-1' : 'w-7 h-7'}`}>
                <Plus size={isOpen ? 14 : 18} />
              </div>
              {isOpen && <span>New Board</span>}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {menuConfig && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{ 
              // direction이 'up'이면 클릭 위치에서 자신의 높이만큼 위로 이동
              top: menuConfig.direction === 'down' ? menuConfig.y : 'auto',
              bottom: menuConfig.direction === 'up' ? (window.innerHeight - menuConfig.y) : 'auto',
              left: menuConfig.x,
              position: 'fixed',
              zIndex: 9999 
            }}
            className="w-56 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] p-2"
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => { 
                const target = boards.find(b => b.id === menuConfig.id);
                if (target) { 
                    setEditingId(target.id); 
                    setEditTitle(target.title); 
                }
                setMenuConfig(null);
              }}
              className="flex items-center gap-3 w-full p-3 text-sm font-bold text-zinc-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
            >
              <Edit2 size={16} /> 이름 변경
            </button>
            
            <div className="p-3 border-t border-gray-100 dark:border-zinc-800 mt-1">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-zinc-400 mb-3 font-black">
                <Palette size={14} /> 색상 변경
              </div>
              <div className="flex gap-2.5 flex-wrap">
                {COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => handleUpdate(menuConfig.id, { background: color })}
                    className="w-6 h-6 rounded-full border-2 border-white dark:border-zinc-800 shadow-sm transition-transform hover:scale-125"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <button 
              onClick={() => handleDelete(menuConfig.id)}
              className="flex items-center gap-3 w-full p-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl border-t border-gray-100 dark:border-zinc-800 mt-1 transition-colors"
            >
              <Trash2 size={16} /> 보드 삭제
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
}