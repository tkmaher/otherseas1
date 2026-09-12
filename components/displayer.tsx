"use client";
import { useSelectionContext } from "@/contexts/selectionContext";
import { useLenis } from "lenis/react";
import { useEffect, useRef, useState } from "react";

const STAGGER_MS = 60;

function MosaicImage({
    src,
    alt,
    index,
    type,
}: {
    src: string;
    alt: string;
    index: number;
    type: string;
}) {
    const { currImage, setImage } = useSelectionContext();
    const [visible, setVisible] = useState(false);
    const [hovered, setHovered] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.unobserve(el);
                }
            },
            { threshold: 0.15 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    if (currImage !== '' && currImage !== src) return null;

    return (
        <div
            className="mosaic-image"
            ref={ref}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                opacity: visible ? (hovered ? 0.5 : 1) : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
                transition: visible
                    ? "opacity 0.2s ease, transform 0.5s ease"
                    : `opacity 0.5s ease ${index * STAGGER_MS}ms, transform 0.5s ease ${index * STAGGER_MS}ms`,
            }}
        >
            {type === "image" ? (
                <img src={src} alt={alt} onClick={() => setImage(src)} />
            ) : (
                <div
                    dangerouslySetInnerHTML={{ __html: src }}
                    style={{ width: '100%', height: '100%' }}
                />
            )}
        </div>
    );
}

const SWIPE_THRESHOLD = 50; // px

export default function Displayer({
    srcs,
    type,
}: {
    srcs: string[];
    type: string;
}) {
    const { currImage, setImage, currColor } = useSelectionContext();
    const touchStartX = useRef<number | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const lenis = useLenis();

    const isCarousel = !!srcs && srcs.length > 0 && currImage !== '' && srcs.includes(currImage);

    // Lock background scroll and pause Lenis while the carousel is open.
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
            className={`mosaic-displayer ${isCarousel ? 'mosaic-carousel' : ''}`}
            style={{
                backgroundColor: isCarousel ? currColor : undefined,
                touchAction: isCarousel ? 'none' : undefined,
            }}
            onTouchStart={isCarousel ? handleTouchStart : undefined}
            onTouchEnd={isCarousel ? handleTouchEnd : undefined}
            ref={scrollRef}
        >
            {[0, 1, 2].map((col) => (
                <div className="mosaic-col" key={col}>
                    {srcs.map((src, i) => {
                        if (i % 3 !== col) return null;
                        return (
                            <MosaicImage key={`${src}-${i}`} src={src} alt={type} index={i} type={type} />
                        );
                    })}
                </div>
            ))}

            {isCarousel &&
                <div className="buttons">
                    <button onClick={() => nav('prev')} style={{ flexGrow: 1 }}>Previous</button>
                    <button onClick={() => setImage('')}>Close</button>
                    <button onClick={() => nav('next')} style={{ flexGrow: 1 }}>Next</button>
                </div>
            }
        </div>
    );
}