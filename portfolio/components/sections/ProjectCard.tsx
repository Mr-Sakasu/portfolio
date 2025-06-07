// components/ProjectCard.tsx
import Image from "next/image";

type ProjectCardProps = {
    title: string;
    date: string;
    tag: string;
    description: string;
    image: string;
};

function getTagColor(tag: string): string {
    switch (tag) {
        case "team development": 
        case "チーム開発":
            return "bg-green-600";
        case "self development":
            case "個人開発":
        return "bg-blue-600";
        default:
        return "bg-gray-600";
    }
}

export default function ProjectCard({
    title,
    date,
    tag,
    description,
    image,
}: ProjectCardProps) {
    return (
        <div className="rounded-lg overflow-hidden shadow-sm border border-white/10 bg-zinc-900 hover:scale-[1.02] transition-transform">
            <Image
                src={image}
                alt={title}
                width={400}
                height={200}
                className="w-full h-48 object-cover"
            />
            <div className="p-4">
                <h3 className="text-white text-lg font-bold">{title}</h3>
                <p className="text-sm text-gray-400 mb-1">{date}</p>
                <span 
                    className={`inline-block text-xs font-medium text-white rounded-full px-3 py-1 mb-2 ${getTagColor(tag)}`}
                >
                    {tag}
                </span>
                <p className="text-sm text-gray-300">{description}</p>
            </div>
        </div>
    );
}
