// app/page.tsx
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import { messages } from "./messages";

export default function HomePage() {
  return (
    <>
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
    </>
  );
}
