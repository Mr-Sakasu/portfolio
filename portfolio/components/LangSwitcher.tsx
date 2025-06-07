"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

export default function LangSwitcher() {
    const pathname = usePathname();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const changeLocale = (locale: string) => {
        const segments = pathname.split("/").filter(Boolean);
        segments[0] = locale;
        const newPath = "/" + segments.join("/");
        startTransition(() => {
            router.push(newPath);
        });
    };

    return (
        <div className="fixed top-4 left-4 z-50 flex gap-2 bg-zinc-200 dark:bg-zinc-800 p-2 rounded-full text-sm">
            {["en", "ja", "zh"].map((locale) => (
                <button
                    key={locale}
                    onClick={() => changeLocale(locale)}
                    className="px-3 py-1 rounded hover:bg-zinc-300 dark:hover:bg-zinc-700 transition"
                >
                    {locale.toUpperCase()}
                </button>
            ))}
        </div>
    );
}
