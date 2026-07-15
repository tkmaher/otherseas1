"use client";
import PortfolioSidebar from "@/components/portfolio/portfoliosidebar";
import data from "@/data/portfolio-list.json";
import { PortfolioType } from "@/portfoliotypes";
import "@/app/portfolio.scss";
import { PortfolioMedia } from "@/components/portfolio/portfoliomedia";
import { Fragment } from "react/jsx-runtime";
import { colors } from "@/types";
import { useSelectionContext } from "@/contexts/selectionContext";

export default function Page() {
    const jsonData = data as PortfolioType;
    console.log(data);
    const { currColor, setCurrColor, currImage } = useSelectionContext();

    return (
        <div className="portfolio-screen">
            <PortfolioSidebar items={jsonData.items} />
            <div id="portfolio-parent" data-lenis-prevent>
                <div className="portfolio portfolio-mainpage">
                    {jsonData.items.map((item: any, i) => (
                        <Fragment key={item.slug}>
                            <a key={item.slug} className="portfolio-mainpage-row"  href={`/portfolio/${item.slug}`}>
                                <PortfolioMedia media={{"src": item.cover}} classN="portfolio-mainpage-image" removeBackground/>
                                <div className="title">
                                    <div>{item.type}: {item.title}</div>
                                    <div>{item.date}</div>
                                </div>
                            </a>
                        </Fragment>
                    ))}
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
    );
}