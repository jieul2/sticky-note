'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowRight, Code, Database, Layout } from "lucide-react";

export default function Homepage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center" >
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            깔끔한 Next.js + TypeScript
          </h1>
          <p className="mt-6 text-sm text-foreground/70">
            유지보수하기 쉽고 확장 가능한 웹 애플리케이션 스타터
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/load">
                시작하기 <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/helper">사용 방법</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Feature
            icon={<Layout className="h-6 w-6" />}
            title="모던 UI"
            desc="Tailwind + shadcn/ui 기반의 일관된 디자인"
          />
          <Feature
            icon={<Code className="h-6 w-6" />}
            title="TypeScript"
            desc="타입 안정성으로 런타임 오류 최소화"
          />
          <Feature
            icon={<Database className="h-6 w-6" />}
            title="확장성"
            desc="API · DB · 인증까지 자연스럽게 확장"
          />
        </div>
      </section>
    </main>
  );
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <Card className="h-full bg-card border border-border">
        <CardContent className="p-6">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-muted">
            {icon}
          </div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="mt-2 text-foreground/70">{desc}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
