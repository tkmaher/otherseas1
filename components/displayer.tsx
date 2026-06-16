"use client";
import { useSelectionContext } from "@/contexts/selectionContext";
import Image from "next/image";
import { useEffect, useState } from "react";

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
    
    useEffect(() => {
        if (!triggered) {
            setVisible(false);
            return;
        }
        const timer = setTimeout(() => setVisible(true), index * 220);
        return () => clearTimeout(timer);
    }, [triggered, index]);

    const { currImage, setImage } = useSelectionContext();

    return (
        (currImage == '' || currImage == src) ?
            <div style={{ ...style, position: "relative" }} className={type == "iframe" ? undefined : "mosiac-image"}>
                {type == "image" ? 
                    <Image
                        src={src}
                        alt={alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        style={{
                            objectFit: "cover",
                            opacity: visible ? 1 : 0,
                            transition: "opacity 0.5s ease, transform 0.5s ease",
                        }}
                        onClick={() => setImage(currImage === src ? '' : src)}
                    /> :                 
                    <div 
                        dangerouslySetInnerHTML={{ __html: src }} 
                        style={{
                            objectFit: "cover",
                            opacity: visible ? 1 : 0,
                            transition: "opacity 0.5s ease, transform 0.5s ease",
                            height: '100%'
                        }}
                    /> 
                }
            </div> : <></>
    );
}

export default function Displayer({
    srcs,
    type,
    triggered,
    color
}: {
    srcs: string[];
    type: string;
    triggered: boolean;
    color: string;
}) {
    if (!srcs || srcs.length === 0) return null;
    const count = Math.min(srcs.length, 4);

    const img = (src: string, index: number, style?: React.CSSProperties) => (
        <MosaicImage key={`${src}-${index}`} src={src} alt={type} index={index} triggered={triggered} style={style} type={type}/>
    );

    const { currImage, setImage } = useSelectionContext();
    const isCarousel = currImage != '' && srcs.includes(currImage);

    const nav = (dir: string) => {
        const currentIndex = srcs.indexOf(currImage);
        let nextIndex;
        if (dir === "prev") {
            nextIndex = (currentIndex - 1 + srcs.length) % srcs.length;
        } else {
            nextIndex = (currentIndex + 1) % srcs.length;
        }
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

    return (
        <div 
            className={`mosaic-displayer ${isCarousel && 'mosaic-carousel'}`} 
            data-count={count}
            style={{
                backgroundColor: isCarousel ? undefined : color,
                opacity: triggered ? 1 : 0
            }}
        >
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
                {isCarousel && 
                    <div className="buttons">
                        <button onClick={() => nav('prev')}>
                            Previous
                        </button>
                        <button onClick={() => {
                            setImage('');
                        }}>
                            Close
                        </button>
                        <button onClick={() => nav('next')}>
                            Next
                        </button>
                    </div>
                }
        </div>
    );
}