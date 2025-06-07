// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LangSwitcher from "@/components/LangSwitcher";
import HeaderWithMenu from "@/components/HeaderWithMenu";
import { GeometricBackground } from "@/components/GeometricBackground";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sakasu's Portfolio",
  description: "What's up?",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased bg-white text-gray-900 dark:bg-zinc-900 dark:text-white min-h-screen">
        {/* 背景アニメーション */}
        <Suspense fallback={<div className="fixed inset-0 bg-black/10" />}>
          <GeometricBackground />
        </Suspense>

        {/* 言語切替ボタン */}
        <LangSwitcher />

        {/* グローバルヘッダー */}
        <HeaderWithMenu />

        {/* 各ページ内容 */}
        <main className="relative z-10">{children}</main>

        {/* 共通フッター */}
        <footer className="relative z-10 py-8 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-zinc-700">
          © {new Date().getFullYear()} Sakasu Portfolio. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
