"use client";
import { PortfolioItemType } from "@/portfoliotypes";
import PortfolioViewer from "./portfolioviewer";
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
                        {/*item.title*/}
                        <div className="portfolio-subnode-row">
                            {item.sections.map((section, s) => (
                                <Fragment key={s}>
                                    <div className="portfolio-subnode"></div>
                                    {/*section.header*/}
                                </Fragment>
                            ))}
                        </div>
                    </div>
                ))}
                <a href="/">Home</a>
            </div>
            <div className="portfolio-parent" data-lenis-prevent>
                <div className="portfolio-header">
                    <div className="portfolio-title">
                        <div className="date">
                            {items[current].date}
                        </div>
                        <div>
                            {items[current].title}
                        </div>
                    </div>
                    <a href={items[current].link} target="_blank">
                        <img src="/linkout.svg"/>
                    </a>
                </div>
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