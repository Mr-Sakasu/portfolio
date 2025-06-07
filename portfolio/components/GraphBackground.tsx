"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function VantaBackground() {
    const ref = useRef<HTMLDivElement>(null);
    const [vantaEffect, setVantaEffect] = useState<any>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;

        // 🔑 Vantaより先に globalThis に THREE を設定
        // @ts-ignore
        globalThis.THREE = THREE;

        // ✅ Vanta を動的に import
        import("vanta/dist/vanta.net.min.js").then((VANTA) => {
            if (!vantaEffect && ref.current) {
                const effect = VANTA.default({
                    el: ref.current,
                    mouseControls: true,
                    touchControls: true,
                    minHeight: 200.0,
                    minWidth: 200.0,
                    scale: 1.0,
                    scaleMobile: 1.0,
                    color: 0xffffff,
                    backgroundColor: 0x111111,
                    vertexColors: false,
                });
                setVantaEffect(effect);
            }
        }).catch((err) => {
            console.error("[VANTA] Init error", err);
        });

        return () => {
            vantaEffect?.destroy?.();
        };
    }, [vantaEffect]);

    return <div ref={ref} className="fixed top-0 left-0 w-full h-full -z-10" />;
}
