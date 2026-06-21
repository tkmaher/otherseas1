"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { ItemType } from "@/types";
import Displayer from "./displayer";
import { useLenis } from "lenis/react";
import { useSelectionContext } from "@/contexts/selectionContext";

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

    const { currExpanded, toggleTheme } = useSelectionContext();

    const id = makeId(item.title, item.category);
    const isToggled = currExpanded === id;

    const [isFullyOpen, setIsFullyOpen] = useState(false);

    const rowRef = useRef<HTMLTableRowElement>(null);
    const lenis = useLenis();


    useEffect(() => {
        if (!isToggled) {
            setIsFullyOpen(false);
        }
    }, [isToggled]);

    const handleToggle = () => {
        if (!item.src) return
        if (isToggled) {
            setIsFullyOpen(false);
            toggleTheme("");
        } else {
            toggleTheme(id);
            setTimeout(() => {
                setIsFullyOpen(true);
                lenis?.resize();
                lenis?.scrollTo(`#${id}`, { duration: 0.6, offset: -4 });
            }, 320); 
        }
    };

    const handleTransitionEnd = useCallback(() => {
        lenis?.resize();
    }, [lenis]);

    const handleLinkClick = (e: React.MouseEvent) => e.stopPropagation();

    return (
        <>
            <tr
                className="row"
                id={id}
                ref={rowRef}
                onClick={handleToggle}
            >
                <td colSpan={3}>
                    <div className="row-inner">
                        <div className="row-cell row-title">
                            {item.src && <label>
                                <input
                                    type="checkbox"
                                    checked={isToggled}
                                    readOnly
                                    style={{
                                        backgroundColor: isToggled
                                            ? item.color
                                            : "inherit",
                                    }}
                                />
                            </label>
                            }
                            {item.client ? (
                                <>
                                    <a
                                        href={item.link}
                                        target="_blank"
                                        onClick={handleLinkClick}
                                    >
                                        {item.title}{" "}
                                    </a>
                                    <div className="client">
                                        <a
                                            href={item.clientLink ?? undefined}
                                            onClick={handleLinkClick}
                                            target="_blank"
                                        >
                                            {item.client}
                                        </a>
                                    </div>
                                </>
                            ) : (
                                <a
                                    href={item.link}
                                    onClick={handleLinkClick}
                                    target="_blank"
                                >
                                    {item.title}
                                </a>
                            )}
                        </div>
                        <div className="row-cell row-date">
                            {item.date.slice(0, 4)}
                        </div>
                        <div className="row-cell row-tags">
                            {item.tags?.join(", ")}
                        </div>
                    </div>
                </td>
            </tr>

            <tr
                className={isToggled ? "body-expanded" : "body-collapsed"}
                onTransitionEnd={handleTransitionEnd}
            >
                <td colSpan={3}>
                    <div className="body-inner">
                        <div className="body-description">
                            
                            {item.description && <div
                                dangerouslySetInnerHTML={{ __html: item.description }}
                            />}
                            {item.link && <>
                                    {' '}<a href={item.link} target="_blank">
                                        <img src="linkout.svg"/>
                                    </a>
                                </>
                            }
                        </div>
                        <div className="body-displayer">
                            {(currExpanded && item.src && item.type) &&  <Displayer
                                srcs={item.src}
                                type={item.type}
                                triggered={isFullyOpen}
                                color={item.color}
                            />}
                        </div>
                    </div>
                </td>
            </tr>
        </>
    );
}