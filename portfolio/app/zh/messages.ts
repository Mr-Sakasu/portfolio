// app/en/messages.ts
export const messages = {
    about: {
        content: [
            "我是一名主修数学优化的硕士研究生",
            "我对算法竞赛、软件开发和中文很感兴趣",
            "另外，我也喜欢仰望星空",
        ],
    },
    projects: {
        items: [
            {
                title: "NHK机器人大赛",
                date: "2024/6, 2025/6",
                tag: "团队开发",
                description: "ER发射系统",
                image: "/images/er.png",
            },
            {
                title: "算法竞赛",
                date: "2023/4〜",
                tag: "个人开发",
                description: "AtCoder 绿色",
                image: "/images/program_code.avif",
            },
            {
                title: "Web个人网站",
                date: "2025/5〜",
                tag: "个人开发",
                description: "这个个人网站",
                image: "/images/understand_css_perfectly.avif",
            },
        ],
    },
    currentTasks: {
        title: "当前进行的任务",
        description: "输入专属口令后，才可以查看我正在处理的事项。",
        privateNotice: "只有输入访问码后才会显示这些内容。",
        inputPlaceholder: "输入访问码",
        submitLabel: "解锁",
        successMessage: "验证成功。你可以查看当前的任务。",
        errorMessage: "口令不正确，请重试。",
        lockedHint: "使用你的专属口令来查看当前任务。",
        linkLabel: "打开任务",
    },
};
