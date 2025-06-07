"use client";

import { useEffect, useRef, useState } from "react";
import NET from "vanta/dist/vanta.net.min.js";
import * as THREE from "three";

export default function VantaBackground() {
    const ref = useRef(null);
    const [vantaEffect, setVantaEffect] = useState<any>(null);

    useEffect(() => {
        if (!vantaEffect && ref.current) {
            setVantaEffect(
                NET({
                    el: ref.current,
                    THREE,
                    mouseControls: true,
                    touchControls: true,
                    minHeight: 200.0,
                    minWidth: 200.0,
                    scale: 1.0,
                    scaleMobile: 1.0,
                    color: 0xffffff,
                    backgroundColor: 0x111111,
                })
            );
        }
        return () => {
            if (vantaEffect) vantaEffect.destroy();
        };
    }, [vantaEffect]);

    return <div ref={ref} className="fixed top-0 left-0 w-full h-full -z-10" />;
}
