"use client";
import { useState } from "react";
import { ItemType } from "@/types";
import Displayer from "./displayer";

export function ListItem({ item }: { item: ItemType; }) {
    const [isToggled, setIsToggled] = useState(false);

    const handleLinkClick = (e: React.MouseEvent) => {
        e.stopPropagation(); 
    };

    return (
        <>
            <tr 
                className="row"
                onClick={() => { 
                    setIsToggled(t => !t);
                }}
            
            >
                <td>
                    <label>
                        <input 
                            type="checkbox" 
                            checked={isToggled} 
                            readOnly 
                            style={{ backgroundColor: isToggled ? item.color : "inherit" }}
                        />
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
            
            <tr className={isToggled ? "body-expanded" : "body-collapsed"}>
                <td><div dangerouslySetInnerHTML={{__html: item.description}}/></td>
                <td/>
                <td>
                    <Displayer srcs={item.src} type={item.type}/>
                </td>
            </tr>
        </>
    );
}