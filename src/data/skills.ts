export type SkillLocale = 'en' | 'zh' | 'ja';
export type SkillChildGroup = 'frontend' | 'backend';

export const skillChildGroupLabels: Record<SkillChildGroup, Record<SkillLocale, string>> = {
    frontend: {
        en: 'Frontend',
        zh: '前端',
        ja: 'フロントエンド',
    },
    backend: {
        en: 'Backend',
        zh: '后端',
        ja: 'バックエンド',
    },
};

export interface SkillStackItem {
    name: string;
    icon: string;
    level: 1 | 2 | 3 | 4 | 5;
    summary: Record<SkillLocale, string>;
    children?: Array<{
        name: string;
        icon: string;
        group?: SkillChildGroup;
    }>;
}

export const skillStack: SkillStackItem[] = [
    {
        name: 'C++',
        icon: '/icons/skills/cplusplus.svg',
        level: 4,
        summary: {
            en: 'Competitive programming, robotics control, solvers, optimization algorithms for my graduation thesis, and use of Gurobi.',
            zh: '算法竞赛、机器人控制、求解器、毕业论文中的优化算法实现，以及 Gurobi 的使用。',
            ja: '競プロ、ロボット制御、ソルバ実装。卒業論文では最適化アルゴリズムの実装やGurobiの利用を経験',
        },
        children: [
            { name: 'Algorithms', icon: '/icons/skills/algorithms.svg' },
            { name: 'Data Structures', icon: '/icons/skills/data-structures.svg' },
            { name: 'Heuristic', icon: '/icons/skills/heuristic.svg' },
            { name: 'Object-Oriented Programming', icon: '/icons/skills/oop.svg' },
            { name: 'Gurobi', icon: '/icons/skills/gurobi.svg' },
        ],
    },
    {
        name: 'C',
        icon: '/icons/skills/c.svg',
        level: 2,
        summary: {
            en: 'Low-level basics and systems exercises; used in university coursework and robotics control.',
            zh: '底层基础与系统编程练习；用于大学课程和机器人控制。',
            ja: '低レイヤの基礎とシステム系の演習。大学の授業やロボット制御で使用',
        },
        children: [
            { name: 'Algorithms', icon: '/icons/skills/algorithms.svg' },
            { name: 'Data Structures', icon: '/icons/skills/data-structures.svg' },
        ],
    },
    {
        name: 'Python',
        icon: '/icons/skills/python.svg',
        level: 2,
        summary: {
            en: 'Research experiments, data analysis, automation, web app backends, and implementation of machine-learning emotion recognition algorithms.',
            zh: '研究实验、数据分析、自动化、Web 应用后端，以及基于机器学习的情感识别算法实现。',
            ja: '研究実験、データ分析、自動化、Webアプリのバックエンドとして使用。機械学習による感情認識アルゴリズムも実装',
        },
        children: [
            { name: 'NumPy', icon: '/icons/skills/numpy.svg' },
            { name: 'pandas', icon: '/icons/skills/pandas.svg' },
            { name: 'PyTorch', icon: '/icons/skills/pytorch.svg' },
            { name: 'scikit-learn', icon: '/icons/skills/scikitlearn.svg' },
            { name: 'Seaborn', icon: '/icons/skills/seaborn.svg' },
            { name: 'NetworkX', icon: '/icons/skills/networkx.svg' },
        ],
    },
    {
        name: 'Web',
        icon: '/icons/skills/web.svg',
        level: 1,
        summary: {
            en: 'Frontend and backend web development; built this website, a typing web app, an e-commerce support AI chatbot, and an X/Twitter competitive-programming contest notification bot.',
            zh: '前端与后端 Web 开发；制作了本网站、打字 Web 应用、电子商务支持 AI 聊天机器人，以及 X/Twitter 算法竞赛通知 bot。',
            ja: 'フロントエンドとバックエンドのWeb開発。本Webサイト、タイピングWebアプリ、Eコマース支援AIチャットボット、X/Twitter向け競技プログラミングコンテスト通知botを作成',
        },
        children: [
            { name: 'JavaScript', icon: '/icons/skills/javascript.svg', group: 'frontend' },
            { name: 'TypeScript', icon: '/icons/skills/typescript.svg', group: 'frontend' },
            { name: 'Vue 3', icon: '/icons/skills/vue.svg', group: 'frontend' },
            { name: 'React', icon: '/icons/skills/react.svg', group: 'frontend' },
            { name: 'HTML', icon: '/icons/skills/html.svg', group: 'frontend' },
            { name: 'Astro', icon: '/icons/skills/astro.svg', group: 'frontend' },
            { name: 'Tailwind CSS', icon: '/icons/skills/tailwindcss.svg', group: 'frontend' },
            { name: 'Rust / Actix Web', icon: '/icons/skills/rust.svg', group: 'backend' },
            { name: 'Node.js', icon: '/icons/skills/nodejs.svg', group: 'backend' },
        ],
    },
    {
        name: 'Git / GitHub / GitLab',
        icon: '/icons/skills/git.svg',
        level: 2,
        summary: {
            en: 'Version control and CI basics.',
            zh: '版本管理与 CI 基础。',
            ja: 'バージョン管理とCIの基礎',
        },
        children: [
            { name: 'Git', icon: '/icons/skills/git.svg' },
            { name: 'GitHub', icon: '/icons/skills/github.svg' },
            { name: 'GitLab', icon: '/icons/skills/gitlab.svg' },
            { name: 'GitHub Actions', icon: '/icons/skills/githubactions.svg' },
        ],
    },
    {
        name: 'AWS',
        icon: '/icons/skills/aws.svg',
        level: 1,
        summary: {
            en: 'Cloud platform basics; used for poker game development.',
            zh: '云平台基础；用于扑克游戏开发。',
            ja: 'クラウドプラットフォームの基礎。ポーカーゲームの開発で利用',
        },
        children: [
            { name: 'AWS Lambda', icon: '/icons/skills/aws-lambda.svg' },
        ],
    },
    {
        name: 'Docker',
        icon: '/icons/skills/docker.svg',
        level: 1,
        summary: {
            en: 'Container basics for local development.',
            zh: '用于本地开发的容器基础。',
            ja: 'ローカル開発向けのコンテナ基礎',
        },
    },
    {
        name: 'Java',
        icon: '/icons/skills/java.svg',
        level: 1,
        summary: {
            en: 'Class-based programming basics; studied for about six months in undergraduate coursework.',
            zh: '基于类的编程基础；本科课程中学习了约半年。',
            ja: 'クラスベースのプログラミング基礎。学部の授業で半年ほど履修',
        },
    },
    {
        name: 'Haskell',
        icon: '/icons/skills/haskell.svg',
        level: 1,
        summary: {
            en: 'Functional programming basics; studied for about six months in undergraduate coursework.',
            zh: '函数式编程基础；本科课程中学习了约半年。',
            ja: '関数型プログラミングの基礎。学部の授業で半年ほど履修',
        },
    },
    {
        name: 'Rust',
        icon: '/icons/skills/rust.svg',
        level: 1,
        summary: {
            en: 'Ownership-focused systems programming basics; used for the backend of a typing game web app.',
            zh: '以所有权为核心的系统编程基础；用于打字游戏 Web 应用的后端。',
            ja: '所有権を中心にしたシステムプログラミング基礎。タイピングゲームWebアプリのバックエンドで使用',
        },
    },
    {
        name: 'R',
        icon: '/icons/skills/r.svg',
        level: 1,
        summary: {
            en: 'Statistical analysis basics; studied for about six months in undergraduate coursework.',
            zh: '统计分析基础；本科课程中学习了约半年。',
            ja: '統計解析の基礎。学部の授業で半年ほど履修',
        },
    },
    {
        name: 'DB',
        icon: '/icons/skills/database.svg',
        level: 1,
        summary: {
            en: 'Relational database basics; studied database fundamentals for about six months in undergraduate coursework.',
            zh: '关系数据库基础；本科课程中学习了约半年的数据库基础。',
            ja: 'リレーショナルデータベースの基礎。学部の授業で半年ほどデータベース基礎を履修',
        },
        children: [
            { name: 'PostgreSQL', icon: '/icons/skills/postgresql.svg' },
            { name: 'MySQL', icon: '/icons/skills/mysql.svg' },
        ],
    },
];
