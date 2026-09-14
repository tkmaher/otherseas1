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
    onSelectItem
}: {
    item: ItemType;
    onSelectItem: (item: ItemType) => void;
}) {
    const makeId = useCallback(
        (title: string, category: string) =>
            `${title}-${category}`.replace(/[^a-zA-Z0-9-_]/g, "-"),
        []
    );

    const id = makeId(item.title, item.category);

    const { currHover, setCurrHover } = useSelectionContext();

    const hoverAction = (toSet: string) => {
        if (item.link)
            setCurrHover(toSet);
    }

    const selectAction = () => {
        if ((item.src == null || item.src.length == 0) && item.link) {
            window.open(item.link, '_blank');
            return;
        }
        if (item.link) {
            onSelectItem(item);
            return;
        }
    }

    const hoverStyle = {
        textDecoration: item.title == currHover ? 'underline' : undefined,
        cursor: item.link ? 'pointer' : "text"
    }

    return (
        <>
            <tr
                className="row"
                id={id}
            >
                <td colSpan={3}>
                    <div className="row-inner">
                        <div 
                            className="row-title"
                            onMouseEnter={() => hoverAction(item.title)}
                            onMouseLeave={() => hoverAction('')}
                            style={hoverStyle}
                            onClick={selectAction}
                        >
                            
                            {item.client ? (
                                <>
                                    <a style={{marginRight: '3px'}}>
                                        {item.title}
                                    </a>
                                    <div className="client">
                                        <a>
                                            {item.client}
                                        </a>
                                    </div>
                                </>
                            ) : (
                                <a
                                    onClick={selectAction}
                                >
                                    {item.title}
                                </a>
                            )}
                            {(item.src == null && item.link) && 
                                <img 
                                    src="linkout.svg"
                                    style={{maxHeight: '1em'}}
                                />
                            }
                        </div>
                        <div className="row-cell row-spacer"/>
                        <div 
                            className="row-cell row-date"
                            onMouseEnter={() => hoverAction(item.title)}
                            onMouseLeave={() => hoverAction('')}
                            style={hoverStyle}
                            onClick={selectAction}
                        >
                            {item.date.slice(0, 4)}
                        </div>
                        
                    </div>
                </td>
            </tr>

            
        </>
    );
}