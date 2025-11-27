// app/en/messages.ts
export const messages = {
    about: {
        content: [
            "修士課程で数理最適化やってます。",
            "競プロとソフトウェア開発、中国語に興味あります。あとスマブラ。",
        ],
    },
    projects: {
        items: [
            {
                title: "NHKロボコン",
                date: "2024/6, 2025/6",
                tag: "チーム開発",
                description: "ER発射システム",
                image: "/images/er.png",
            },
            {
                title: "競技プログラミング",
                date: "2023/4〜",
                tag: "個人開発",
                description: "AtCoder緑",
                image: "/images/program_code.avif",
            },
            {
                title: "Webポートフォリオ",
                date: "2025/5〜",
                tag: "個人開発",
                description: "このポートフォリオサイト",
                image: "/images/understand_css_perfectly.avif",
            },
        ],
    },
    currentTasks: {
        title: "進行中のタスク",
        description: "今まさに取り組んでいる作業を、パスコードでロックした状態で管理します。",
        privateNotice: "アクセスコードを入力したときだけ表示されます。",
        inputPlaceholder: "アクセスコードを入力",
        submitLabel: "解除",
        successMessage: "アクセス成功。現在進行中のタスクを開けます。",
        errorMessage: "コードが違います。もう一度試してください。",
        lockedHint: "あなた専用のコードで進行中タスクを確認できます。",
        linkLabel: "タスクを開く",
    },
};
