// 1. Define the "Class" (Type) for your events
export interface TimelineEvent {
    date: string;
    title: string;
    desc: string;
    color: 'blue' | 'yellow' | 'gray' | "green"; // Restrict colors for consistency
    icon: string;
}

// 2. Create the data dictionary
export const timelineData: Record<string, TimelineEvent[]> = {
    en: [
        {
            date: '2025-03',
            title: 'AtCoder Algorithm (Green)',
            desc: 'Reached Rating 800 in AtCoder Algorithm Contest.',
            color: 'green',
            icon: '🏆'
        },
        {
            date: '2024-07',
            title: 'Applied Information Technology Engineer',
            desc: 'Passed the national examination.',
            color: 'yellow',
            icon: '🎗️'
        },
        {
            date: '2024-01',
            title: 'Image Processing Engineer Expert',
            desc: 'Certified as an Expert in image processing.',
            color: 'yellow',
            icon: '🏅'
        }
    ],
    zh: [
        {
            date: '2025-03',
            title: 'AtCoder 启发式算法 (绿名)',
            desc: '在 AtCoder 启发式竞赛中达到 800 分。',
            color: 'green',
            icon: '🏆'
        },
        {
            date: '2024-07',
            title: '应用信息技术工程师考试',
            desc: '通过国家考试。',
            color: 'yellow',
            icon: '🎗️'
        },
        {
            date: '2024-01',
            title: '图像处理工程师专家认证',
            desc: '获得图像处理专家认证。',
            color: 'yellow',
            icon: '🏅'
        }
    ],
    jp: [
        {
            date: '2025-03',
            title: 'AtCoder Heuristic部門 緑色',
            desc: 'AtCoder Heuristic部門でレート800を達成',
            color: 'green',
            icon: '🏆'
        },
        {
            date: '2024-07',
            title: '応用情報技術者試験 合格',
            desc: '国家試験に合格',
            color: 'yellow',
            icon: '🎗️'
        },
        {
            date: '2024-01',
            title: '画像処理エンジニア検定 エキスパート合格',
            desc: '画像処理のエキスパートとして認定',
            color: 'yellow',
            icon: '🏅'
        }
    ]
};