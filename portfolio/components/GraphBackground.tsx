// components/GraphBackground.tsx
"use client";

import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { useCallback } from "react";

export default function GraphBackground() {
    const particlesInit = useCallback(async (engine: any) => {
        await loadSlim(engine);
    }, []);

    return (
        <Particles
            id="tsparticles"
            init={particlesInit}
            options={{
                fullScreen: { enable: true, zIndex: -1 },
                background: { color: { value: "transparent" } },
                particles: {
                    number: { value: 60 },
                    color: { value: "#999" },
                    links: {
                        enable: true,
                        distance: 120,
                        color: "#999",
                        opacity: 0.3,
                        width: 1,
                    },
                    move: {
                        enable: true,
                        speed: 1,
                        random: true,
                        outModes: "out",
                    },
                    size: { value: 2 },
                    opacity: { value: 0.5 },
                },
            }}
        />
    );
}
