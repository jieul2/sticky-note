'use client';

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  User, StickyNote, LogOut, Settings, 
  Clock, ChevronRight, BarChart3, Plus, 
  Palette, CalendarDays
} from "lucide-react";

interface RecentBoard {
  id: number;
  title: string;
  background: string;
  updatedAt: string;
  _count: { memos: number };
}

interface UserInfo {
  id: number;
  email: string;
  name: string | null;
  color: string;
  createdAt: string;
  _count: { memoBoards: number };
  memoBoards: RecentBoard[];
}

export default function Mypage() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error("사용자 정보를 불러오는 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (response.ok) {
        router.push('/login');
      }
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen font-medium text-muted-foreground">
      사용자 정보를 불러오는 중...
    </div>
  );

  const themeColor = user?.color || "#facc15";

  return (
    <section className="h-screen overflow-y-auto mx-auto max-w-6xl px-6 py-12 space-y-10 bg-[#fafafa] dark:bg-zinc-950">
      {/* 테마 컬러가 적용된 배너 */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="relative p-10 rounded-[3rem] overflow-hidden shadow-2xl text-white"
        style={{ backgroundColor: themeColor }}
      >
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <StickyNote size={180} rotate={15} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-black/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest">Workspace</span>
          </div>
          <h1 className="text-5xl font-black mb-3 tracking-tight">
            {user?.name || '사용자'}님의 캔버스
          </h1>
          <p className="opacity-90 font-medium text-lg">오늘도 당신의 특별한 아이디어를 기록해보세요.</p>
          <div className="mt-8 flex gap-4">
            <Button 
              onClick={() => router.push('/load')}
              className="bg-white text-zinc-900 hover:bg-zinc-100 rounded-2xl px-6 h-12 font-bold shadow-lg"
            >
              <Plus className="mr-2 h-5 w-5" /> 새 보드 만들기
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-8 md:grid-cols-3 pb-24">
        {/* 프로필 카드 */}
        <div className="md:col-span-1 space-y-6">
          <Card className="border-none shadow-xl rounded-[2.5rem] bg-white dark:bg-zinc-900 overflow-hidden">
            <CardHeader className="text-center pt-10 pb-6">
              <div 
                className="mx-auto w-28 h-28 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner transition-transform hover:rotate-3"
                style={{ backgroundColor: `${themeColor}20` }}
              >
                <User className="w-14 h-14" style={{ color: themeColor }} />
              </div>
              <CardTitle className="text-2xl font-black">{user?.name || "사용자"}</CardTitle>
              <CardDescription className="mt-1">{user?.email}</CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-10 space-y-3">
              <Button variant="outline" className="w-full h-12 rounded-xl border-zinc-100 dark:border-zinc-800 font-bold" onClick={() => router.push('/settings')}>
                <Settings className="mr-2 h-4 w-4" /> 환경 설정
              </Button>
              <Button variant="ghost" className="w-full h-12 rounded-xl text-zinc-400 hover:text-red-500 font-bold" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" /> 로그아웃
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-[2.5rem] border-none shadow-lg bg-zinc-900 text-white">
            <CardHeader>
              <CardTitle className="text-xs flex items-center gap-2 font-black uppercase tracking-[0.2em] text-zinc-500">
                <BarChart3 className="w-4 h-4" /> Activity Insight
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pb-8">
              <div className="flex justify-between items-end">
                <span className="text-sm font-medium text-zinc-400">생성된 보드</span>
                <span className="text-3xl font-black" style={{ color: themeColor }}>{user?._count?.memoBoards ?? 0}</span>
              </div>
              <div className="pt-4 border-t border-zinc-800">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500">멤버 가입일</span>
                  <span className="font-bold text-zinc-300">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 최근 보드 리스트 */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-none shadow-xl rounded-[2.5rem] bg-white dark:bg-zinc-900 min-h-[500px]">
            <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-50 dark:border-zinc-800 mx-8 px-0 py-8">
              <CardTitle className="text-xl font-black flex items-center gap-3">
                <Clock className="w-6 h-6" style={{ color: themeColor }} /> 최근 작업 항목
              </CardTitle>
              <Button variant="ghost" className="font-bold text-zinc-400 hover:text-zinc-900" onClick={() => router.push('/load')}>
                전체보기 <ChevronRight className="ml-1 w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-8">
              {user?.memoBoards && user.memoBoards.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {user.memoBoards.slice(0, 4).map((board) => (
                    <motion.div 
                      key={board.id} 
                      whileHover={{ y: -5 }}
                      onClick={() => router.push(`/load?id=${board.id}`)}
                      className="group flex flex-col p-6 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-800/50 hover:shadow-2xl hover:border-transparent transition-all cursor-pointer"
                    >
                      <div className="w-14 h-1.5 rounded-full mb-4" style={{ backgroundColor: board.background }} />
                      <p className="font-black text-lg truncate mb-1 group-hover:text-primary transition-colors">{board.title}</p>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-[11px] font-bold text-zinc-400 flex items-center gap-1.5">
                          <CalendarDays size={14} /> {new Date(board.updatedAt).toLocaleDateString()}
                        </span>
                        <span className="text-[10px] font-black px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-700 text-zinc-500">
                          {board._count?.memos} MEMOS
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-32 text-zinc-300">
                  <StickyNote size={64} strokeWidth={1} className="mb-4 opacity-20" />
                  <p className="font-bold">아직 작업 중인 보드가 없습니다.</p>
                  <Button variant="link" className="mt-2 text-zinc-400" onClick={() => router.push('/home')}>첫 보드 만들기</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}