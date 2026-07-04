"use client";
import { useRef, useEffect } from "react";
import { PortfolioItemType, SectionType, StackType, SubsectionType } from "@/portfoliotypes";
import Image from "next/image";

function PortfolioMedia({src, classN}: {src: string, classN: string}) {
    if (src.includes(".mp4")) {
        return (
            <video className={classN} autoPlay muted loop playsInline >
                <source src={src} type="video/mp4" />
                Your browser does not
                support the video tag.
            </video>
        )
    }
    return (
        <Image src={src} alt="portfolio media" width={3600} height={3600} className={classN} />
    )
}

function PortfolioStack({stack}: {stack: StackType}) {
    return (
        <div>
            <div className="portfolio-stack">
                <div className="portfolio-stack-title">{stack.type}</div>
                {stack.tools.map((tool, index) => (
                    <div key={index} className="portfolio-stack-tool">{tool}</div>
                ))}
            </div>
        </div>
    );
}


function AutoCarousel({ subsection }: { subsection: SubsectionType }) {
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
                        <PortfolioMedia src={img.src} classN="subsection-autocarousel-image" key={`a-${i}`} />
                    ))}
                    {images.map((img, i) => (
                        <PortfolioMedia src={img.src} classN="subsection-autocarousel-image" key={`b-${i}`} />
                    ))}
                </div>
            </div>
            {subsection.description && <div className="desc">
                {subsection.description}
            </div>}
        </div>
    );
}

function PortfolioSection({section}: {section: SectionType}) {
    return (
        <div className="portfolio-section">
            {section.subsections.map((subsection, i) => (
                <div key={i}>
                    {subsection.displayStyle == "autocarousel" && <AutoCarousel subsection={subsection}/>}
                </div>
            ))}
        </div>
    )
}

export default function PortfolioViewer({item}: {item: PortfolioItemType}) {
    return (
        <div className="portfolio ">
            <div className=" portfolio-header-title">
                
                <PortfolioMedia src={item.cover} classN="portfolio-cover" />
                <div className="portfolio-stats portfolio-row">
                    {item.stack.map((stack, index) => (
                        <PortfolioStack key={index} stack={stack} />
                        ))}
                </div>
            </div>
            <div className="portfolio-sections-column">
                {item.sections.map((section, i) => (
                    <PortfolioSection section={section} key={i}/>
                ))}
            </div>
        </div>
    )
}