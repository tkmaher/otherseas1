"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

type Direction = "top" | "bottom" | "left" | "right";
const DIRECTIONS: Direction[] = ["top", "bottom", "left", "right"];

function randomDirection(): Direction {
    return DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
}

function getTranslate(dir: Direction): string {
    switch (dir) {
        case "top":    return "translateY(-40px)";
        case "bottom": return "translateY(40px)";
        case "left":   return "translateX(-40px)";
        case "right":  return "translateX(40px)";
    }
}

function MosaicImage({
    src,
    alt,
    index,
    triggered,
    style,
    type
}: {
    src: string;
    alt: string;
    index: number;
    triggered: boolean;
    style?: React.CSSProperties;
    type: string
}) {
    const [visible, setVisible] = useState(false);
    const [dir] = useState<Direction>(() => randomDirection());

    useEffect(() => {
        if (!triggered) {
            setVisible(false);
            return;
        }
        const timer = setTimeout(() => setVisible(true), index * 220);
        return () => clearTimeout(timer);
    }, [triggered, index]);

    return (
        <div style={{ ...style, position: "relative" }}>
            {type == "image" ? <Image
                    src={src}
                    alt={alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{
                        objectFit: "cover",
                        opacity: visible ? 1 : 0,
                        transform: visible ? "translate(0,0)" : getTranslate(dir),
                        transition: "opacity 0.5s ease, transform 0.5s ease",
                    }}
                /> :                 
                <div 
                    dangerouslySetInnerHTML={{ __html: src }} 
                    style={{
                        objectFit: "cover",
                        opacity: visible ? 1 : 0,
                        transform: visible ? "translate(0,0)" : getTranslate(dir),
                        transition: "opacity 0.5s ease, transform 0.5s ease",
                        height: '100%'
                    }}
                /> 
            }
        </div>
    );
}

export default function Displayer({
    srcs,
    type,
    triggered,
}: {
    srcs: string[];
    type: "iframe" | "image";
    triggered: boolean;
}) {
    if (!srcs || srcs.length === 0) return null;
    const count = Math.min(srcs.length, 4);

    const img = (src: string, index: number, style?: React.CSSProperties) => (
        <MosaicImage key={`${src}-${index}`} src={src} alt={type} index={index} triggered={triggered} style={style} type={type}/>
    );

    return (
        <div className="mosaic-displayer" data-count={count}>
                {count === 1 && img(srcs[0], 0, { gridColumn: "1 / -1", gridRow: "1 / -1" })}

                {count === 2 && (<>
                    {img(srcs[0], 0, { gridColumn: "1", gridRow: "1 / -1" })}
                    {img(srcs[1], 1, { gridColumn: "2", gridRow: "1 / -1" })}
                </>)}

                {count === 3 && (<>
                    {img(srcs[0], 0, { gridColumn: "1 / -1", gridRow: "1" })}
                    {img(srcs[1], 1, { gridColumn: "1", gridRow: "2" })}
                    {img(srcs[2], 2, { gridColumn: "2", gridRow: "2" })}
                </>)}

                {count === 4 && (<>
                    {img(srcs[0], 0, { gridColumn: "1 / -1", gridRow: "1" })}
                    {img(srcs[1], 1, { gridColumn: "1", gridRow: "2" })}
                    {img(srcs[2], 2, { gridColumn: "2", gridRow: "2" })}
                    {img(srcs[3], 3, { gridColumn: "3", gridRow: "2" })}
                </>)}
        </div>
    );
}