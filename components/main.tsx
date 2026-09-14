"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ItemType, colors } from "@/types";
import { Table } from "@/components/table";
import { motion } from "motion/react";
import { useSelectionContext } from "@/contexts/selectionContext";
import Lander from "@/components/lander";
import Link from "next/link";
import ReactLenis from "lenis/react";
import ImageGrid from "@/components/imagegrid";
import ItemPage from "@/components/itempage";

const ORDER = ["CV", "Education", "Music", "Writing", "Links", "Appendix"];

export default function Main({ data }: { data: ItemType[] }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const itemName = searchParams.get("item");

    const { categorized, images, itemsByName } = useMemo(() => {
        const categorized: Record<string, ItemType[]> = {};
        data.forEach((item, i) => {
            item.color = colors[i % colors.length];
            if (item.tags) item.tags.sort();
            (categorized[item.category] ??= []).push(item);
        });
        Object.values(categorized).forEach(arr =>
            arr.sort((a, b) => b.date.localeCompare(a.date))
        );
        const images = Object.values(categorized).flat();
        const itemsByName: Record<string, ItemType> = {};
        images.forEach(item => { itemsByName[item.title] = item; });
        return { categorized, images, itemsByName };
    }, [data]);

    const activeItem = itemName ? itemsByName[itemName] ?? null : null;

    const [renderedItem, setRenderedItem] = useState<ItemType | null>(activeItem);

    useEffect(() => {
        if (activeItem) {
            setRenderedItem(activeItem);
        }
    }, [activeItem]);

    // Direct URL loads (including refresh on an item page) shouldn't animate.
    // Client-side param changes (clicking an item, hitting Home, browser back) should.
    const skipAnimation = useRef(true);
    if (skipAnimation.current) {
        queueMicrotask(() => { skipAnimation.current = false; });
    }

    const { currColor, setCurrColor } = useSelectionContext();

    const goToItem = (item: ItemType) => {
        router.push(`${pathname}?item=${encodeURIComponent(item.title)}`, { scroll: false });
    };

    const goHome = () => {
        router.push(pathname, { scroll: false });
    };

    return (
        <div className="main-viewport">
            <motion.div
                className="main-slider"
                animate={{ x: activeItem ? "-50%" : "0%" }}
                transition={{
                    duration: skipAnimation.current ? 0 : 0.8,
                    ease: [0.76, 0, 0.24, 1],
                }}
                onAnimationComplete={() => {
                    if (!activeItem) {
                        setRenderedItem(null);
                    }
                }}
                style={{ backgroundColor: currColor }}
            >
                <div className="main-panel">
                    <ReactLenis root={false} className="home-scroll" options={{ lerp: 0.5 }}>
                        <Lander srcs={images.map(item => item.src?.[0]) as string[]} skip={activeItem != null}>
                            <div className="home-page">
                                <div className="header">
                                    <b>Tom Maher</b> is a freelance web developer and sound artist based in
                                    Chicago, Illinois. His research concerns history, noise, and signification.
                                    He operates the web development studio{" "}
                                    <a href="https://health-and-recreation.com" target="_blank">Health+Recreation</a>.{" "}
                                    <Link href="/case-studies">Case studies</Link>
                                </div>
                                <div className="body-splitter">
                                    <div className="content-left">
                                        <div className="table-scroll" data-lenis-prevent>
                                            <ReactLenis root={false} options={{ lerp: 0.5 }}>
                                                {ORDER.map((name) => (
                                                    <div key={name}>
                                                        {categorized[name] && (
                                                            <Table
                                                                data={categorized[name]}
                                                                title={name}
                                                                onSelectItem={goToItem}
                                                            />
                                                        )}
                                                    </div>
                                                ))}
                                            </ReactLenis>
                                        </div>
                                    </div>
                                    <div className="content-right">
                                        <ImageGrid srcs={images} onSelectItem={goToItem} />
                                    </div>
                                </div>
                                <div className="footer">
                                    {colors.map((val, index) => (
                                        <div
                                            className="color-block"
                                            style={{ backgroundColor: val }}
                                            key={index}
                                            onClick={() => setCurrColor(val)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </Lander>
                    </ReactLenis>
                </div>

                <div className="main-panel">
                    {renderedItem && <ItemPage item={renderedItem} onHome={goHome} />}
                </div>
            </motion.div>
        </div>
    );
}