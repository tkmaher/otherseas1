"use client";
import { PortfolioItemType } from "@/portfoliotypes";
import PortfolioViewer from "./portfolioviewer";
import { PortfolioMedia } from "./portfoliomedia";
import { colors } from "@/types";
import { SelectionProvider, useSelectionContext } from "@/contexts/selectionContext";
import { Fragment } from "react/jsx-runtime";

function PortfolioChild({ items, current }: { items: PortfolioItemType[], current: number }) {

    const { currColor, setCurrColor } = useSelectionContext();

    return (

        <div className="portfolio-screen">
            <div className="portfolio-sidebar">

                {items.map((item, i) => (
                    <div key={i} className="portfolio-node-parent">
                        <div className="portfolio-node"></div>
                        <div className="portfolio-subnode-row">
                            {item.sections.map((section, s) => (
                                <Fragment key={s}>
                                    <div className="portfolio-subnode"></div>
                                </Fragment>
                            ))}
                        </div>
                    </div>
                ))}
                <a href="/">Home</a>
            </div>
            <div className="portfolio-parent" data-lenis-prevent>
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