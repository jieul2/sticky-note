import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import { SaveProvider } from "./components/SaveContext";
import { SettingsProvider } from "./components/SettingsContext";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Sticky Note",
  description: "My sticky note board",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen flex flex-col overflow-hidden bg-white dark:bg-black text-gray-900 dark:text-white`}
      >
        <SettingsProvider>
          <SaveProvider>
            {/* 전역 헤더: 높이 h-14 고정 */}
            <Header />
            
            {/* 메인 본문: 헤더를 제외한 나머지 전체 영역(flex-1)을 차지함 */}
            <main className="flex-1 overflow-auto relative">
              {children}
            </main>
          </SaveProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}