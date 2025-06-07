import Image from "next/image";
import Link from "next/link";
import { Github, Code, Terminal, Award} from "lucide-react";


export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-16 bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
      {/* Hero セクション */}
      <main className="text-center space-y-6 max-w-2xl">
        <div className="relative w-32 h-32 mx-auto">
          <Image
            src="/avatar.jpg"
            alt="Profile Avatar"
            fill
            className="object-cover rounded-full border-4 border-zinc-200 dark:border-zinc-700"
          />
        </div>
        <h1 className="text-4xl font-bold tracking-tight font-sans">
          Sakasu
        </h1>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
          HEKE!!
        </p>

        {/* ボタン */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <a
            href="https://atcoder.jp/users/Sakasu"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 border border-gray-400 dark:border-gray-600 text-gray-800 dark:text-gray-100 rounded-full px-6 py-3 font-medium transition hover:bg-gray-100 dark:hover:bg-gray-700">
            <Terminal size={20} />
            atcoder
  
          </a>
          <a
            href="https://github.com/yourname"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 border border-gray-400 dark:border-gray-600 text-gray-800 dark:text-gray-100 rounded-full px-6 py-3 font-medium transition hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Github size={20} />
            GitHub
          </a>
        </div>
      </main>

      {/* フッター */}
      <footer className="mt-20 text-sm text-gray-500 dark:text-gray-400 text-center">
        © {new Date().getFullYear()} Sakasu Portfolio. All rights reserved.
      </footer>
    </div>
  );
}
