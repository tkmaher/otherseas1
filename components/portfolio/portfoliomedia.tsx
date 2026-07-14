"use client";

import { useSelectionContext } from "@/contexts/selectionContext";
import { ImageType } from "@/portfoliotypes";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export function PortfolioMedia({
    media,
    classN,
    removeBackground
}: {
    media: ImageType,
    classN?: string,
    removeBackground?: boolean
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const mediaRef = useRef<HTMLImageElement | HTMLVideoElement | null>(null);
    const [isInView, setIsInView] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    const isVisible = isInView && isLoaded;

    const { setImage, setCaption } = useSelectionContext();

    // Fade/pop-in trigger, once per element
    useEffect(() => {
        const node = containerRef.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.01, rootMargin: "0px 0px -5% 0px" }
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const el = mediaRef.current;
        if (el instanceof HTMLVideoElement && el.readyState >= 2) {
            setIsLoaded(true);
        }
    }, []);

    const mediaClassName =
        (classN ? classN + " " : "") +
        (isVisible ? "media-in-view" : "media-pre-view");

    const clickCallback = () => {
        setImage(media.src);
        if (media.caption) {
            setCaption(media.caption);
        } else {
            setCaption("");
        }
    };

    return (
        <div
            ref={containerRef}
            className={removeBackground ? "portfolio-media-flex no-bg" : "portfolio-media-flex"}
        >
            {media.src.includes(".mp4") ?
                <video
                    ref={(el) => { mediaRef.current = el; }}
                    className={mediaClassName}
                    autoPlay
                    muted
                    loop
                    playsInline
                    onLoadedData={() => setIsLoaded(true)}
                    onClick={clickCallback}
                >
                    <source src={media.src} type="video/mp4" />
                    Your browser does not
                    support the video tag.
                </video> :
                <Image
                    ref={(el) => { mediaRef.current = el; }}
                    src={media.src}
                    alt="portfolio media"
                    width={3600}
                    height={3600}
                    className={mediaClassName}
                    onLoad={() => setIsLoaded(true)}
                    onClick={clickCallback}
                />
            }
            {media.caption && <div className="portfolio-media-caption" dangerouslySetInnerHTML={{__html: media.caption}}/>}
        </div>
    )
}