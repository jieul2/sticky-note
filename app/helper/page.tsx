'use client';

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Keyboard, MousePointer2, Grid3X3, Layers, Sparkles, ArrowRight, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HelperPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  // 로그인 상태 체크
  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => setIsLoggedIn(res.ok))
      .catch(() => setIsLoggedIn(false));
  }, []);

  const handleStart = () => {
    if (isLoggedIn) {
      router.push('/load');
    } else {
      // 로그인 후 다시 이 페이지나 보드로 오게 하려면 쿼리 스트링을 쓸 수 있습니다.
      router.push('/login?callback=/load');
    }
  };

  return (
    <main className="min-h-screen bg-[#fafafa] dark:bg-zinc-950 pt-20 transition-colors duration-300 overflow-x-hidden">
      <section className="max-w-4xl mx-auto px-6 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-center mb-24"
        >
          <span className="text-yellow-500 font-bold tracking-widest uppercase text-sm">Guide</span>
          <h1 className="text-4xl sm:text-6xl font-black mt-4 mb-6 italic text-zinc-900 dark:text-white">
            How to <span className="text-yellow-500 not-italic">Sticky.</span>
          </h1>
          <p className="text-lg text-muted-foreground font-medium">
            마우스 클릭과 키보드만으로 완성하는 정교한 나만의 캔버스.
          </p>
        </motion.div>

        <div className="grid gap-24">
          {/* 포인트 1: 키보드 제어 */}
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <div className="w-14 h-14 bg-zinc-900 dark:bg-yellow-400 rounded-2xl flex items-center justify-center mb-6 shadow-xl transition-colors">
                <Keyboard className="text-white dark:text-yellow-900 w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black mb-4 text-zinc-900 dark:text-white">손끝으로 완성하는 정밀함</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                메모를 선택하고 키보드를 눌러보세요. 마우스 드래그보다 훨씬 정교하게 위치와 크기를 조절할 수 있습니다.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <kbd className="px-2.5 py-1.5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 border-b-4 rounded-lg font-bold text-xs text-zinc-800 dark:text-zinc-200 shadow-sm transition-colors">
                    Ctrl
                  </kbd>
                  <span className="text-sm font-bold dark:text-zinc-500">+</span>
                  <kbd className="px-2.5 py-1.5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 border-b-4 rounded-lg font-bold text-xs text-zinc-800 dark:text-zinc-200 shadow-sm transition-colors">
                    방향키
                  </kbd>
                  <span className="text-sm text-gray-500 dark:text-zinc-400 ml-2">메모 위치 이동</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <kbd className="px-2.5 py-1.5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 border-b-4 rounded-lg font-bold text-xs text-zinc-800 dark:text-zinc-200 shadow-sm transition-colors">
                    Alt
                  </kbd>
                  <span className="text-sm font-bold dark:text-zinc-500">+</span>
                  <kbd className="px-2.5 py-1.5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 border-b-4 rounded-lg font-bold text-xs text-zinc-800 dark:text-zinc-200 shadow-sm transition-colors">
                    방향키
                  </kbd>
                  <span className="text-sm text-gray-500 dark:text-zinc-400 ml-2">메모 크기 조절</span>
                </div>
              </div>
            </div>

            <div className="flex-1 w-full p-8 bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-zinc-800 transition-colors">
              <div className="aspect-square relative flex items-center justify-center bg-gray-50 dark:bg-zinc-950 rounded-[2rem] overflow-hidden border border-dashed border-gray-200 dark:border-zinc-800">
                <motion.div 
                  animate={{ x: [0, 40, 40, 0, 0], y: [0, 0, 40, 40, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="w-24 h-24 bg-yellow-400 rounded-lg shadow-lg flex items-center justify-center font-bold text-[10px] p-2 text-center text-yellow-900"
                >
                  Step by Step Move
                </motion.div>
              </div>
            </div>
          </div>

          {/* 포인트 2: 환경 설정 */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-12">
            <div className="flex-1">
              <div className="w-14 h-14 bg-yellow-400 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-yellow-500/20">
                <Grid3X3 className="text-yellow-900 w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black mb-4 text-zinc-900 dark:text-white">내 입맛에 맞는 작업 환경</h3>
              <p className="text-muted-foreground leading-relaxed">
                격자 스냅을 켜서 깔끔하게 정렬하거나, 좌표 표시를 켜서 픽셀 단위로 완벽한 배치를 구현하세요. 겹침 강조 기능을 활용하면 메모가 가려지는 것도 방지할 수 있습니다.
              </p>
            </div>
            <div className="flex-1 w-full grid grid-cols-2 gap-4">
              <div className="p-6 bg-blue-500 text-white rounded-[2rem] shadow-lg flex flex-col justify-between aspect-square">
                <Layers className="w-8 h-8 opacity-50" />
                <div className="font-bold text-lg leading-tight">Overlap Detection</div>
              </div>
              <div className="p-6 bg-zinc-900 dark:bg-zinc-800 text-white rounded-[2rem] shadow-lg flex flex-col justify-between aspect-square transition-colors">
                <Grid3X3 className="w-8 h-8 opacity-50" />
                <div className="font-bold text-lg leading-tight">Grid Snap</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <motion.div 
          whileInView={{ opacity: 1, scale: 1 }}
          initial={{ opacity: 0, scale: 0.9 }}
          viewport={{ once: true }}
          className="mt-40 p-12 bg-yellow-400 rounded-[3.5rem] text-center shadow-2xl shadow-yellow-500/30 relative overflow-hidden"
        >
          {/* 비로그인 시 보여줄 작은 팁 */}
          {isLoggedIn === false && (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-yellow-500/20 px-4 py-1.5 rounded-full border border-yellow-600/20"
            >
              <Lock className="w-3 h-3 text-yellow-900" />
              <span className="text-[10px] font-black text-yellow-900 uppercase tracking-tighter">Login Required to Save Boards</span>
            </motion.div>
          )}

          <Sparkles className="w-12 h-12 text-yellow-900 mx-auto mb-6" />
          <h2 className="text-4xl font-black text-yellow-900 mb-6">준비되셨나요?</h2>
          <p className="text-yellow-800 font-bold mb-10 text-lg">이제 당신만의 창의적인 캔버스를 채워보세요.</p>
          
          <button 
            onClick={handleStart}
            className="bg-zinc-900 text-white px-10 py-5 rounded-2xl font-black text-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 mx-auto shadow-xl group"
          >
            {isLoggedIn ? '내 보드로 이동하기' : '로그인하고 시작하기'} 
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>

          {isLoggedIn === false && (
            <Link href="/signup" className="mt-6 inline-block text-yellow-900/60 text-xs font-bold hover:text-yellow-900 underline underline-offset-4">
              아직 계정이 없으신가요? 회원가입하기
            </Link>
          )}
        </motion.div>
      </section>
    </main>
  );
}