"use client";
import { useSelectionContext } from "@/contexts/selectionContext";
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
        <div className={type === "iframe" ? undefined : "mosiac-image"}>
            {type === "image" ? (
                <img
                    src={src}
                    alt={alt}
                    style={{
                        opacity: visible ? 1 : 0,
                        transition: "opacity 0.5s ease",
                    }}
                    onClick={() => setImage(src)}
                />
            ) : (
                <div
                    dangerouslySetInnerHTML={{ __html: src }}
                    style={{
                        opacity: visible ? 1 : 0,
                        transition: "opacity 0.5s ease",
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

    const isCarousel = !!srcs && srcs.length > 0 && currImage !== '' && srcs.includes(currImage);

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