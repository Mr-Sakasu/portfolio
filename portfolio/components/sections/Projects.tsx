import {PencilLine} from "lucide-react";
import ProjectCard from "./ProjectCard";

type Project = {
    title: string;
    date: string;
    tag: string;
    description: string;
    image: string;
};

type ProjectsProps = {
    projects: Project[];
};
  
  
export default function Projects({projects}: ProjectsProps) {
    return (
        <section className="mt-16 text-left max-w-5xl w-full px-4 mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-white">Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {projects.map((proj, i) => (
                    <ProjectCard key={i} {...proj} />
                ))}
            </div>
        </section>
    );
}
