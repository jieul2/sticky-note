'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from 'framer-motion';
import { StickyNote as NoteIcon, Lock, Mail, User, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function RegPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError("");

    if (password.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다.");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/login?signup=success");
      } else {
        setError(data.message || "회원가입 실패");
      }
    } catch (err) {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
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
        className="max-w-md w-full my-10"
      >
        <div className="bg-white dark:bg-zinc-900 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 px-8 py-10">
          
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400 mb-4 shadow-lg shadow-yellow-500/20 -rotate-3">
              <NoteIcon className="h-7 w-7 text-yellow-900" />
            </div>
            <h2 className="text-3xl font-black italic text-zinc-900 dark:text-white">
              Sticky <span className="text-yellow-500 not-italic">Join.</span>
            </h2>
            <p className="text-muted-foreground text-sm mt-2 font-medium">새로운 창의적인 여정을 시작해보세요.</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* 이름 입력 */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 ml-1 uppercase tracking-widest">Username</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-yellow-500 transition-colors" />
                <input
                  type="text"
                  placeholder="당신의 이름을 알려주세요"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-zinc-800/50 border-none rounded-2xl focus:ring-2 focus:ring-yellow-400 outline-none text-sm transition-all dark:text-white"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* 이메일 입력 */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 ml-1 uppercase tracking-widest">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-yellow-500 transition-colors" />
                <input
                  type="email"
                  placeholder="example@email.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-zinc-800/50 border-none rounded-2xl focus:ring-2 focus:ring-yellow-400 outline-none text-sm transition-all dark:text-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* 비밀번호 입력 */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 ml-1 uppercase tracking-widest">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-yellow-500 transition-colors" />
                <input
                  type="password"
                  placeholder="8자 이상 입력하세요"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-zinc-800/50 border-none rounded-2xl focus:ring-2 focus:ring-yellow-400 outline-none text-sm transition-all dark:text-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* 비밀번호 확인 입력 */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 ml-1 uppercase tracking-widest">Confirm Password</label>
              <div className="relative group">
                <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-yellow-500 transition-colors" />
                <input
                  type="password"
                  placeholder="비밀번호를 다시 입력하세요"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-zinc-800/50 border-none rounded-2xl focus:ring-2 focus:ring-yellow-400 outline-none text-sm transition-all dark:text-white"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
              disabled={loading}
              className="w-full bg-zinc-900 dark:bg-yellow-400 dark:text-yellow-900 text-white py-4 rounded-2xl font-black text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-zinc-200 dark:shadow-yellow-950/20 flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
            >
              {loading ? "가입 처리 중..." : "회원가입 완료"} <ArrowRight className="h-5 w-5" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-zinc-800 text-center">
            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
              이미 계정이 있으신가요?{' '}
              <Link href="/login" className="text-yellow-500 font-bold hover:underline">
                로그인 하러가기
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}