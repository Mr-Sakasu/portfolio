import Image from "next/image";
import { Github, Terminal, Code, Award, Menu } from "lucide-react";
import { Suspense } from 'react';
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import HeaderWithMenu from "@/components/HeaderWithMenu";
import { messages } from "./messages";
import {GeometricBackground} from "@/components/GeometricBackground"; // 必要なら import

export default function HomePage() {
  return (
    <div className="relative min-h-screen ">
      <Suspense fallback={<div className="fixed inset-0 bg-black/10" />}>
        <GeometricBackground />
      </Suspense>

      <HeaderWithMenu />

      <main className="relative z-10">
        <section id="hero" className="min-h-screen flex items-center justify-center px-6">
          <Hero />
        </section>

        <section id="about" className="min-h-screen flex items-center justify-center px-6">
          <About content={messages.about.content} />
        </section>

        <section id="projects" className="min-h-screen flex items-center justify-center px-6">
          <Projects projects={messages.projects.items} />
        </section>

        <section id="skills" className="min-h-screen flex items-center justify-center px-6">
          <Skills />
        </section>
      </main>

      <footer className="relative z-10 py-8 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-zinc-700">
        © {new Date().getFullYear()} Sakasu Portfolio. All rights reserved.
      </footer>
    </div>
  );
}