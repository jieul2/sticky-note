'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { StickyNote as NoteIcon, Lock, Mail, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || '로그인 정보를 다시 확인해주세요.');
        return;
      }

      window.location.assign('/home');
    } catch {
      setError('서버와 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-zinc-950 flex items-center justify-center px-4 relative overflow-hidden">
      {/* 배경 장식 (홈페이지와 동일한 도트 패턴) */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="bg-white dark:bg-zinc-900 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 px-8 py-12">
          
          {/* Logo & Header */}
          <div className="text-center mb-10">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-400 mb-4 shadow-lg shadow-yellow-500/20 rotate-3">
              <NoteIcon className="h-8 w-8 text-yellow-900" />
            </div>
            <h2 className="text-3xl font-black italic text-zinc-900 dark:text-white">
              Sticky <span className="text-yellow-500 not-italic">Login.</span>
            </h2>
            <p className="text-muted-foreground text-sm mt-2 font-medium">나만의 창의적인 캔버스로 돌아오세요.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 ml-1 uppercase tracking-wider">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-yellow-500 transition-colors" />
                <input
                  type="email"
                  placeholder="이메일을 입력하세요"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-zinc-800/50 border-none rounded-2xl focus:ring-2 focus:ring-yellow-400 outline-none text-sm transition-all dark:text-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 ml-1 uppercase tracking-wider">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-yellow-500 transition-colors" />
                <input
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-zinc-800/50 border-none rounded-2xl focus:ring-2 focus:ring-yellow-400 outline-none text-sm transition-all dark:text-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <motion.p 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-red-500 text-xs font-bold text-center mt-2"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              className="w-full bg-zinc-900 dark:bg-yellow-400 dark:text-yellow-900 text-white py-4 rounded-2xl font-black text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-zinc-200 dark:shadow-yellow-950/20 flex items-center justify-center gap-2 mt-4"
            >
              로그인하기 <ArrowRight className="h-5 w-5" />
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-100 dark:border-zinc-800 text-center">
            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
              처음 방문하셨나요?{' '}
              <Link href="/signup" className="text-yellow-500 font-bold hover:underline">
                회원가입 하기
              </Link>
            </p>
          </div>
        </div>

        {/* 하단 링크 */}
        <div className="text-center mt-8">
          <Link href="/" className="text-zinc-400 dark:text-zinc-600 text-sm font-bold hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors">
            ← 홈으로 돌아가기
          </Link>
        </div>
      </motion.div>
    </div>
  );
}