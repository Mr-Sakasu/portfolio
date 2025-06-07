import {PencilLine} from "lucide-react";
import ProjectCard from "./ProjectCard";

export default function Projects() {
    return (
        <section className="mt-16 text-left max-w-5xl w-full px-4 mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-white">Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <ProjectCard
                    title="NHK Robot Contest"
                    date="2024/6, 2025/6"
                    tag="team development"
                    description="ER Firing System"
                    image="/images/er.png"
                />
                <ProjectCard
                    title="Competitive Programming"
                    date="2023/4~"
                    tag="self development"
                    description="AtCoder Green"
                    image="/images/program_code.avif"
                />
                <ProjectCard
                    title="Web Portfolio"
                    date="2025/5~"
                    tag="self development"
                    description="This portfolio website"
                    image="/images/understand_css_perfectly.avif"
                />
            </div>
        </section>
    );
}
