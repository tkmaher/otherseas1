"use client";
import { useSelectionContext } from "@/contexts/selectionContext";
import { ImageType } from "@/portfoliotypes";
import { useLenis } from "lenis/react";
import { useEffect, useRef, useState } from "react";

function MosaicImage({
    src,
    alt,
    index,
    triggered,
    caption
}: {
    src: string;
    alt: string;
    index: number;
    triggered: boolean;
    caption: string;
}) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!triggered) {
            setVisible(false);
            return;
        }
        const timer = setTimeout(() => setVisible(true), (index - 1) * 220);
        return () => clearTimeout(timer);
    }, [triggered, index]);



    return (
        <div className="mosaic-image">
            {src.includes('.mp4') ? (
                
                <video
                    autoPlay
                    
                    loop
                    playsInline
                    src={src}
                    controls
                    style={{
                        opacity: visible ? 1 : 0,
                        transform: visible ? "translateY(0)" : "translateY(20px)",
                        transition: "opacity 0.5s ease, transform 0.5s ease",
                    }}
                />
            ) : (
                <img
                    src={src}
                    alt={alt}
                    style={{
                        opacity: visible ? 1 : 0,
                        transform: visible ? "translateY(0)" : "translateY(20px)",
                        transition: "opacity 0.5s ease, transform 0.5s ease",
                    }}
                />
            )}
            <div className="mosaic-caption" dangerouslySetInnerHTML={{__html: caption}}/>
                
        </div>
    );
}

const SWIPE_THRESHOLD = 50; // px

export default function PortfolioCarousel({
    srcs,
    type,
    triggered,
}: {
    srcs: (undefined | ImageType)[];
    type: string;
    triggered: boolean;
    color: string;
}) {
    const { currImage, setImage, currColor, currCaption, setCaption } = useSelectionContext();
    const touchStartX = useRef<number | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const nav = (dir: string) => {
        const currentIndex = srcs.indexOf(srcs.find((s: ImageType | undefined) => s && (s.src === currImage)) || srcs[0]);
        const nextIndex = dir === "prev"
            ? (currentIndex - 1 + srcs.length) % srcs.length
            : (currentIndex + 1) % srcs.length;
        const next = srcs[nextIndex];
        if (!next) return;
        setImage(next.src);
        setCaption(next.caption || '');
    };

    useEffect(() => {
        const keyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setImage('');
            if (e.key === 'ArrowLeft') nav('prev');
            if (e.key === 'ArrowRight') nav('next');
        };

        window.addEventListener('keydown', keyDown);
        return () => window.removeEventListener('keydown', keyDown);
    }, [currImage, srcs]);

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null) return;
        const deltaX = e.changedTouches[0].clientX - touchStartX.current;
        touchStartX.current = null;

        if (Math.abs(deltaX) < SWIPE_THRESHOLD) return;
        // Swipe right → previous image, swipe left → next image
        nav(deltaX > 0 ? 'prev' : 'next');
    };

    if (!srcs || srcs.length === 0) return null;

    return (
        <div
            className="mosaic-displayer mosaic-carousel"
            style={{
                opacity: triggered ? 1 : 0,
                backgroundColor: currColor,
                touchAction: 'none',
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            ref={scrollRef}
        >
            <MosaicImage src={currImage} caption={currCaption} alt={type} index={0} triggered={triggered}/>

            <div className="buttons">
                <button onClick={() => nav('prev')} style={{flexGrow: 1}}>Previous</button>
                <button onClick={() => setImage('')}>Close</button>
                <button onClick={() => nav('next')} style={{flexGrow: 1}}>Next</button>
            </div>
        </div>
    );
}