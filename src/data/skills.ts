export type SkillLocale = 'en' | 'zh' | 'jp';

export interface SkillStackItem {
    name: string;
    icon: string;
    level: 1 | 2 | 3 | 4 | 5;
    summary: Record<SkillLocale, string>;
    children?: Array<{
        name: string;
        icon: string;
    }>;
}

export const skillStack: SkillStackItem[] = [
    {
        name: 'C++',
        icon: '/icons/skills/cplusplus.svg',
        level: 4,
        summary: {
            en: 'Competitive programming, robotics control, solvers.',
            zh: '算法竞赛、机器人控制、求解器。',
            jp: '競プロ、ロボット制御、ソルバ実装',
        },
        children: [
            { name: 'Algorithms', icon: '/icons/skills/algorithms.svg' },
            { name: 'Data Structures', icon: '/icons/skills/data-structures.svg' },
            { name: 'Heuristic', icon: '/icons/skills/heuristic.svg' },
            { name: 'Object-Oriented Programming', icon: '/icons/skills/oop.svg' },
        ],
    },
    {
        name: 'C',
        icon: '/icons/skills/c.svg',
        level: 2,
        summary: {
            en: 'Low-level basics and systems exercises.',
            zh: '底层基础与系统编程练习。',
            jp: '低レイヤの基礎とシステム系の演習',
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
            en: 'Research experiments, data analysis, automation.',
            zh: '研究实验、数据分析、自动化。',
            jp: '研究実験、データ分析、自動化',
        },
        children: [
            { name: 'NumPy', icon: '/icons/skills/numpy.svg' },
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
            en: 'Typed static sites and compact interfaces.',
            zh: '带类型的静态网站与紧凑界面。',
            jp: '型付き静的サイトとコンパクトなUI',
        },
        children: [
            { name: 'JavaScript', icon: '/icons/skills/javascript.svg' },
            { name: 'TypeScript', icon: '/icons/skills/typescript.svg' },
            { name: 'HTML', icon: '/icons/skills/html.svg' },
            { name: 'Astro', icon: '/icons/skills/astro.svg' },
            { name: 'Vue', icon: '/icons/skills/vue.svg' },
            { name: 'React', icon: '/icons/skills/react.svg' },
            { name: 'Tailwind CSS', icon: '/icons/skills/tailwindcss.svg' },
        ],
    },
    {
        name: 'Git / GitHub / GitLab',
        icon: '/icons/skills/git.svg',
        level: 2,
        summary: {
            en: 'Version control and CI basics.',
            zh: '版本管理与 CI 基础。',
            jp: 'バージョン管理とCIの基礎',
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
            en: 'Cloud platform basics.',
            zh: '云平台基础。',
            jp: 'クラウドプラットフォームの基礎',
        },
        children: [
            { name: 'AWS Lambda', icon: '/icons/skills/aws-lambda.svg' },
        ],
    },
    {
        name: 'Java',
        icon: '/icons/skills/java.svg',
        level: 1,
        summary: {
            en: 'Class-based programming basics.',
            zh: '基于类的编程基础。',
            jp: 'クラスベースのプログラミング基礎',
        },
    },
    {
        name: 'Haskell',
        icon: '/icons/skills/haskell.svg',
        level: 1,
        summary: {
            en: 'Functional programming basics.',
            zh: '函数式编程基础。',
            jp: '関数型プログラミングの基礎',
        },
    },
    {
        name: 'Rust',
        icon: '/icons/skills/rust.svg',
        level: 1,
        summary: {
            en: 'Ownership-focused systems programming basics.',
            zh: '以所有权为核心的系统编程基础。',
            jp: '所有権を中心にしたシステムプログラミング基礎',
        },
    },
    {
        name: 'PostgreSQL',
        icon: '/icons/skills/postgresql.svg',
        level: 1,
        summary: {
            en: 'Relational database basics.',
            zh: '关系数据库基础。',
            jp: 'リレーショナルデータベースの基礎',
        },
    },
];
