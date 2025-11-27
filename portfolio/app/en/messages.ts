// app/en/messages.ts
export const messages = {
    about: {
        content: [
            "I'm a master's student, specializing in mathmatical optimization.",
            "My Hobbies include competitive programming, software development, and learning Chinese.",
        ],
    },
    projects: {
        items: [
            {
                title: "NHK Robot Contest",
                date: "2024/6, 2025/6",
                tag: "Team Development",
                description: "ER Launch System",
                image: "/images/er.png",
            },
            {
                title: "Competitive Programming",
                date: "2023/4 - Present",
                tag: "Self Development",
                description: "AtCoder Green",
                image: "/images/program_code.avif",
            },
            {
                title: "Web Portfolio",
                date: "2025/5 - Present",
                tag: "Self Development",
                description: "This portfolio website",
                image: "/images/understand_css_perfectly.avif",
            },
        ],
    },
    currentTasks: {
        title: "Current Work",
        description: "Unlock a private view of the projects I'm actively working on right now.",
        privateNotice: "These items are only visible after entering the private access code.",
        inputPlaceholder: "Enter access code",
        submitLabel: "Unlock",
        successMessage: "Access granted. You can open the current tasks below.",
        errorMessage: "That code did not match. Please try again.",
        lockedHint: "Use your private access code to see the current task details.",
        linkLabel: "Open task",
    },
};
