"use client";
import { useSelectionContext } from "@/contexts/selectionContext";
import { useLenis } from "lenis/react";
import { useEffect, useRef, useState } from "react";

function MosaicImage({
    src,
    alt,
    index,
    triggered,
    type
}: {
    src: string;
    alt: string;
    index: number;
    triggered: boolean;
    type: string;
}) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!triggered) {
            setVisible(false);
            return;
        }
        const timer = setTimeout(() => setVisible(true), index * 220);
        return () => clearTimeout(timer);
    }, [triggered, index]);

    const { currImage, setImage } = useSelectionContext();

    if (currImage !== '' && currImage !== src) return null;

    return (
        <div className={type === "iframe" ? undefined : "mosiac-image "}>
            {type === "image" ? (
                <img
                    src={src}
                    alt={alt}
                    style={{
                        opacity: visible ? 1 : 0,
                        transform: visible ? "translateY(0)" : "translateY(20px)",
                        transition: "opacity 0.5s ease, transform 0.5s ease",
                    }}
                    onClick={() => setImage(src)}
                />
            ) : (
                <div
                    dangerouslySetInnerHTML={{ __html: src }}
                    style={{
                        opacity: visible ? 1 : 0,
                        transform: visible ? "translateY(0)" : "translateY(20px)",
                        transition: "opacity 0.5s ease, transform 0.5s ease",
                        height: '100%'
                    }}
                />
            )}
        </div>
    );
}

const SWIPE_THRESHOLD = 50; // px

export default function Displayer({
    srcs,
    type,
    triggered,
}: {
    srcs: string[];
    type: string;
    triggered: boolean;
    color: string;
}) {
    const { currImage, setImage, currColor } = useSelectionContext();
    const touchStartX = useRef<number | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const lenis = useLenis();

    const isCarousel = !!srcs && srcs.length > 0 && currImage !== '' && srcs.includes(currImage);

    useEffect(() => {
        if (!isCarousel) return;

        lenis?.stop();

        const { body, documentElement: html } = document;
        const prevBodyOverflow = body.style.overflow;
        const prevHtmlOverflow = html.style.overflow;

        body.style.overflow = 'hidden';
        html.style.overflow = 'hidden';

        return () => {
            lenis?.start();
            body.style.overflow = prevBodyOverflow;
            html.style.overflow = prevHtmlOverflow;
        };
    }, [isCarousel, lenis]);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el || isCarousel) return;
    
        const handleWheel = (e: WheelEvent) => {
            const { scrollLeft, scrollWidth, clientWidth } = el;
            const maxScroll = scrollWidth - clientWidth;
            if (maxScroll <= 0) return; 
    
            const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    
            const atStart = scrollLeft <= 0;
            const atEnd = scrollLeft >= maxScroll - 1;
    
            if (delta > 0 && atEnd) return; 
            if (delta < 0 && atStart) return;
    
            e.preventDefault();
            e.stopPropagation();
            el.scrollLeft = Math.min(maxScroll, Math.max(0, scrollLeft + delta));
        };
    
        el.addEventListener("wheel", handleWheel, { passive: false });
        return () => el.removeEventListener("wheel", handleWheel);
    }, [isCarousel]);

    const nav = (dir: string) => {
        const currentIndex = srcs.indexOf(currImage);
        const nextIndex = dir === "prev"
            ? (currentIndex - 1 + srcs.length) % srcs.length
            : (currentIndex + 1) % srcs.length;
        setImage(srcs[nextIndex]);
    };

    useEffect(() => {
        const keyDown = (e: KeyboardEvent) => {
            if (!srcs.includes(currImage)) return;
            if (e.key === 'Escape') setImage('');
            if (e.key === 'ArrowLeft') nav('prev');
            if (e.key === 'ArrowRight') nav('next');
        };

        window.addEventListener('keydown', keyDown);
        return () => window.removeEventListener('keydown', keyDown);
    }, [currImage, srcs]);

    // Lock background scroll while the carousel is open.
    useEffect(() => {
        if (!isCarousel) return;

        const { body, documentElement: html } = document;
        const prevBodyOverflow = body.style.overflow;
        const prevHtmlOverflow = html.style.overflow;

        body.style.overflow = 'hidden';
        html.style.overflow = 'hidden';

        return () => {
            body.style.overflow = prevBodyOverflow;
            html.style.overflow = prevHtmlOverflow;
        };
    }, [isCarousel]);

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

    useEffect(() => {
        const displayer = scrollRef.current;
        if (!displayer) return;

        let frameId: number;
        const SPEED = 0.4; // px per frame

        const tick = () => {
            const maxScroll = displayer.scrollWidth - displayer.clientWidth;
            if (maxScroll > 0) {
                const next = displayer.scrollLeft + SPEED;
                displayer.scrollLeft = next >= maxScroll ? maxScroll : next;
            }
            frameId = requestAnimationFrame(tick);
        };

        //frameId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frameId);
    }, []);

    if (!srcs || srcs.length === 0) return null;

    return (
        <div
            className={`mosaic-displayer ${isCarousel ? 'mosaic-carousel' : ''}`}
            style={{
                opacity: triggered ? 1 : 0,
                backgroundColor: isCarousel ? currColor : undefined,
                touchAction: isCarousel ? 'none' : undefined,
            }}
            onTouchStart={isCarousel ? handleTouchStart : undefined}
            onTouchEnd={isCarousel ? handleTouchEnd : undefined}
            ref={scrollRef}
        >
            {srcs.map((src, i) => (
                <MosaicImage key={`${src}-${i}`} src={src} alt={type} index={i} triggered={triggered} type={type} />
            ))}

            {isCarousel &&
                <div className="buttons">
                    <button onClick={() => nav('prev')}>Previous</button>
                    <button onClick={() => setImage('')}>Close</button>
                    <button onClick={() => nav('next')}>Next</button>
                </div>
            }
        </div>
    );
}