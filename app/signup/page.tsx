"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

    
    // 1️⃣ 비밀번호 길이 체크
    if (password.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다.");
      return;
    }
    
   
    // 2️⃣ 비밀번호 일치 체크
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          name,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("가입 성공! 로그인 페이지로 이동합니다.");
        router.push("/login");
      } else {
        setError(data.message || "회원가입 실패");
      }
    } catch (err) {
      console.log(err)
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-sm w-full bg-white dark:bg-gray-900 shadow-xl rounded-xl px-8 py-10">
        <h2 className="text-3xl font-bold text-center text-indigo-600 dark:text-indigo-400 mb-6">
          Sticky Note 회원가입
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="이름"
            autoComplete="name"
            className="w-full p-3 border border-gray-300 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-indigo-500
                       dark:bg-gray-800 dark:border-gray-700"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="이메일"
            autoComplete="email"
            className="w-full p-3 border border-gray-300 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-indigo-500
                       dark:bg-gray-800 dark:border-gray-700"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="비밀번호 (8자 이상)"
            autoComplete="new-password"
            className="w-full p-3 border border-gray-300 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-indigo-500
                       dark:bg-gray-800 dark:border-gray-700"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="비밀번호 확인"
            autoComplete="new-password"
            className="w-full p-3 border border-gray-300 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-indigo-500
                       dark:bg-gray-800 dark:border-gray-700"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold
                       hover:bg-indigo-700 transition
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "가입 중..." : "회원가입"}
          </button>
        </form>

        {error && (
          <p className="text-red-500 text-sm text-center mt-3">{error}</p>
        )}

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          이미 계정이 있다면{" "}
          <Link
            href="/login"
            className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
          >
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
