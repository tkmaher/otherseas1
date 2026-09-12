"use client";

import { useSelectionContext } from "@/contexts/selectionContext";
import { useCallback, useEffect, useRef, useState } from "react";


function LanderImage({ src, index }: { src: string; index: number }) {
    const [visible, setVisible] = useState(false);
    const [loaded, setLoaded] = useState(false);

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
                    maxWidth: loaded ? "20dvw" : 0,
                }}
                ref={(el) => {
                    if (el && el.complete && el.naturalWidth > 0 && !loaded) {
                        setLoaded(true);
                    }
                }}
                onLoad={() => {
                    window.dispatchEvent(new Event("resize"));
                    setLoaded(true);
                }}
                onError={() => setLoaded(true)}
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
    const [collapsePx, setCollapsePx] = useState(0);
    const carouselRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const carousel = carouselRef.current;
        if (!carousel) return;
    
        let frameId: number;
        const SPEED = 0.4; 
        let position = carousel.scrollLeft; 
        let userActive = false;
        let resumeTimeout: ReturnType<typeof setTimeout>;
    
        const pause = () => {
            userActive = true;
            clearTimeout(resumeTimeout);
        };
    
        const resume = () => {
            
            clearTimeout(resumeTimeout);
            resumeTimeout = setTimeout(() => {
                position = carousel.scrollLeft;
                userActive = false;
            }, 200);
        };
    
        carousel.addEventListener("pointerdown", pause);
        carousel.addEventListener("pointerup", resume);
        carousel.addEventListener("pointercancel", resume);
        carousel.addEventListener("touchstart", pause, { passive: true });
        carousel.addEventListener("touchend", resume, { passive: true });
        carousel.addEventListener("wheel", pause, { passive: true });
        carousel.addEventListener("wheel", resume, { passive: true });
    
        const tick = () => {
            const maxScroll = carousel.scrollWidth - carousel.clientWidth;
            if (maxScroll > 0 && !userActive) {
                position = Math.min(maxScroll, position + SPEED);
                carousel.scrollLeft = position;
            }
            frameId = requestAnimationFrame(tick);
        };
    
        frameId = requestAnimationFrame(tick);
        return () => {
            cancelAnimationFrame(frameId);
            clearTimeout(resumeTimeout);
            carousel.removeEventListener("pointerdown", pause);
            carousel.removeEventListener("pointerup", resume);
            carousel.removeEventListener("pointercancel", resume);
            carousel.removeEventListener("touchstart", pause);
            carousel.removeEventListener("touchend", resume);
            carousel.removeEventListener("wheel", pause);
            carousel.removeEventListener("wheel", resume);
        };
       
      }, []);

    const handleLanderClick = () => {
        setCollapsePx(window.innerHeight);
    };


    const { currColor } = useSelectionContext();

    const landerStyle: React.CSSProperties = {
        transformOrigin: "top",
        translate: `0 -${collapsePx}px`,
        backgroundColor: currColor,
        transition: 'translate 1s cubic-bezier(0.76, 0, 0.24, 1)'
    };

    return (
        <>
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