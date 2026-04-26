"use client";

import { CardType, ItemType } from "@/types";
import Image from "next/image";
import { Key, useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, MotionValue, animate, motion, useMotionValue, useSpring } from "motion/react";
import { colors } from "@/types"
import { useLenis } from "lenis/react";

function Card({ card, zIndex, onX, handleClick, lagY, isTop }: {
    card: CardType;
    zIndex: number;
    onX: (x: MotionValue<number>) => void;
    handleClick: (src: string) => void;
    lagY: MotionValue<number>;  
    isTop: boolean; 
}) {
    const [angle, setAngle] = useState(() => Math.floor(Math.random() * 30 - 15));
    const [offset, setOffset] = useState(() => 
        { 
            return {x: (Math.random() * 50) - 25, y: (Math.random() * 75) - 50}
        }
    );
    const [loaded, setLoaded] = useState(!(card.type === "image"));
    const x = useMotionValue(0);

    const iframeRef = useRef<HTMLDivElement>(null);
    useEffect(() => { if (iframeRef.current) iframeRef.current.innerHTML = card.src; }, []),

    onX(x);

    const reRandomize = useCallback(() => {
        setAngle(() => Math.floor(Math.random() * 30 - 15));
        setOffset(() => 
            { 
                return {x: (Math.random() * 50) - 25, y: (Math.random() * 50) - 25}
            }
        );
    }, [setAngle, setOffset]);

    const clickTrigger = useCallback(() => {
        reRandomize(); 
        handleClick(card.src);
    }, [reRandomize, handleClick, card]);

    return (
        <motion.div
            className="card"
            initial={{ top: "-50dvh", rotate: -angle, translateX: offset.x, translateY: offset.y }}
            animate={{ top: loaded ? "22dvh" : "-50dvh", rotate: loaded ? angle : -angle, translateX: offset.x, translateY: offset.y }}
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

function ItemStack({ cards, stackOrder, onShift }: {
    cards: CardType[];
    stackOrder: string[];
    onShift: (dir: string) => void;
}) {
    const xs = useRef<Record<string, MotionValue<number>>>({});
    const busy = useRef(false);
    const n = stackOrder.length;

    const rawY = useMotionValue(0);
    const lagY = useSpring(rawY, { stiffness: 90, damping: 22, mass: 0.8 });

    useLenis(({ velocity }) => {
        rawY.set(-velocity * 5);
    });

    const handleClick = (src: string) => { onShift(src); };

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

function ListItem({ item, onToggle }: { item: ItemType; onToggle: (add: boolean) => void; }) {
    const [isToggled, setIsToggled] = useState(false);

    const handleLinkClick = (e: React.MouseEvent) => {
        e.stopPropagation(); 
    };

    return (
        <tr 
            className="row" 
            onClick={() => { 
                setIsToggled(t => !t); onToggle(!isToggled); 
            }}
        >
            <td>
                <label>
                    {item.card && <input 
                        type="checkbox" 
                        checked={isToggled} 
                        readOnly 
                        style={{ backgroundColor: isToggled ? item.card.color : "inherit" }}
                    />}
                </label>
                {item.client
                    ? <>
                        <a href={item.link} target="_blank" onClick={handleLinkClick}>{item.title} </a>
                        <div className="client">
                            <a href={item.clientLink ?? undefined} onClick={handleLinkClick} target="_blank">{item.client}</a>
                        </div>
                    </>
                    : <a href={item.link} onClick={handleLinkClick} target="_blank">{item.title}</a>
                }
            </td>
            <td className="date">{item.date.slice(0,4)}</td>
            <td className="tags">
                {item.tags && item.tags.join(", ")}
            </td>
        </tr>
    );
}

function Table({ data, title, onToggle }: {
    data: ItemType[];
    title: string;
    onToggle: (add: boolean, card: CardType | null) => void;
}) {
    return (
        <table id="list">
            <colgroup>
                <col style={{ width: "50%" }} />
                <col style={{ width: "10%" }} />
                <col style={{ width: "40%" }} />
            </colgroup>
            <tbody>
                <tr className="row"><td>{title}</td><td/><td/></tr>
                {data.map((item, i) =>
                    <ListItem 
                        item={item} 
                        key={i} 
                        onToggle={add => onToggle(add, item.card ?? null)} 
                    />
                )}
            </tbody>
        </table>
    );
}

export default function Main({ data }: { data: ItemType[] }) {
    const categorized = data.reduce<Record<string, ItemType[]>>((acc, item, i) => {
        if (item.card) item.card.color = colors[i%colors.length];
        if (item.tags) item.tags?.sort();
        (acc[item.category] ??= []).push(item);
        return acc;
    }, {});
    
    Object.values(categorized).forEach(arr => arr.sort((a, b) => b.date.localeCompare(a.date)));

    const [cardList, setCardList] = useState<CardType[]>([]);
    const [stackOrder, setStackOrder] = useState<string[]>([]);

    const onShift = useCallback((dir: string) => {
        setStackOrder((s) => {
            if (!s.length) return s;
            if (dir === "right") return [...s.slice(1), s[0]];
            if (dir === "left")  return [s.at(-1)!, ...s.slice(0, -1)];
            return [dir, ...s.filter(x => x !== dir)];
        });
    }, []);

    const onToggle = useCallback((add: boolean, card: CardType | null) => {
        if (!card) return;
        if (add) {
            setCardList((prev) => [...prev, card]);
            setStackOrder((prev) => [card.src, ...prev]);
        } else {
            setCardList((prev) => prev.filter((c) => c.src !== card.src));
            setStackOrder((prev) => prev.filter((s) => s !== card.src));
        }
    }, []);

    const [chosen, setChosen] = useState("#ffffff");

    const order = ["CV", "Education", "Music", "Writing", "Links", "Appendix"];

    return (
        <>
            <div className="content-left" style={{backgroundColor: chosen}}>
                <div className="header"><b>Tom Maher</b> is a freelance web developer and sound artist based in Chicago, Illinois. His research concerns history, noise, and signification. His studio is located at <a href="https://health-and-recreation.com" target="_blank">health-and-recreation.com</a>.</div>
                <div className="table-scroll">
                    <ItemStack cards={cardList} stackOrder={stackOrder} onShift={onShift} />
                    {order.map((name) => 
                        <div key={name}>
                            {categorized[name] && <Table data={categorized[name]} title={name} onToggle={onToggle} />}
                            <br/>
                        </div>
                    )}
                </div>
                
            </div>
            <div className="footer">
                {colors.map((val, index) => 
                    <a className="color-block" style={{backgroundColor: val}} key={index} onClick={() => setChosen(val)}/>
                )}
            </div>
        </>
    );
}