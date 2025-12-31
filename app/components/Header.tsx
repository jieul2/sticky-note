'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function Header() {

  // 브라우저에서 다크모드 초기화
  useEffect(() => {
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = stored ?? (prefersDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', initial === 'dark');
  }, []);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-gray-50 dark:bg-black/95 backdrop-blur flex justify-between items-center px-6 h-14">
      <Link href="/home" className="text-sm font-semibold">My Next App</Link>

      <nav className="flex items-center gap-6 text-sm text-gray-700 dark:text-gray-300">
        <Link href="/home" className="hover:text-black dark:hover:text-white">홈</Link>
        <Link href="/settings" className="hover:text-black dark:hover:text-white">설정</Link>
        <Link href="/save" className="hover:text-black dark:hover:text-white">저장</Link>
        <Link href="/load" className="hover:text-black dark:hover:text-white">불러오기</Link>
        <Link href="/mypage" className="hover:text-black dark:hover:text-white">마이페이지</Link>
      </nav>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="rounded-xl border border-gray-400 p-2 hover:bg-gray-200 dark:hover:bg-gray-800"
          aria-label="Toggle Theme"
        >
          <Sun className="h-4 w-4 dark:hidden" />
          <Moon className="h-4 w-4 hidden dark:block" />
        </button>

        <Link
          href="/login"
          className="rounded-xl border border-gray-400 px-4 py-1.5 text-sm hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          로그인
        </Link>
      </div>
    </header>
  );
}
