"use client";
import { useState } from "react";
import { ItemType } from "@/types";

export function ListItem({ item, onToggle, highlight }: { item: ItemType; onToggle: (add: boolean) => void; highlight: boolean }) {
    const [isToggled, setIsToggled] = useState(highlight ?? false);

    const handleLinkClick = (e: React.MouseEvent) => {
        e.stopPropagation(); 
    };

    return (
        <tr 
            className={highlight ? "row highlight" : "row"} 
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