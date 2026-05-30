"use client";

import { CardType, ItemType } from "@/types";
import { useCallback, useEffect, useState } from "react";
import { colors } from "@/types"
import { ItemStack } from "./itemStack";
import { Table } from "./table";
import { SelectedCardsProvider, useSelectedCards } from "@/contexts/selectedCardsContext";
import { AnimatePresence, motion } from "motion/react";
import { ReactLenis } from 'lenis/react'

function MainInner({ data }: { data: ItemType[] }) {
    const { selectCard, deselectCard } = useSelectedCards();

    const categorized = data.reduce<Record<string, ItemType[]>>((acc, item, i) => {
        if (item.card) item.card.color = colors[i % colors.length];
        if (item.tags) item.tags?.sort();
        (acc[item.category] ??= []).push(item);
        return acc;
    }, {});

    Object.values(categorized).forEach(arr => arr.sort((a, b) => b.date.localeCompare(a.date)));

    const [cardList, setCardList] = useState<CardType[]>([]);
    const [stackOrder, setStackOrder] = useState<string[]>([]);

    const [view, setView] = useState<"scroll" | "table">("scroll");

    // Auto-cycle cards in scroll view
    useEffect(() => {
        if (view !== "scroll") return;
        let num = 0;
        const cvItems = categorized["CV"] ?? [];

        const nextCard = () => {
            num = (num + 1) % cvItems.length;
            let item = cvItems[num];
            let attempts = 0;
            while ((!item.card || !item.card.src) && attempts < cvItems.length) {
                num = (num + 5) % cvItems.length;
                item = cvItems[num];
                attempts++;
            }
            if (item.card) setCardList([item.card]);
        };

        const first = cvItems[0];
        if (first?.card) setCardList([first.card]);

        const id = setInterval(nextCard, 2000);
        return () => clearInterval(id);
    }, [view]);

    const onShift = useCallback((dir: string) => {
        setStackOrder((s) => {
            if (!s.length) return s;
            if (dir === "right") return [...s.slice(1), s[0]];
            if (dir === "left") return [s.at(-1)!, ...s.slice(0, -1)];
            return [dir, ...s.filter(x => x !== dir)];
        });
    }, []);

    const onToggle = useCallback((add: boolean, card: CardType | null) => {
        if (!card) return;
        if (add) {
            setCardList((prev) => [...prev, card]);
            setStackOrder((prev) => [card.src, ...prev]);
            selectCard(card.src);
        } else {
            setCardList((prev) => prev.filter((c) => c.src !== card.src));
            setStackOrder((prev) => prev.filter((s) => s !== card.src));
            deselectCard(card.src);
        }
    }, [selectCard, deselectCard]);

    const onScrollCardClick = useCallback((card: CardType) => {

        selectCard(card.src);

        setCardList((prev) => prev.find(c => c.src === card.src) ? prev : [...prev, card]);
        setStackOrder((prev) => prev.includes(card.src) ? prev : [card.src, ...prev]);

        setView("table");
    }, [selectCard]);

    const onBackgroundClick = useCallback((e: React.MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.className != "bg") return;
        setCardList([]);
        setStackOrder([]);
        setView("table");
    }, [setView])

    const [chosen, setChosen] = useState("#ffffff");

    const order = ["CV", "Education", "Music", "Writing", "Links", "Appendix"];

    return (
        <AnimatePresence mode="wait">
            {view === "scroll" ? (
                <motion.div
                    key="scroll"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    style={{ width: "100dvw", height: "100dvh" }}
                    onClick={onBackgroundClick}
                    className="bg"
                >
                    <ItemStack
                        cards={cardList}
                        stackOrder={stackOrder}
                        onShift={onShift}
                        onScrollCardClick={onScrollCardClick}
                        center
                    />
                </motion.div>
            ) : (
                <ReactLenis root>
                    <motion.div
                        key="table"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        style={{ width: "100%", height: "100%" }}
                    >
                        <div className="content-left" style={{ backgroundColor: chosen }}>
                            <div className="header">
                                <b>Tom Maher</b> is a freelance web developer and sound artist based in Chicago,
                                Illinois. His research concerns history, noise, and signification. His studio is
                                located at{" "}
                                <a href="https://health-and-recreation.com" target="_blank">
                                    health-and-recreation.com
                                </a>.
                            </div>
                            <div className="table-scroll">
                                <ItemStack
                                    cards={cardList}
                                    stackOrder={stackOrder}
                                    onShift={onShift}
                                />
                                {order.map((name) =>
                                    <div key={name}>
                                        {categorized[name] && (
                                            <Table
                                                data={categorized[name]}
                                                title={name}
                                                onToggle={onToggle}
                                            />
                                        )}
                                        <br />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="footer">
                            {colors.map((val, index) =>
                                <a
                                    className="color-block"
                                    style={{ backgroundColor: val }}
                                    key={index}
                                    onClick={() => setChosen(val)}
                                />
                            )}
                        </div>
                    </motion.div>
                </ReactLenis>
            )}
        </AnimatePresence>
    );
}

export default function Main({ data }: { data: ItemType[] }) {
    return (
        <SelectedCardsProvider>
            <MainInner data={data} />
        </SelectedCardsProvider>
    );
}