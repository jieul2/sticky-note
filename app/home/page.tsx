'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  StickyNote as NoteIcon, 
  Palette, 
  Component, 
  MousePointerClick,
  Sparkles
} from "lucide-react";

export default function Homepage() {
  return (
    <main className="min-h-screen bg-[#fafafa] dark:bg-zinc-950 text-foreground overflow-hidden relative">
      {/* 배경 장식: 메모지들이 흩뿌려진 듯한 느낌의 도트 배경 */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      {/* Hero Section */}
      <section className="relative mx-auto max-w-6xl px-6 py-24 sm:py-40">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          {/* Logo Section */}
          <div className="mb-10 flex justify-center">
            <motion.div 
              whileHover={{ rotate: [-1, 1, -1, 0], scale: 1.05 }}
              className="relative flex h-24 w-24 items-center justify-center rounded-[2rem] bg-yellow-400 shadow-[0_20px_50px_rgba(234,179,8,0.3)]"
            >
              <NoteIcon className="h-12 w-12 text-yellow-900" />
              <motion.div 
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -right-1 -bottom-1"
              >
                <Sparkles className="h-6 w-6 text-orange-500 fill-orange-500" />
              </motion.div>
            </motion.div>
          </div>

          {/* Title Section */}
          <motion.h1 
            className="text-5xl font-black tracking-tight sm:text-7xl mb-8 italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Sticky <span className="text-yellow-500 not-italic">Note.</span>
          </motion.h1>
          
          {/* Description Section */}
          <motion.p 
            className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            정해진 틀은 없습니다. <br />
            당신의 아이디어를 가장 당신다운 방식으로, <br />
            <span className="text-foreground border-b-2 border-yellow-400">자유로운 캔버스 위에 마음껏 꾸며보세요.</span>
          </motion.p>

          {/* Action Buttons */}
          <motion.div 
            className="mt-12 flex flex-col sm:flex-row justify-center gap-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Button asChild size="lg" className="h-14 px-10 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:scale-105 transition-transform text-lg font-bold">
              <Link href="/load">
                지금 꾸미러 가기 <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="lg" className="h-14 px-10 rounded-2xl text-lg font-semibold">
              <Link href="/helper">둘러보기</Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Highlights Section */}
      <section className="mx-auto max-w-5xl px-6 pb-32">
        <div className="grid gap-10 sm:grid-cols-3">
          <Highlight
            icon={<Palette className="h-7 w-7 text-pink-500" />}
            title="자유로운 스타일"
            desc="컬러, 폰트, 크기까지 모든 것이 당신의 취향대로."
          />
          <Highlight
            icon={<Component className="h-7 w-7 text-indigo-500" />}
            title="제한 없는 배치"
            desc="어디든 던져두세요. 당신이 놓는 그곳이 정답입니다."
          />
          <Highlight
            icon={<MousePointerClick className="h-7 w-7 text-emerald-500" />}
            title="직관적인 조작"
            desc="복잡한 도구 대신 손쉬운 핸들링으로 완성하세요."
          />
        </div>
      </section>
    </main>
  );
}

function Highlight({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex flex-col items-center text-center group">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-white dark:bg-zinc-900 shadow-xl group-hover:scale-110 transition-transform duration-300 border border-zinc-100 dark:border-zinc-800">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed px-4">
        {desc}
      </p>
    </div>
  );
}