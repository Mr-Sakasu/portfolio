"use client";

import Image from "next/image";
import {PencilLine} from "lucide-react";

export default function About({content}: {content: string[]}) {

    return (
        <section className="mt-16 text-left max-w-2xl w-full px-4">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <PencilLine size={20} />
                About Me
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {content.map((line, index) => (
                    <span key={index}>
                        {line}
                        {index < content.length - 1 && <br />}
                    </span>
                ))}
            </p>
        </section>      
    );
}
