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
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full flex flex-col overflow-hidden bg-white dark:bg-black text-gray-900 dark:text-white`}
      >
        <SettingsProvider>
          <SaveProvider>
            {/* 전역 헤더: Header.tsx 내부의 h-16과 일치하도록 관리 */}
            <Header />
            
            {/* 메인 본문: flex-1을 통해 헤더 제외 영역을 정확히 점유 */}
            <main className="flex-1 min-h-0 overflow-hidden relative">
              {children}
            </main>
          </SaveProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}