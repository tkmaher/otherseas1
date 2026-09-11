import { ItemType } from "@/types";
import Link from "next/link";
import { PortfolioMedia } from "./portfolio/portfoliomedia";

export default function ItemPage({item}: {item: ItemType}) {
    return (
        <div className="itempage-col">
            <div>
                {item.title}
            </div>
            <div className="itempage-mainrow">
                <div className="itempage-date">
                    {item.date.slice(0, -2)}
                </div>
                <div className="itempage-desc">
                    {item.description && <div dangerouslySetInnerHTML={{__html: item.description}}/>}
                </div>
                <div className="itempage-tags">
                    {item.tags && <div>Categories: {item.tags}</div>}
                    From: {item.category}
                </div>
            </div>
            <div>
                {item.src && item.src.map((srcIn, i) => (
                    <PortfolioMedia key={i} media={{src: srcIn}} />
                ))}
            </div>
        </div>
    )
}