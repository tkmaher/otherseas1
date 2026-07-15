"use client";
import { PortfolioItemType } from "@/portfoliotypes";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Fragment } from "react/jsx-runtime";
import { colors } from "@/types";
import { usePathname } from "next/navigation";

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

export default function PortfolioSidebar({items, current}: {items: PortfolioItemType[], current?: number}) {
    const path = usePathname();
    return (
        <div className="portfolio-sidebar">

                {items.map((item, i) => (
                    <div key={i} className="portfolio-node-parent">
                        <Link 
                            className="portfolio-node"
                            style={{
                                backgroundColor: ((current != null) && (item.slug === items[current].slug)) ? 
                                    colors[stringToIntHash(item.slug) % colors.length] 
                                    : "transparent"
                            }}
                            href={`/portfolio/${item.slug}/#header`}
                        />
                        <div className="portfolio-subnode-row">
                            {item.sections.map((section, s) => (
                                <Fragment key={s}>
                                    <ColorLink 
                                        parentSlug={item.slug}
                                        inParent={(current != null && (item.slug === items[current].slug))}
                                        sectionPath={`${item.slug}/#${section.header ?? "sec"}-${s}`} 
                                        sectionId={`${section.header ?? "sec"}-${s}`}
                                    />
                                </Fragment>
                            ))}
                        </div>
                    </div>
                ))}
                <div>
                    <a style={{textDecoration: path.split('/').length > 2 ? 'underline' : 'none'
                    }} href="/portfolio">Portfolio</a>{', '} 
                    <a href="/">Home</a>
                </div>
            </div>
    )
}