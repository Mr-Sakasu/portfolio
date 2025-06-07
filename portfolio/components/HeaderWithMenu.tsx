// components/HeaderWithMenu.tsx
"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function HeaderWithMenu() {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* メニューボタン */}
            <button
                onClick={() => setOpen(!open)}
                className="fixed top-4 right-4 z-50 p-3 bg-zinc-800 text-white rounded-full shadow-md transition hover:bg-zinc-700 sm:hidden"
                aria-label="Toggle menu"
            >
                {open ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* モバイル用メニューのみを表示（Heroなどの中身は含めない） */}
            {open && (
                <nav className="fixed top-16 right-4 z-40 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md rounded-xl shadow-lg p-4 space-y-3 text-sm text-left w-48 animate-fade-in">
                    <a href="#hero" onClick={() => setOpen(false)} className="block px-3 py-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition">Hero</a>
                    <a href="#about" onClick={() => setOpen(false)} className="block px-3 py-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition">About</a>
                    <a href="#projects" onClick={() => setOpen(false)} className="block px-3 py-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition">Projects</a>
                    <a href="#skills" onClick={() => setOpen(false)} className="block px-3 py-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition">Skills</a>
                </nav>
            )}
        </>
    );
}
