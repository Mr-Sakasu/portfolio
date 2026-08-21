export interface Project {
    title: string;
    desc: string;
    image: string;
    video?: string;
    poster?: string;
    link: string;
    tags: string[];
}

export const projectSlugs = [
    'nhk-student-robocon',
    'competitive-programming',
    'typing-game',
    'ai-commerce-agent',
    'virtual-contest-bot',
    'web-development-portfolio',
] as const;

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
            title: "Typing Game",
            desc: "Vue and Rust typing game with time tracking, sound feedback, and a ranking API design.",
            image: "/css.avif",
            video: "/videos/projects/type-game-demo.mp4",
            poster: "/images/projects/type-game-demo-poster.jpg",
            link: "https://github.com/Mr-Sakasu/typing-game",
            tags: ["Vue", "Rust", "Actix Web", "PostgreSQL"]
        },
        {
            title: "AI Commerce Agent",
            desc: "Chrome extension prototype that assists JD.com shopping with product extraction, multilingual queries, voice input, and image input.",
            image: "/css.avif",
            video: "/videos/projects/jd-global-demo.mp4",
            poster: "/images/projects/jd-global-demo-poster.jpg",
            link: "https://github.com/Mr-Sakasu/Ergonomics",
            tags: ["Chrome Extension", "JavaScript", "OpenAI API", "JD.com"]
        },
        {
            title: "Virtual Contest Bot",
            desc: "X/Twitter bot that notifies AtCoder Problems virtual contests.",
            image: "/images/projects/virtual-contest-bot.png",
            link: "https://x.com/contest_bot_mcc",
            tags: ["Python", "Selenium", "BeautifulSoup", "X API"]
        },
        {
            title: "Web Development Portfolio",
            desc: "This website.",
            image: "/css.avif",
            link: "https://github.com/Mr-Sakasu/",
            tags: ["Astro", "TypeScript", "Tailwind"]
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
            title: "Typing Game",
            desc: "使用 Vue 和 Rust/Actix Web 制作的打字游戏，包含计时、音效反馈和排行榜 API 设计。",
            image: "/css.avif",
            video: "/videos/projects/type-game-demo.mp4",
            poster: "/images/projects/type-game-demo-poster.jpg",
            link: "https://github.com/Mr-Sakasu/typing-game",
            tags: ["Vue", "Rust", "Actix Web", "PostgreSQL"]
        },
        {
            title: "AI 电商助手",
            desc: "辅助 JD.com 购物的 Chrome 扩展原型，支持商品信息抽取、多语言查询、语音输入和图像输入。",
            image: "/css.avif",
            video: "/videos/projects/jd-global-demo.mp4",
            poster: "/images/projects/jd-global-demo-poster.jpg",
            link: "https://github.com/Mr-Sakasu/Ergonomics",
            tags: ["Chrome Extension", "JavaScript", "OpenAI API", "JD.com"]
        },
        {
            title: "Virtual Contest Bot",
            desc: "通知 AtCoder Problems 虚拟比赛信息的 X/Twitter bot。",
            image: "/images/projects/virtual-contest-bot.png",
            link: "https://x.com/contest_bot_mcc",
            tags: ["Python", "Selenium", "BeautifulSoup", "X API"]
        },
        {
            title: "Web 开发作品集",
            desc: "本网站。",
            image: "/css.avif",
            link: "https://github.com/Mr-Sakasu/",
            tags: ["Astro", "TypeScript", "Tailwind"]
        }
    ],
    ja: [
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
            title: "Typing Game",
            desc: "Vue 3 と Rust/Actix Webで作成したタイピングゲーム。タイム計測、効果音、ランキングAPI設計を実装",
            image: "/css.avif",
            video: "/videos/projects/type-game-demo.mp4",
            poster: "/images/projects/type-game-demo-poster.jpg",
            link: "https://github.com/Mr-Sakasu/typing-game",
            tags: ["Vue", "Rust", "Actix Web", "PostgreSQL"]
        },
        {
            title: "AI Commerce Agent",
            desc: "JD.comでの商品検索・比較を支援するChrome拡張プロトタイプ。多言語入力、音声、画像から検索語を生成",
            image: "/css.avif",
            video: "/videos/projects/jd-global-demo.mp4",
            poster: "/images/projects/jd-global-demo-poster.jpg",
            link: "https://github.com/Mr-Sakasu/Ergonomics",
            tags: ["Chrome Extension", "JavaScript", "OpenAI API", "JD.com"]
        },
        {
            title: "Virtual Contest Bot",
            desc: "AtCoder Problemsのバーチャルコンテスト情報をX/Twitterへ通知するbot",
            image: "/images/projects/virtual-contest-bot.png",
            link: "https://x.com/contest_bot_mcc",
            tags: ["Python", "Selenium", "BeautifulSoup", "X API"]
        },
        {
            title: "Web開発ポートフォリオ",
            desc: "このサイト",
            image: "/css.avif",
            link: "https://github.com/Mr-Sakasu/",
            tags: ["Astro", "TypeScript", "Tailwind"]
        }
    ]
};

export const getProjectBySlug = (lang: string, slug: string) => {
    const projectIndex = projectSlugs.indexOf(slug as typeof projectSlugs[number]);
    if (projectIndex === -1) return undefined;

    return (projectData[lang] ?? projectData.en)[projectIndex];
};
