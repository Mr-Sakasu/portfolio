// 1. Define the "Class" (Type) for your events
export interface TimelineEvent {
    date: string;
    title: string;
    desc: string;
    color: 'blue' | 'yellow' | 'gray' | 'green';
    icon: string;
}

// 2. Create the data dictionary
export const timelineData: Record<string, TimelineEvent[]> = {
    en: [
        {
            date: '2025-08',
            title: 'Obtained HSK Level 5',
            desc: 'Conversational Chinese proficiency.',
            color: 'blue',
            icon: '🇨🇳'
        },
        {
            date: '2024-03',
            title: 'AtCoder Algorithm (Green)',
            desc: 'Reached Rating 800 (Green) in Algorithm Contest.',
            color: 'green',
            icon: '🏆'
        },
        {
            date: '2023-10',
            title: 'Applied Information Technology Engineer',
            desc: 'Passed the national examination.',
            color: 'blue',
            icon: '📜'
        },
        {
            date: '2023-08',
            title: 'CG Engineer Certification (Expert)',
            desc: 'Certified as an Expert in Computer Graphics engineering.',
            color: 'blue',
            icon: '🎨'
        },
        {
            date: '2023-06',
            title: 'NHK Student Robocon 2023 Runner-up',
            desc: 'Designed control program for the ER injection mechanism.',
            color: 'blue',
            icon: '🤖'
        }
    ],
    zh: [
        {
            date: '2025-08',
            title: '获得 HSK 5级证书',
            desc: '具备汉语日常会话能力。',
            color: 'blue',
            icon: '🇨🇳'
        },
        {
            date: '2024-03',
            title: 'AtCoder 算法竞技 (绿名)',
            desc: '在算法竞赛中达到 800 分 (绿色)。',
            color: 'green',
            icon: '🏆'
        },
        {
            date: '2023-10',
            title: '应用信息技术工程师考试',
            desc: '通过国家资格考试。',
            color: 'blue',
            icon: '📜'
        },
        {
            date: '2023-08',
            title: 'CG 工程师认证 (专家级)',
            desc: '获得计算机图形学专家认证。',
            color: 'blue',
            icon: '🎨'
        },
        {
            date: '2023-06',
            title: 'NHK 学生机器人大赛 2023 亚军',
            desc: '负责 ER 发射机构的控制程序设计。',
            color: 'blue',
            icon: '🤖'
        }
    ],
    jp: [
        {
            date: '2025-08',
            title: 'HSK 5級 取得',
            desc: '中国語チョットデキル',
            color: 'blue',
            icon: '🇨🇳'
        },
        {
            date: '2024-03',
            title: 'AtCoder Algo 緑色',
            desc: 'アルゴリズムチョットデキル',
            color: 'green',
            icon: '🏆'
        },
        {
            date: '2023-10',
            title: '応用情報技術者試験 合格',
            desc: '国家試験に合格',
            color: 'blue',
            icon: '📜'
        },
        {
            date: '2023-08',
            title: 'CGエンジニア検定 エキスパート',
            desc: '画像処理のエキスパートとして認定',
            color: 'blue',
            icon: '🎨'
        },
        {
            date: '2023-06',
            title: 'NHK学生ロボコン2023 準優勝',
            desc: 'ER射出機構の制御プログラム設計',
            color: 'blue',
            icon: '🤖'
        }
    ]
};