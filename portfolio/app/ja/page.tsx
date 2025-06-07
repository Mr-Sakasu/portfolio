import Image from "next/image";
import { Github, Terminal, Code, Award, Menu } from "lucide-react";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import HeaderWithMenu from "@/components/HeaderWithMenu";
import { messages } from "./messages";

export default function EngHome() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen px-6 py-16 bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
      <HeaderWithMenu />
      <main className="text-center space-y-6 max-w-2xl w-full">
        <section id="hero"><Hero /></section>
        <section id="about"><About content={messages.about.content}/></section>
        <section id="projects"><Projects projects={messages.projects.items}/></section>
        <section id="skills"><Skills /></section>
      </main>
      <footer className="mt-20 text-sm text-gray-500 dark:text-gray-400 text-center">
        © {new Date().getFullYear()} Sakasu Portfolio. All rights reserved.
      </footer>
    </div>
  );
}
