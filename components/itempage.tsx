import { ItemType } from "@/types";
import Displayer from "./displayer";
import ReactLenis from "lenis/react";

export default function ItemPage({ item, onHome }: { item: ItemType; onHome: () => void }) {
    return (
        <ReactLenis root={false} className="itempage-col" options={{ lerp: 0.5 }}>
            <button className="itempage-home-btn" onClick={onHome}>← Home</button>
            <div className="itempage-title">{item.title}</div>
            <div className="itempage-mainrow">
                <div className="itempage-date">{item.date.slice(0, -2)}</div>
                <div className="itempage-desc">
                    {item.description && <div dangerouslySetInnerHTML={{ __html: item.description }} />}
                </div>
                <div className="itempage-tags">
                    {item.tags && <div>Categories: {item.tags}</div>}
                    From: {item.category}
                </div>
            </div>
            {item.link &&
                <div className="itempage-iframe-container">
                    Desktop
                    <iframe src={item.link} className="itempage-iframe" />
                </div>
            }
            <Displayer srcs={item.src ?? []} type="image" />
        </ReactLenis>
    );
}