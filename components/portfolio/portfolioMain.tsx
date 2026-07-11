"use client";
import { PortfolioItemType } from "@/portfoliotypes";
import PortfolioViewer from "./portfolioviewer";
import { PortfolioMedia } from "./portfoliomedia";
import { colors } from "@/types";
import { SelectionProvider, useSelectionContext } from "@/contexts/selectionContext";
import { Fragment } from "react/jsx-runtime";
import Link from "next/link";
import { useEffect, useState } from "react";

const stringToIntHash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;   
    }
    return Math.abs(hash);
};

function ColorLink({
    parentSlug, 
    inParent, 
    sectionPath, 
    sectionId
}: {
    parentSlug: string, 
    inParent: boolean, 
    sectionPath: string, 
    sectionId: string
}) {
    const [isIntersecting, setIsIntersecting] = useState(false);

    const getIntersection = (id: string) => {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        const centerEl = document.elementFromPoint(centerX, centerY);

        const parentDiv = document.getElementById(id);

        const isDescendant = parentDiv && parentDiv.contains(centerEl);
        return isDescendant ?? false;
    }

    useEffect(() => {
        const handleScroll = () => {
            setIsIntersecting(getIntersection(sectionId));
        };

        const parent = document.getElementById('portfolio-parent');
        if (!parent) return;

        parent.addEventListener('scroll', handleScroll);
        handleScroll();

        return () => {
            parent.removeEventListener('scroll', handleScroll);
        };
    })

    return (
        <Link 
            style={{
                
                backgroundColor: (inParent && isIntersecting) ? colors[
                    stringToIntHash(sectionId + parentSlug) % colors.length
                ] : "transparent"
            }}
            className="portfolio-subnode" 
            href={`/portfolio/${sectionPath}`}
        />
    )
}

function PortfolioChild({ items, current }: { items: PortfolioItemType[], current: number }) {

    const { currColor, setCurrColor } = useSelectionContext();

    return (

        <div className="portfolio-screen">
            <div className="portfolio-sidebar">

                {items.map((item, i) => (
                    <div key={i} className="portfolio-node-parent">
                        <Link 
                            className="portfolio-node"
                            style={{
                                backgroundColor: item.slug === items[current].slug ? 
                                    colors[stringToIntHash(item.slug) % colors.length] 
                                    : "transparent"
                            }}
                            href={`/portfolio/${item.slug}`}
                        />
                        <div className="portfolio-subnode-row">
                            {item.sections.map((section, s) => (
                                <Fragment key={s}>
                                    <ColorLink 
                                        parentSlug={item.slug}
                                        inParent={item.slug === items[current].slug}
                                        sectionPath={`${item.slug}/#${section.header ?? "sec"}-${s}`} 
                                        sectionId={`${section.header ?? "sec"}-${s}`}
                                    />
                                </Fragment>
                            ))}
                        </div>
                    </div>
                ))}
                <a href="/">Home</a>
            </div>
            <div id="portfolio-parent" data-lenis-prevent>
                <PortfolioViewer item={items[current]}/>
                <div className="footer">
                    {colors.map((val, index) =>
                        <a
                        className="color-block"
                        style={{ backgroundColor: val }}
                        key={index}
                        onClick={() => setCurrColor(val)}
                        />
                        )}
                </div>
                <div className="portfolio-navbar">
                    <div className="prev">
                        {current > 0 && 
                            <a href={`/portfolio/${items[current - 1].slug}`}>
                                <PortfolioMedia media={{src: items[current - 1].cover}} classN="portfolio-navbar-img"/>
                                Previous - {items[current - 1].title}
                            </a>
                        }
                    </div>
                    <div className="next">
                        {current < items.length - 1 && 
                            <a href={`/portfolio/${items[current + 1].slug}`}>
                                <PortfolioMedia media={{src: items[current + 1].cover}} classN="portfolio-navbar-img"/>

                                Next - {items[current + 1].title}
                            </a>}
                    </div>
                </div>
            </div>

            
        </div>
    )
}

export default function PortfolioMain({ items, current }: { items: PortfolioItemType[], current: number }) {

    return (
        <SelectionProvider>

            <PortfolioChild items={items} current={current}/>
        </SelectionProvider>
    )
}