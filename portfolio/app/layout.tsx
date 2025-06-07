// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LangSwitcher from "@/components/LangSwitcher";
import VantaBackground from "@/components/GraphBackground";


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
  description: "A portfolio showcasing Sakasu's work and achievements."
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased bg-white text-gray-900 dark:bg-zinc-900 dark:text-white min-h-screen">
        <VantaBackground />
        <LangSwitcher />
        {children}
      </body>
    </html>
  );
}
