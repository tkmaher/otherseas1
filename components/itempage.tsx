import { ItemType, colors } from "@/types";
import Displayer from "./displayer";
import ReactLenis from "lenis/react";
import { useSelectionContext } from "@/contexts/selectionContext";

export default function ItemPage({ item, onHome }: { item: ItemType; onHome: () => void }) {
    const { currColor, setCurrColor } = useSelectionContext();
    return (
        <>
            <div className="itempage-header">
                <button className="itempage-home-btn" onClick={onHome}>← Home</button>
                <a className="itempage-home-btn" href="/case-studies">Case studies</a>
            </div>

            <ReactLenis root={false} className="itempage-col" options={{ lerp: 0.5 }}>
                <div className="itempage-mainrow">
                    <div className="itempage-date">
                        <div className="itempage-title">{item.title}</div>
                        {item.date.slice(0, -2)}
                        {item.tags && <div>Categories: {item.tags}</div>}
                        From: {item.category}
                        {item.description && <div dangerouslySetInnerHTML={{ __html: item.description }} />}
                    </div>

                    <div className="itempage-desc">
                        {item.src && (item.src[0].includes('iframe') ? 
                            <div className="itempage-iframe" dangerouslySetInnerHTML={{__html: item.src[0]}}/>
                            : <iframe src={item.link} className="itempage-iframe" />)
                        }
                    </div>

                </div>
                <Displayer srcs={item.src ?? []} type="image" />
            </ReactLenis>
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
        </>
    );
}