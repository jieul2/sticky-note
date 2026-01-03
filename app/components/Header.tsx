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

  // 다크 테마 + 로그인 상태 확인
  useEffect(() => {
    // 테마 초기화
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = stored ?? (prefersDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', initial === 'dark');

    // 로그인 상태 fetch
    fetch('/api/auth/me', { credentials: 'include' })
      .then(async res => {
        if (res.status === 401) return null; // 비로그인 정상 처리
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || '서버 오류');
        }
        return res.json();
      })
      .then(data => setUser(data))
      .catch(err => {
        console.error('User fetch error:', err);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // 테마 토글
  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  // 로그아웃
  const logout = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    // 리로드 후 메인 화면
    location.href = '/';
  };

  return (
    <header className="grid grid-cols-3 items-center sticky top-0 z-50 border-b border-gray-800 bg-gray-50 dark:bg-black/95 backdrop-blur h-14 px-6">
      
      {/* 좌측 로고 */}
      <div className="flex items-center gap-6">
        <Link href="/home" className="text-sm font-semibold">
          My Next App
        </Link>
      </div>

      {/* 중앙 네비게이션 */}
      <nav className="flex justify-center items-center gap-6 text-sm text-gray-700 dark:text-gray-300">
        <Link href="/home" className="hover:text-black dark:hover:text-white">홈</Link>
        <Link href="/settings" className="hover:text-black dark:hover:text-white">설정</Link>
        <Link href="/save" className="hover:text-black dark:hover:text-white">저장</Link>
        <Link href="/load" className="hover:text-black dark:hover:text-white">불러오기</Link>
        <Link href="/mypage" className="hover:text-black dark:hover:text-white">마이페이지</Link>
      </nav>

      {/* 우측 로그인 / OOO님 + 테마 */}
      <div className="flex justify-end items-center gap-3">
        {/* 테마 토글 */}
        <button
          onClick={toggleTheme}
          className="rounded-xl border border-gray-400 p-2 hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          <Sun className="h-4 w-4 dark:hidden" />
          <Moon className="h-4 w-4 hidden dark:block" />
        </button>

        {/* 로그인 상태 */}
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
