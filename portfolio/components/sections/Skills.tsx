"use client";

import { SiPython, SiCplusplus, SiLatex, SiTypescript} from "react-icons/si";
import { MdCatchingPokemon } from "react-icons/md";
import { RiNextjsFill } from "react-icons/ri";
import { FaGithub, FaGitAlt, FaGitlab, FaReact} from "react-icons/fa";
import { SiThunderstore } from "react-icons/si";
const skill_list = [
    SiPython,
    SiCplusplus,
    SiLatex,
    SiTypescript,
    RiNextjsFill,
    FaReact,
    FaGithub,
    FaGitAlt,
    FaGitlab
];
export default function Skills() {
    return (
        <section className="mt-16 text-center max-w-2xl w-full mx-auto px-4">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <SiThunderstore size={20} />
                Skills
            </h2>
            <br/>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 justify-items-center">
                {skill_list.map((Icon, index) => (
                    <Icon key={index} size={40} className="text-white" />
                ))}
            </div>
        </section>
    );
}