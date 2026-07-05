"use client";
import { SubsectionType } from "@/portfoliotypes";
import { useRef, useEffect } from "react";
import { PortfolioMedia } from "./portfolioviewer";

export function AutoCarousel({ subsection }: { subsection: SubsectionType }) {
    const trackRef = useRef<HTMLDivElement>(null);
    const positionRef = useRef(0);
    const velocityRef = useRef(0);
    const halfWidthRef = useRef(0);
    const lastBurstRef = useRef(0);
    const rafRef = useRef<number>(0);

    const images = subsection.images;

    useEffect(() => {
        if (!images || images.length === 0) return;

        const track = trackRef.current;
        if (!track) return;

        // Width of a single set of images (the track holds two sets back-to-back)
        const measure = () => {
            halfWidthRef.current = track.scrollWidth / 2;
        };
        measure();

        const resizeObserver = new ResizeObserver(measure);
        resizeObserver.observe(track);

        const BASE_SPEED = 0.03;   // px/ms — the "never stops" idle drift
        const BURST_SPEED = 0.32;  // px/ms — speed right after a burst
        const BURST_INTERVAL = 2600; // ms between bursts
        const DECAY = 0.0025;      // higher = burst fades out faster

        velocityRef.current = BASE_SPEED;

        let lastTime = performance.now();
        lastBurstRef.current = lastTime;

        const tick = (now: number) => {
            const dt = now - lastTime;
            lastTime = now;

            if (now - lastBurstRef.current > BURST_INTERVAL) {
                velocityRef.current = BURST_SPEED;
                lastBurstRef.current = now;
            }

            velocityRef.current =
                BASE_SPEED + (velocityRef.current - BASE_SPEED) * Math.exp(-DECAY * dt);

            positionRef.current -= velocityRef.current * dt;

            if (halfWidthRef.current > 0 && positionRef.current <= -halfWidthRef.current) {
                positionRef.current += halfWidthRef.current;
            }

            track.style.transform = `translate3d(${positionRef.current}px, 0, 0)`;

            rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            resizeObserver.disconnect();
        };
    }, [images]);

    if (!images) return null;

    return (
        <div className="subsection-autocarousel-parent">
            <div
                className="subsection-autocarousel"
                onWheel={(e) => e.preventDefault()}
            >
                <div ref={trackRef} className="subsection-autocarousel-track">
                    {images.map((img, i) => (
                        <PortfolioMedia media={img} classN="subsection-autocarousel-image" key={`a-${i}`} />
                    ))}
                    {images.map((img, i) => (
                        <PortfolioMedia media={img} classN="subsection-autocarousel-image" key={`b-${i}`} />
                    ))}
                </div>
            </div>
            {subsection.description && <div className="desc" dangerouslySetInnerHTML={{__html: subsection.description}}>
            </div>}
        </div>
    );
}