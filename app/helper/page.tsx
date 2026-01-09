'use client';

import { useEffect, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { 
  Keyboard, 
  Grid3X3, 
  Layers, 
  Sparkles, 
  ArrowRight, 
  Lock, 
  Move, 
  Maximize,
  CheckCircle2,
  Layout,
  Palette,
  Target,
  AlertCircle,
  Clock,
  PlusSquare
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HelperPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => setIsLoggedIn(res.ok))
      .catch(() => setIsLoggedIn(false));
  }, []);

  const handleStart = () => {
    if (isLoggedIn) {
      router.push('/load');
    } else {
      router.push('/login?callback=/load');
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: "easeOut" } 
    }
  };

  return (
    <main className="h-[calc(100vh-64px)] overflow-y-auto bg-[#fafafa] dark:bg-zinc-950 transition-colors duration-500 selection:bg-yellow-200 dark:selection:bg-yellow-500/30">
      <section className="max-w-5xl mx-auto px-6 py-24">
        
        {/* Hero Section */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center mb-32"
        >
          <motion.span 
            variants={itemVariants}
            className="inline-block px-4 py-1.5 rounded-full bg-yellow-100 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 text-xs font-black tracking-widest uppercase mb-6"
          >
            User Guide & Experience
          </motion.span>
          <motion.h1 
            variants={itemVariants}
            className="text-5xl sm:text-7xl font-black mt-4 mb-8 italic text-zinc-900 dark:text-white tracking-tighter"
          >
            Master the <span className="text-yellow-500 not-italic">Sticky.</span>
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed"
          >
            기록을 넘어선 나만의 예술적 질서.<br />
            정교한 시스템으로 당신의 하루를 가장 아름답게 설계하세요.
          </motion.p>
        </motion.div>

        <div className="grid gap-48">
          
          {/* Section 1: Planner & Timetable */}
          <div className="space-y-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center space-y-4"
            >
              <div className="inline-flex items-center gap-2 text-yellow-600 dark:text-yellow-500 font-bold">
                <Clock className="w-5 h-5" />
                <span>Planner & Timetable</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white">
                체계적인 <span className="text-yellow-500">학습 대시보드</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                주차별 테마 설정과 세밀한 시간 배치를 통해 나만의 완벽한 플래너를 완성하세요.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="p-8 sm:p-12 bg-white dark:bg-zinc-900 rounded-[3.5rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl relative"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div className="bg-[#1b5e20] text-white p-3 rounded-xl font-bold text-center text-sm">🟢 1주차: 감각 회복</div>
                  <div className="bg-[#2e7d32] text-[#e8f5e9] p-3 rounded-xl text-xs border border-[#4caf50]">Day 1: 실전모의 01회</div>
                  <div className="bg-[#004d40] text-white p-3 rounded-xl text-xs font-bold border-2 border-[#81c784]">Day 7: 오답 복습</div>
                </div>
                <div className="space-y-3">
                  <div className="bg-[#fbc02d] text-white p-3 rounded-xl font-bold text-center text-sm">🟡 2주차: 점수 집중</div>
                  <div className="bg-[#f9a825] text-[#fffde7] p-3 rounded-xl text-xs border border-[#fdd835]">Day 8: 실전모의 04회</div>
                  <div className="bg-[#ef6c00] text-white p-3 rounded-xl text-xs font-bold border-2 border-[#ffb74d]">Day 14: 실전모의 06회</div>
                </div>
                <div className="space-y-3">
                  <div className="bg-[#263238] text-white p-3 rounded-xl font-bold text-center text-sm">🕒 DAILY TIME TABLE</div>
                  <div className="bg-[#0d47a1] text-[#bbdefb] p-3 rounded-xl text-[11px] font-bold border border-[#1976d2]">12:30 ~ 14:00 📖 공부</div>
                  <div className="bg-[#4a148c] text-[#f3e5f5] p-3 rounded-xl text-[11px] font-bold border border-[#7b1fa2]">22:00 ~ 02:00 🎮 게임</div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-yellow-400 text-yellow-900 px-6 py-2 rounded-2xl font-black text-sm rotate-6 shadow-xl">
                &quot;가장 가치 있는 시간의 기록&quot;
              </div>
            </motion.div>
          </div>

          {/* Section 2: Infinite Styles */}
          <div className="space-y-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center space-y-4"
            >
              <div className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold">
                <Palette className="w-5 h-5" />
                <span>Infinite Styles</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white">
                표현의 한계가 없는 <span className="text-blue-500">스타일링</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                준비된 다양한 스타일 옵션들을 조합해보세요. 폰트와 정렬, 형태에 따라 완전히 다른 분위기를 연출할 수 있습니다.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div whileHover={{ y: -5 }} className="bg-[#fff9c4] border-b-4 border-[#fbc02d] p-6 rounded-none shadow-md text-[#333] font-[Arial]">
                <p className="text-[10px] uppercase font-bold opacity-40 mb-2">Checklist</p>
                <p className="text-sm leading-relaxed">1. 리액트 컴포넌트 구조 잡기<br/>2. Prisma 스키마 검토</p>
              </motion.div>

              <motion.div whileHover={{ y: -5 }} className="bg-[#263238] border-2 border-[#455a64] p-6 rounded-none shadow-xl text-white font-[Verdana] text-center">
                <p className="text-sm font-bold">📢 중요 공지사항</p>
                <p className="text-xs mt-2 opacity-70">다음 주 월요일 전체 회의</p>
              </motion.div>

              <motion.div whileHover={{ y: -5 }} className="bg-[#e3f2fd] border-l-4 border-[#90caf9] p-6 rounded-xl shadow-md text-[#1a237e] font-[Tahoma]">
                <p className="text-sm font-bold mb-2">💡 아이디어</p>
                <ul className="text-xs opacity-80">
                  <li>• 위치 기반 메모 서비스</li>
                  <li>• 실시간 동기화 구현</li>
                </ul>
              </motion.div>

              <motion.div whileHover={{ y: -5 }} className="bg-[#fce4ec] p-8 rounded-[100px] shadow-lg text-[#880e4f] font-[Georgia] flex items-center justify-center text-center italic border border-[#f8bbd0]">
                <p className="text-sm font-bold">항상 긍정적인 마음으로! ✨</p>
              </motion.div>

              <motion.div whileHover={{ y: -5 }} className="bg-[#e8f5e9] border border-[#a5d6a7] p-6 rounded-3xl shadow-md text-[#1b5e20] font-[Arial]">
                <p className="text-sm font-bold mb-2">🛒 장보기 목록</p>
                <p className="text-xs opacity-80">- 우유, 계란, 닭가슴살</p>
              </motion.div>

              <div className="flex items-center justify-center p-6 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl text-zinc-400 font-bold text-sm">
                Customizable Templates
              </div>
            </div>
          </div>

          {/* Section 3: Precision Control (통합 및 애니메이션 개선, 마우스 커서 제거) */}
          <div className="space-y-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center space-y-4"
            >
              <div className="inline-flex items-center gap-2 text-red-600 dark:text-red-400 font-bold">
                <Target className="w-5 h-5" />
                <span>Precision Control</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white">
                완벽한 배치를 위한 <span className="text-red-500">정밀 제어</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                가이드 시스템과 강력한 단축키를 결합하여 단 1픽셀의 오차도 없는 결과물을 만드세요.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              {/* 왼쪽: 비주얼 프리뷰 (커서 제거 및 겹침 UI 개선) */}
              <div className="relative min-h-[400px] bg-zinc-50 dark:bg-zinc-900/50 rounded-[3.5rem] border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                
                {/* 겹쳐진 베이스 메모 */}
                <div className="absolute w-40 h-40 bg-zinc-200 dark:bg-zinc-800 rounded-2xl border-2 border-zinc-300 dark:border-zinc-700 opacity-50" />
                
                {/* 움직이는 메모 */}
                <motion.div 
                  animate={{ 
                    x: [-60, 20, 20, -60, -60],
                    y: [-40, -40, 40, 40, -40]
                  }}
                  transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                  className="w-48 h-32 bg-yellow-400 rounded-2xl shadow-[0_20px_50px_rgba(234,179,8,0.4)] flex flex-col items-center justify-center p-6 border-4 border-white dark:border-zinc-800 z-10"
                >
                  <div className="bg-zinc-900 text-yellow-400 text-[10px] px-3 py-1 rounded-full font-mono font-black mb-3">
                    X: 1240, Y: 560
                  </div>
                  <div className="w-full h-1.5 bg-zinc-900/10 rounded-full mb-1" />
                  <div className="w-2/3 h-1.5 bg-zinc-900/10 rounded-full" />
                </motion.div>
                
                {/* 겹침 경고 오버레이 (위치 수정) */}
                <motion.div 
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: 1 }}
                  className="absolute bottom-10 bg-red-600 text-white px-6 py-2 rounded-full text-xs font-black shadow-2xl flex items-center gap-2 z-20 border-2 border-white/20"
                >
                  <AlertCircle className="w-4 h-4" /> 
                  OVERLAP DETECTED
                </motion.div>
              </div>

              {/* 오른쪽: 통합 기능 리스트 */}
              <div className="space-y-6 flex flex-col">
                <div className="flex-1 p-8 bg-zinc-900 dark:bg-zinc-800 text-white rounded-[2.5rem] shadow-xl space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-400 rounded-xl"><Target className="w-6 h-6 text-zinc-900" /></div>
                    <h4 className="text-xl font-bold italic">Smart Guide System</h4>
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    실시간 좌표 표시 기능으로 대칭을 맞추고, 겹침 감지 시스템으로 보드의 가독성을 보장하세요. 전문적인 정렬이 한결 쉬워집니다.
                  </p>
                </div>

                <div className="flex-1 p-8 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-xl"><Keyboard className="w-6 h-6 text-blue-600" /></div>
                    <h4 className="text-xl font-bold dark:text-white">Pro Shortcuts</h4>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex justify-between items-center p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                      <div className="flex items-center gap-2 text-xs font-bold text-zinc-500"><PlusSquare className="w-3.5 h-3.5" /> NEW MEMO</div>
                      <kbd className="text-[11px] font-mono bg-white dark:bg-zinc-700 px-2 py-1 rounded border shadow-sm font-black text-blue-600">Alt + N</kbd>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                      <div className="flex items-center gap-2 text-xs font-bold text-zinc-500"><Move className="w-3.5 h-3.5" /> MOVE</div>
                      <kbd className="text-[11px] font-mono bg-white dark:bg-zinc-700 px-2 py-1 rounded border shadow-sm font-black">Ctrl + Arrows</kbd>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                      <div className="flex items-center gap-2 text-xs font-bold text-zinc-500"><Maximize className="w-3.5 h-3.5" /> RESIZE</div>
                      <kbd className="text-[11px] font-mono bg-white dark:bg-zinc-700 px-2 py-1 rounded border shadow-sm font-black">Alt + Arrows</kbd>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-48 relative"
        >
          <div className="absolute inset-0 bg-yellow-400 rounded-[4rem] rotate-1 scale-[1.02] opacity-20 blur-xl" />
          <div className="relative p-12 sm:p-20 bg-yellow-400 rounded-[3.5rem] text-center shadow-2xl overflow-hidden">
            <Sparkles className="w-16 h-16 text-yellow-900 mx-auto mb-8 animate-bounce" />
            <h2 className="text-4xl sm:text-6xl font-black text-yellow-900 mb-8 tracking-tighter">
              생각을 담는<br />가장 스마트한 방식.
            </h2>
            <button 
              onClick={handleStart}
              className="group relative bg-zinc-900 text-white px-12 py-6 rounded-2xl font-black text-2xl hover:bg-zinc-800 transition-all flex items-center gap-4 shadow-xl mx-auto hover:scale-105 active:scale-95"
            >
              {isLoggedIn ? '내 보드로 이동하기' : '로그인하고 시작하기'} 
              <ArrowRight className="group-hover:translate-x-2 transition-transform w-6 h-6" />
            </button>
          </div>
        </motion.div>
      </section>
      <div className="py-12 text-center text-zinc-400 dark:text-zinc-600 font-medium text-sm">© 2026 Sticky. All rights reserved.</div>
    </main>
  );
}