'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon, Save } from 'lucide-react';
import Link from 'next/link';
import { useSave } from './SaveContext';

type User = {
  id: number;
  email: string;
  name: string;
};

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const { triggerSave, isSaving } = useSave();

  // 테마 및 로그인 정보 초기화
  useEffect(() => {
    // 테마 초기화
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = stored ?? (prefersDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', initial === 'dark');

    // 로그인 유저 정보 불러오기
    fetch('/api/auth/me', { credentials: 'include' })
      .then(async res => {
        if (res.status === 401) return null;
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

  // Ctrl+S / Cmd+S 단축키로 저장
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault(); // 브라우저 기본 저장 방지
        console.log('Ctrl+S 감지, 저장 실행');
        triggerSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerSave]);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
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

        {/* 저장 버튼 */}
        <button
          onClick={() => {
            console.log('저장 버튼 클릭됨');
            triggerSave();
          }}
          disabled={isSaving}
          className="flex items-center gap-1 rounded-xl border border-gray-400 px-3 py-1.5 text-sm
                    hover:bg-gray-200 dark:hover:bg-gray-800
                    disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="h-4 w-4" />
          {isSaving ? '저장중...' : '저장'}
        </button>

        <Link href="/load" className="hover:text-black dark:hover:text-white">불러오기</Link>
        <Link href="/mypage" className="hover:text-black dark:hover:text-white">마이페이지</Link>
      </nav>

      {/* 우측 로그인 / 테마 */}
      <div className="flex justify-end items-center gap-3">
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
