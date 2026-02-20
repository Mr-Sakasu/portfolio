export const CURRENT_MONTH_TOKEN = '__CURRENT_MONTH__';

// 2. Define the "Class" (Type) for your events
export interface TimelineEvent {
    date: string;
    title: string;
    desc: string;
    color: 'blue' | 'yellow' | 'gray' | 'green' | 'red';
    icon: string;
}

// 3. Create the data dictionary
export const timelineData: Record<string, TimelineEvent[]> = {
    en: [
        {
            date: CURRENT_MONTH_TOKEN,
            title: 'Current Focus',
            desc: 'Master\'s Research',
            color: 'blue',
            icon: '✒'
        },
        {
            date: '2025-08',
            title: 'Obtained HSK Level 5',
            desc: 'Conversational Chinese proficiency.',
            color: 'red',
            icon: '🇨🇳'
        },
        {
            date: '2024-03',
            title: 'AtCoder Algorithm (Green)',
            desc: 'I can do algorithms... (really just a tiny bit).',
            color: 'green',
            icon: '🏆'
        },
        {
            date: '2023-12',
            title: 'ICPC2023 Asia Yokohama Regional',
            desc: 'Carried by my teammates (Part 2).',
            color: 'blue',
            icon: '💻'
        },
        {
            date: '2023-10',
            title: 'Applied Information Technology Engineer',
            desc: 'Passed the national examination.',
            color: 'blue',
            icon: '🏅'
        },
        {
            date: '2023-08',
            title: 'CG Engineer Certification (Expert)',
            desc: 'Certified as an Expert in image processing.',
            color: 'blue',
            icon: '🏅'
        },
        {
            date: '2023-06',
            title: 'NHK Student Robocon 2023 Runner-up',
            desc: 'Carried by my teammates.',
            color: 'yellow',
            icon: '🤖'
        }
    ],
    zh: [
        {
            date: CURRENT_MONTH_TOKEN,
            title: '疯狂研究研究研究',
            desc: '硕士研究',
            color: 'blue',
            icon: '✒'
        },
        {
            date: '2025-08',
            title: '获得 HSK 5级证书',
            desc: '具备汉语日常会话能力。',
            color: 'red',
            icon: '🇨🇳'
        },
        {
            date: '2024-03',
            title: 'AtCoder 算法竞技 (绿名)',
            desc: '算法... (真的只懂一点点)。',
            color: 'green',
            icon: '🏆'
        },
        {
            date: '2023-12',
            title: 'ICPC 2023 亚洲横滨赛区',
            desc: '被队友带飞 (第二弹)。',
            color: 'blue',
            icon: '💻'
        },
        {
            date: '2023-10',
            title: '应用信息技术工程师考试',
            desc: '通过国家资格考试。',
            color: 'blue',
            icon: '🏅'
        },
        {
            date: '2023-08',
            title: 'CG 工程师认证 (专家级)',
            desc: '获得图像处理专家认证。',
            color: 'blue',
            icon: '🏅'
        },
        {
            date: '2023-06',
            title: 'NHK 学生机器人大赛 2023 亚军',
            desc: '被队友带飞。',
            color: 'yellow',
            icon: '🤖'
        }
    ],
    jp: [
        {
            date: CURRENT_MONTH_TOKEN,
            title: '現在',
            desc: '修士課程で研究中...',
            color: 'blue',
            icon: '✒'
        },
        {
            date: '2025-08',
            title: 'HSK 5級 取得',
            desc: '中国語チョットデキル',
            color: 'red',
            icon: '🇨🇳'
        },
        {
            date: '2024-03',
            title: 'AtCoder Algo 緑色',
            desc: 'アルゴリズム(本当にチョットダケ)デキル',
            color: 'green',
            icon: '🏆'
        },
        {
            date: '2023-12',
            title: 'ICPC2023 Asia Yokohama Regional Contest 出場',
            desc: 'sankaKsu: キャリーされました2',
            color: 'blue',
            icon: '💻'
        },
        {
            date: '2023-10',
            title: '応用情報技術者試験 合格',
            desc: '国家試験に合格',
            color: 'blue',
            icon: '🏅'
        },
        {
            date: '2023-08',
            title: 'CGエンジニア検定 エキスパート',
            desc: '画像処理のエキスパート(?)',
            color: 'blue',
            icon: '🏅'
        },
        {
            date: '2023-06',
            title: 'NHK学生ロボコン2023 準優勝',
            desc: 'キャリーされました',
            color: 'yellow',
            icon: '🤖'
        }
    ]
};
