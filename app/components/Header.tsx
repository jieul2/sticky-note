'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon, Save, Settings, LogOut, StickyNote as NoteIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSave } from './SaveContext';
import { useSettings } from './SettingsContext'; // 추가
import SettingsModal from './SettingsModal';
import { motion } from 'framer-motion';

interface UserInfo {
  id: number;
  email: string;
  name: string;
}

export default function Header() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  
  const pathname = usePathname();
  const { triggerSave, isSaving } = useSave();
  const { isSettingsOpen, setIsSettingsOpen } = useSettings(); // 컨텍스트 상태 사용

  const isBoardActive = pathname.startsWith('/load'); 

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = stored ?? (prefersDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', initial === 'dark');

    fetch('/api/auth/me', { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then((data: UserInfo | null) => setUser(data))
      .finally(() => setLoading(false));
  }, []);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    location.href = '/';
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-gray-100 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl h-16 px-6 flex items-center justify-between transition-colors">
        <Link href="/" className="flex items-center gap-2.5 group">
          <motion.div 
            whileHover={{ rotate: -5, scale: 1.1 }}
            className="w-9 h-9 bg-yellow-400 rounded-xl flex items-center justify-center shadow-sm shadow-yellow-500/20"
          >
            <NoteIcon className="w-5 h-5 text-yellow-900" />
          </motion.div>
          <span className="font-black text-xl tracking-tight hidden sm:block italic text-zinc-900 dark:text-white">
            Sticky <span className="text-yellow-500 not-italic">Note.</span>
          </span>
        </Link>

        {!loading && user && isBoardActive && (
          <div className="flex items-center gap-2 bg-gray-100/50 dark:bg-zinc-900/50 p-1 rounded-2xl border border-gray-200/50 dark:border-zinc-800/50">
            <button 
              onClick={() => setIsSettingsOpen(true)} // 컨텍스트 함수 호출
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-zinc-800 rounded-xl transition-all active:scale-95 hover:shadow-sm"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden md:inline">설정</span>
            </button>
            <button 
              onClick={triggerSave} 
              disabled={isSaving} 
              className={`flex items-center gap-2 px-5 py-2 text-sm font-bold text-white rounded-xl transition-all active:scale-95 shadow-lg ${
                isSaving ? 'bg-zinc-400' : 'bg-zinc-900 dark:bg-white dark:text-zinc-900 shadow-zinc-500/20'
              }`}
            >
              <Save className={`w-4 h-4 ${isSaving ? 'animate-spin' : ''}`} />
              <span>{isSaving ? '저장 중' : '저장하기'}</span>
            </button>
          </div>
        )}

        <div className="flex items-center gap-3">
          <button 
            onClick={toggleTheme} 
            className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-all"
          >
            <Sun className="w-5 h-5 dark:hidden" />
            <Moon className="w-5 h-5 hidden dark:block" />
          </button>

          {!loading && (
            user ? (
              <div className="flex items-center gap-2 pl-3 border-l border-gray-200 dark:border-zinc-800">
                <Link 
                  href="/mypage" 
                  className="flex items-center gap-2 p-1.5 pr-3 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-all"
                >
                  <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-full flex items-center justify-center text-sm font-black shadow-inner">
                    {user.name.slice(0, 1).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline text-sm font-bold text-gray-700 dark:text-gray-200">{user.name}</span>
                </Link>
                <button 
                  onClick={logout} 
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
                  title="로그아웃"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="px-6 py-2 text-sm font-bold text-white bg-zinc-900 dark:bg-white dark:text-zinc-900 rounded-xl hover:scale-105 transition-all active:scale-95"
              >
                로그인
              </Link>
            )
          )}
        </div>
      </header>
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
}