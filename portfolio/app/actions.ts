'use server';

import { timingSafeEqual } from "crypto";

export type Task = {
    title: string;
    description: string;
    link: string;
};

export type TaskAccessState = {
    status: "idle" | "granted" | "denied" | "error";
    tasks: Task[];
    message?: string;
};

const currentTasks: Task[] = [
    {
        title: "CLISA replication on Kaggle",
        description: "Tracking progress on reproducing CLISA results in a Kaggle notebook.",
        link: "https://www.kaggle.com/code/sakasu01/clisa-repricate?scriptVersionId=282101192",
    },
];

function isValidAccessCode(input: string, expected: string) {
    const inputBuffer = Buffer.from(input);
    const expectedBuffer = Buffer.from(expected);

    if (inputBuffer.length !== expectedBuffer.length) {
        return false;
    }

    return timingSafeEqual(inputBuffer, expectedBuffer);
}

export async function verifyTaskAccess(
    _prevState: TaskAccessState,
    formData: FormData,
): Promise<TaskAccessState> {
    const accessCode = formData.get("accessCode")?.toString().trim() ?? "";
    const expectedCode = process.env.TASK_ACCESS_CODE;

    if (!expectedCode) {
        return {
            status: "error",
            tasks: [],
            message: "Access code is not configured on the server.",
        };
    }

    if (accessCode && isValidAccessCode(accessCode, expectedCode)) {
        return {
            status: "granted",
            tasks: currentTasks,
            message: "Access granted. These tasks are visible only when you unlock them.",
        };
    }

    return {
        status: "denied",
        tasks: [],
        message: "The access code you entered is incorrect.",
    };
}
