"use client";

import { useSelectionContext } from "@/contexts/selectionContext";
import { useEffect, useRef, useState } from "react";

function LanderImage({
    src,
    index,
}: {
    src: string;
    index: number;
}) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), index * 220);
        return () => clearTimeout(timer);
    }, [index]);

    return (
        <div>
            <img
                src={src}
                style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(20px)",
                    transition: "opacity 0.5s ease, transform 0.5s ease",
                }}
            />
        </div>
    );
}

export default function Lander({
    srcs,
    children,
}: {
    srcs: string[];
    children?: React.ReactNode;
}) {
    const [collapsePercent, setCollapsePercent] = useState(0);
    const carouselRef = useRef<HTMLDivElement>(null);
    const tickingRef = useRef(false);

    useEffect(() => {
        const handleScroll = () => {
            if (tickingRef.current) return;
            tickingRef.current = true;
            requestAnimationFrame(() => {
                const spacerHeight = window.innerHeight;
                const percent =
                    spacerHeight > 0
                        ? Math.min(100, Math.max(0, (window.scrollY / spacerHeight) * 100))
                        : 0;
                setCollapsePercent(percent);
                tickingRef.current = false;
            });
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Slowly auto-scroll the carousel to the right, looping seamlessly.
    useEffect(() => {
        const carousel = carouselRef.current;
        if (!carousel) return;

        let frameId: number;
        const SPEED = 0.4; // px per frame

        const tick = () => {
            const maxScroll = carousel.scrollWidth - carousel.clientWidth;
            if (maxScroll > 0) {
                const next = carousel.scrollLeft + SPEED;
                carousel.scrollLeft = next >= maxScroll ? maxScroll : next;
            }
            frameId = requestAnimationFrame(tick);
        };

        frameId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frameId);
    }, []);


    const handleLanderClick = () => {
        window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
    };

    const isFullyCollapsed = collapsePercent >= 100;

    const { currColor } = useSelectionContext();

    const landerStyle: React.CSSProperties = {
        clipPath: `inset(0 0 ${collapsePercent}% 0)`,
        pointerEvents: isFullyCollapsed ? "none" : "auto",
        transformOrigin: "top",
        translate: `0 -${collapsePercent}px`,
        backgroundColor: currColor
    };

    return (
        <>

            <div className="lander-spacer" aria-hidden="true" 
                style={{        
                    backgroundColor: currColor
                }}
            />


            <div
                className="lander"
                style={landerStyle}
                onClick={handleLanderClick}
            >
                <div className="lander-top" ref={carouselRef}>
                    {srcs.map((src, i) => (
                        <LanderImage key={`${src}-${i}`} src={src} index={i} />
                    ))}
                </div>
                <div className="lander-bottom">
                    <div>https://otherseas1.com</div>
                    <a>Enter</a>
                </div>
            </div>

            {children}
        </>
    );
}