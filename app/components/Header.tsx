'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon, Save, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // 경로 감지를 위해 추가
import { useSave } from './SaveContext';
import SettingsModal from './SettingsModal';

interface UserInfo {
  id: number;
  email: string;
  name: string;
}

export default function Header() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const pathname = usePathname();
  const { triggerSave, isSaving } = useSave();

  // 현재 경로가 특정 보드 내부(예: /load 또는 /board/1 등)인지 확인
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
      <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-black/80 backdrop-blur-md h-14 px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-black font-bold group-hover:scale-105 transition-transform">S</div>
          <span className="font-bold tracking-tight hidden sm:block text-gray-900 dark:text-white">StickyNote</span>
        </Link>

        {/* 💡 수정된 부분: 로그인했고 + 메모지(보드)가 활성화된 경로일 때만 노출 */}
        {!loading && user && isBoardActive && (
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsSettingsOpen(true)} 
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>설정</span>
            </button>
            <button 
              onClick={triggerSave} 
              disabled={isSaving} 
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? '저장중' : '저장'}</span>
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
            <Sun className="w-5 h-5 dark:hidden" />
            <Moon className="w-5 h-5 hidden dark:block" />
          </button>
          {!loading && (
            user ? (
              <div className="flex items-center gap-3 pl-3 border-l border-gray-200 dark:border-zinc-700">
                <Link href="/mypage" className="flex items-center gap-2 text-sm font-medium hover:text-blue-600 transition-colors">
                  <div className="w-7 h-7 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-bold">
                    {user.name.slice(0, 1).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline text-gray-700 dark:text-gray-200">{user.name}</span>
                </Link>
                <button onClick={logout} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link href="/login" className="px-4 py-1.5 text-sm font-medium text-white bg-black dark:bg-white dark:text-black rounded-full hover:opacity-80 transition-opacity">
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