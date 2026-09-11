"use client";
import { useCallback } from "react";
import { ItemType } from "@/types";
import { useSelectionContext } from "@/contexts/selectionContext";

const MOBILE_QUERY = "(max-width: 800px)";

function isMobileViewport() {
    return typeof window !== "undefined" && window.matchMedia(MOBILE_QUERY).matches;
}

export function ListItem({
    item,
}: {
    item: ItemType;
}) {
    const makeId = useCallback(
        (title: string, category: string) =>
            `${title}-${category}`.replace(/[^a-zA-Z0-9-_]/g, "-"),
        []
    );

    const id = makeId(item.title, item.category);

    const { currHover, setCurrHover } = useSelectionContext();

    return (
        <>
            <tr
                className="row"
                id={id}
            >
                <td colSpan={3}>
                    <div className="row-inner">
                        <div 
                            className="row-cell row-title row-title-item"
                            onMouseEnter={() => setCurrHover(item.title)}
                            onMouseLeave={() => setCurrHover('')}
                            style={{
                                textDecoration: item.title == currHover ? 'underline' : undefined
                            }}
                        >
                            
                            {item.client ? (
                                <>
                                    <a
                                        href={item.link}
                                        target="_blank"
                                        
                                    >
                                        {item.title}{" "}
                                    </a>
                                    <div className="client">
                                        <a
                                            href={item.clientLink ?? undefined}
                                            target="_blank"
                                        >
                                            {item.client}
                                        </a>
                                    </div>
                                </>
                            ) : (
                                <a
                                    href={item.link}
                                    target="_blank"
                                    
                                >
                                    {item.title}
                                </a>
                            )}
                        </div>
                        <div className="row-cell row-spacer"/>
                        <div 
                            className="row-cell row-date"
                            onMouseEnter={() => setCurrHover(item.title)}
                            onMouseLeave={() => setCurrHover('')}
                            style={{
                                textDecoration: item.title == currHover ? 'underline' : undefined
                            }}
                        >
                            {item.date.slice(0, 4)}
                        </div>
                        
                    </div>
                </td>
            </tr>

            
        </>
    );
}