"use client";
import { useRef } from "react";
import { AnimatePresence, MotionValue, animate, motion, useMotionValue, useSpring } from "motion/react";
import { CardType } from "@/types";
import { Card } from "./card";
import { useLenis } from "lenis/react";
import { useSelectedCards } from "@/contexts/selectedCardsContext";

export function ItemStack({ cards, stackOrder, onShift, onScrollCardClick, center }: {
    cards: CardType[];
    stackOrder: string[];
    onShift: (dir: string) => void;
    /** If provided, clicking a card calls this instead of onShift (used in scroll view) */
    onScrollCardClick?: (card: CardType) => void;
    center?: boolean
}) {
    const xs = useRef<Record<string, MotionValue<number>>>({});
    const busy = useRef(false);
    const n = stackOrder.length;
    const { isSelected } = useSelectedCards();

    const rawY = useMotionValue(0);
    const lagY = useSpring(rawY, { stiffness: 90, damping: 22, mass: 0.8 });

    useLenis(({ velocity }) => {
        rawY.set(-velocity * 5);
    });

    const handleClick = (src: string) => {
        if (onScrollCardClick) {
            const card = cards.find(c => c.src === src);
            if (card) onScrollCardClick(card);
        } else {
            onShift(src);
        }
    };

    const go = async (delta: 1 | -1) => {
        if (n <= 1 || busy.current) return;
        busy.current = true;

        if (delta === 1) {
            const src = stackOrder[0];
            await animate(xs.current[src], 500, { duration: 0.15, ease: "easeIn" });
            onShift("right");
            await animate(xs.current[src], 0, { duration: 0.25, ease: "easeOut" });
        } else {
            const src = stackOrder[n - 1];
            await animate(xs.current[src], -500, { duration: 0.15, ease: "easeIn" });
            onShift("left");
            await animate(xs.current[src], 0, { duration: 0.25, ease: "easeOut" });
        }

        busy.current = false;
    };

    return (
        <div className="content-right">
            <AnimatePresence>
                {cards.map((card) => (
                    <Card
                        card={card}
                        key={card.src}
                        zIndex={n - stackOrder.indexOf(card.src)}
                        onX={(x) => { xs.current[card.src] = x; }}
                        handleClick={handleClick}
                        lagY={lagY}
                        isTop={n - stackOrder.indexOf(card.src) === n}
                        isSelected={isSelected(card.src)}
                        center={center}
                    />
                ))}
            </AnimatePresence>
            {n > 1 && (
                <AnimatePresence>
                    <motion.div
                        className="selector"
                        style={{ y: lagY, x: "50%" }}
                        initial={{ bottom: "-50dvh" }}
                        animate={{ bottom: "10dvh" }}
                    >
                        <a onClick={() => go(-1)}><img src="left.svg" /></a>
                        <a onClick={() => go(1)}><img src="right.svg" /></a>
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
    );
}