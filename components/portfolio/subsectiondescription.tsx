"use client";
import { useEffect, useRef, useState } from "react";
import { SubsectionType } from "@/portfoliotypes";


export default function SubsectionDescription({ subsection }: { subsection: SubsectionType }) {
    if (!subsection.description) return null;

    const containerRef = useRef<HTMLDivElement>(null);
    const [isInView, setIsInView] = useState(false);


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
    
    const style = {
        opacity: isInView ? 1 : 0,
        transform: isInView ? "translateY(0)" : "translateY(50px)",
    }

    return (
        <div className="desc-right" ref={containerRef} style={style}>   
            {subsection.description.map((desc, i) => 
                <div key={i} dangerouslySetInnerHTML={{ __html: desc }} />
            )}
        </div>
    );
}