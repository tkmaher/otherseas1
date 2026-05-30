"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { MotionValue, motion, useMotionValue } from "motion/react";
import { CardType } from "@/types";
import Image from "next/image";

export function Card({ card, zIndex, onX, handleClick, lagY, isTop, isSelected, center }: {
    card: CardType;
    zIndex: number;
    onX: (x: MotionValue<number>) => void;
    handleClick: (src: string) => void;
    lagY: MotionValue<number>;  
    isTop: boolean; 
    isSelected: boolean;
    center?: boolean;
}) {
    const [angle, setAngle] = useState(() => Math.floor(Math.random() * 10 - 5));
    const [offset, setOffset] = useState(() => 
        { 
            return {x: (Math.random() * 25) - 12.5, y: (Math.random() * 50) - 25}
        }
    );
    const [loaded, setLoaded] = useState(!(card.type === "image"));
    const x = useMotionValue(0);

    const iframeRef = useRef<HTMLDivElement>(null);
    useEffect(() => { if (iframeRef.current) iframeRef.current.innerHTML = card.src; }, []),

    onX(x);

    const reRandomize = useCallback(() => {
        setAngle(() => Math.floor(Math.random() * 10 - 5));
        setOffset(() => 
            { 
                return {x: (Math.random() * 25) - 12.5, y: (Math.random() * 50) - 25}
            }
        );
    }, [setAngle, setOffset]);

    const clickTrigger = useCallback(() => {
        reRandomize(); 
        handleClick(card.src);
    }, [reRandomize, handleClick, card]);

    return (
        <motion.div
            className={center ? "card center" : "card"}
            initial={{ top: "-50dvh", rotate: -angle, translateX: offset.x, translateY: offset.y }}
            animate={{ top: loaded ? (center ? "50dvh" : "20dvh") : "-50dvh", rotate: loaded ? angle : -angle, translateX: offset.x, translateY: offset.y }}
            exit={{ top: "140dvh", rotate: -angle }}
            style={{ zIndex, marginRight: x, y: lagY }}  
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
        >
            {card.type == "image" ?
                <Image
                    src={card.src}
                    width={800}
                    height={800}
                    alt={card.src}
                    className="container"
                    onLoad={() => setLoaded(true)}
                    style={{ backgroundColor: card.color }}
                    onClick={clickTrigger}
                /> 
            : card.type == "iframe" &&
                <div 
                    onClick={clickTrigger}
                    ref={iframeRef} 
                    className={isTop ? "container exempt" : "container"} 
                    style={{ backgroundColor: card.color }} 
                />
            }
        </motion.div>
    );
}