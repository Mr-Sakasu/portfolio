"use client";

import Image from "next/image";
import { Github, Terminal } from "lucide-react";

export default function Hero() {
    return (
        <section>
            <div className="relative w-32 h-32 mx-auto">
                <Image
                    src="/avatar.jpg"
                    alt="Profile Avatar"
                    fill
                    className="object-cover rounded-full border-4 border-zinc-200 dark:border-zinc-700"
                />
            </div>
            <h1 className="text-4xl font-bold tracking-tight font-sans mt-4">Sakasu</h1>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">HEKE!!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                <a
                    href="https://atcoder.jp/users/Sakasu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 border border-gray-400 dark:border-gray-600 text-gray-800 dark:text-gray-100 rounded-full px-6 py-3 font-medium transition hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    <Terminal size={20} />
                    AtCoder
                </a>
                <a
                    href="https://github.com/Mr-Sakasu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 border border-gray-400 dark:border-gray-600 text-gray-800 dark:text-gray-100 rounded-full px-6 py-3 font-medium transition hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    <Github size={20} />
                    GitHub
                </a>
            </div>
        </section>
    );
}
