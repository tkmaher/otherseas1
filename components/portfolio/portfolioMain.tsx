"use client";
import { PortfolioItemType } from "@/portfoliotypes";
import PortfolioViewer from "./portfolioviewer";
import { PortfolioMedia } from "./portfoliomedia";
import { colors } from "@/types";
import { SelectionProvider, useSelectionContext } from "@/contexts/selectionContext";
import PortfolioCarousel from "./portfoliocarousel";
import PortfolioSidebar from "./portfoliosidebar";



function PortfolioChild({ items, current }: { items: PortfolioItemType[], current: number }) {

    const { currColor, setCurrColor, currImage } = useSelectionContext();

    const allSrcs = items[current].sections.flatMap(
        section => section.subsections.flatMap(
            subsection => subsection.images && subsection.images.map(
                image => image.srcs
            )
        )
    ).flat();

    return (

        <div className="portfolio-screen">
            <PortfolioSidebar items={items} current={current}/>
            <div id="portfolio-parent" data-lenis-prevent>
                <PortfolioViewer item={items[current]}/>
                
                <div className="portfolio-navbar">
                    <div className="next">
                        {current > 0 && 
                            <a href={`/portfolio/${items[current - 1].slug}`}>
                                <PortfolioMedia media={{src: items[current - 1].cover}} classN="portfolio-navbar-img"/>

                                <div className="desc">Next : {items[current - 1].title}</div>
                            </a>}
                    </div>
                    <div className="prev">
                        {current < items.length - 1 && 
                            <a href={`/portfolio/${items[current + 1].slug}`}>
                                <PortfolioMedia media={{src: items[current + 1].cover}} classN="portfolio-navbar-img"/>
                                <div className="desc">Previous : {items[current + 1].title}</div>
                            </a>
                        }
                    </div>
                    
                </div>
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

            {currImage != '' && <PortfolioCarousel
                srcs={allSrcs}
                type="image"
                triggered={currColor !== "transparent"}
                color={currColor}
            />}

            
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