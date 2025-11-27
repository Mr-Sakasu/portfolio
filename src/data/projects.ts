export interface Project {
    title: string;
    desc: string;
    image: string;
    link: string;
    tags: string[];
}

export const projectData: Record<string, Project[]> = {
    en: [
        {
            title: "NHK Student Robocon",
            desc: "Designed control program for ER injection mechanism, etc.",
            image: "/er.png",
            link: "https://www.tuat.ac.jp/NEWS/activity/20230713_01.html",
            tags: ["C++", "Embedded", "Robotics", "Python"]
        },
        {
            title: "Competitive Programming",
            desc: "Casual participation.",
            image: "/kyopro.avif",
            link: "https://atcoder.jp/users/Sakasu",
            tags: ["C++", "Algorithms", "Python"]
        },
        {
            title: "Web Development Portfolio",
            desc: "This website.",
            image: "/css.avif",
            link: "https://github.com/Mr-Sakasu/",
            tags: ["Astro", "TypeScript", "Tailwind"]
        },
        {
            title: "Super Smash Bros.",
            desc: "Casual online play.",
            image: "/robot.jpg",
            link: "#",
            tags: ["Nintendo", "Smash Bros"]
        }
    ],
    zh: [
        {
            title: "NHK 学生机器人大赛",
            desc: "负责 ER 发射机构的控制程序设计等。",
            image: "/er.png",
            link: "https://www.tuat.ac.jp/NEWS/activity/20230713_01.html",
            tags: ["C++", "嵌入式", "机器人", "Python"]
        },
        {
            title: "竞技编程 (算法竞赛)",
            desc: "佛系参与。",
            image: "/kyopro.avif",
            link: "https://atcoder.jp/users/Sakasu",
            tags: ["C++", "算法", "Python"]
        },
        {
            title: "Web 开发作品集",
            desc: "本网站。",
            image: "/css.avif",
            link: "https://github.com/Mr-Sakasu/",
            tags: ["Astro", "TypeScript", "Tailwind"]
        },
        {
            title: "任天堂明星大乱斗",
            desc: "休闲在线对战。",
            image: "/robot.jpg",
            link: "#",
            tags: ["Nintendo", "Smash Bros"]
        }
    ],
    jp: [
        {
            title: "NHK学生ロボコン",
            desc: "ER射出機構の制御プログラム設計など",
            image: "/er.png",
            link: "https://www.tuat.ac.jp/NEWS/activity/20230713_01.html",
            tags: ["C++", "組み込み", "Robotics", "Python"]
        },
        {
            title: "競技プログラミング",
            desc: "まったり参加",
            image: "/kyopro.avif",
            link: "https://atcoder.jp/users/Sakasu",
            tags: ["C++", "Algorithms", "Python"]
        },
        {
            title: "Web開発ポートフォリオ",
            desc: "このサイト",
            image: "/css.avif",
            link: "https://github.com/Mr-Sakasu/",
            tags: ["Astro", "TypeScript", "Tailwind"]
        },
        {
            title: "スマブラ",
            desc: "ゆるふわオンライン",
            image: "/robot.jpg",
            link: "#",
            tags: ["Nintendo", "Smash Bros"]
        }
    ]
};
