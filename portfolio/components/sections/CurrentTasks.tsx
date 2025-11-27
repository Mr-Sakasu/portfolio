"use client";

import { useActionState } from "react";
import { CheckCircle2, Lock, Shield } from "lucide-react";
import { TaskAccessState, verifyTaskAccess } from "@/app/actions";

export type CurrentTasksCopy = {
    title: string;
    description: string;
    privateNotice: string;
    inputPlaceholder: string;
    submitLabel: string;
    successMessage: string;
    errorMessage: string;
    lockedHint: string;
    linkLabel: string;
};

const initialState: TaskAccessState = {
    status: "idle",
    tasks: [],
};

export default function CurrentTasks({ copy }: { copy: CurrentTasksCopy }) {
    const [state, formAction, pending] = useActionState<TaskAccessState, FormData>(
        verifyTaskAccess,
        initialState,
    );

    return (
        <section className="mt-16 text-left max-w-5xl w-full px-4 mx-auto">
            <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
                <Shield size={20} />
                {copy.title}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{copy.description}</p>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white/60 dark:bg-black/30 shadow-sm">
                <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300 mb-3">
                    <Lock size={16} className="mt-0.5" />
                    <span>{copy.privateNotice}</span>
                </div>
                <form action={formAction} className="flex flex-col sm:flex-row gap-3">
                    <input
                        type="password"
                        name="accessCode"
                        placeholder={copy.inputPlaceholder}
                        className="flex-1 rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        autoComplete="off"
                        required
                    />
                    <button
                        type="submit"
                        disabled={pending}
                        className="inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-60"
                    >
                        <Lock size={16} />
                        {pending ? `${copy.submitLabel}...` : copy.submitLabel}
                    </button>
                </form>

                {state.status === "granted" && (
                    <div className="mt-4 space-y-3">
                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                            <CheckCircle2 size={18} />
                            <span>{copy.successMessage}</span>
                        </div>
                        <ul className="space-y-2">
                            {state.tasks.map((task) => (
                                <li
                                    key={task.title}
                                    className="rounded-md border border-gray-200 dark:border-gray-700 p-3 bg-white/40 dark:bg-black/20"
                                >
                                    <div className="font-semibold">{task.title}</div>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">{task.description}</p>
                                    <a
                                        href={task.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline"
                                    >
                                        {copy.linkLabel}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {state.status === "denied" && (
                    <p className="mt-3 text-sm text-red-500">{copy.errorMessage}</p>
                )}

                {state.status === "idle" && (
                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">{copy.lockedHint}</p>
                )}

                {state.status === "error" && state.message && (
                    <p className="mt-3 text-sm text-yellow-600 dark:text-yellow-400">{state.message}</p>
                )}
            </div>
        </section>
    );
}
