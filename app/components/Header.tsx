'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

type User = {
  id: number;
  email: string;
  name: string;
};

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🌙 테마
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = stored ?? (prefersDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', initial === 'dark');

    // 👤 로그인 상태 확인
    fetch('/api/auth/me', { credentials: 'include' })
      .then(res => {
        if (res.status === 401) return null; // 비로그인
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  const logout = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });

    setUser(null);
    location.href = '/';
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-gray-50 dark:bg-black/95 backdrop-blur flex justify-between items-center px-6 h-14">
      <Link href="/home" className="text-sm font-semibold">
        My Next App
      </Link>

      <nav className="flex items-center gap-6 text-sm text-gray-700 dark:text-gray-300">
        <Link href="/home">홈</Link>
        <Link href="/settings">설정</Link>
        <Link href="/save">저장</Link>
        <Link href="/load">불러오기</Link>
        <Link href="/mypage">마이페이지</Link>
      </nav>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="rounded-xl border border-gray-400 p-2 hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          <Sun className="h-4 w-4 dark:hidden" />
          <Moon className="h-4 w-4 hidden dark:block" />
        </button>

        {!loading && (
          user ? (
            <>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                <strong>{user.name}</strong>님
              </span>
              <button
                onClick={logout}
                className="rounded-xl border border-gray-400 px-4 py-1.5 text-sm hover:bg-gray-200 dark:hover:bg-gray-800"
              >
                로그아웃
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-xl border border-gray-400 px-4 py-1.5 text-sm hover:bg-gray-200 dark:hover:bg-gray-800"
            >
              로그인
            </Link>
          )
        )}
      </div>
    </header>
  );
}
