"use client";
import PortfolioSidebar from "@/components/portfolio/portfoliosidebar";
import data from "@/data/portfolio-list.json";
import { PortfolioType } from "@/portfoliotypes";
import "@/app/portfolio.scss";
import { PortfolioMedia } from "@/components/portfolio/portfoliomedia";
import { Fragment } from "react/jsx-runtime";
import { colors } from "@/types";
import { useSelectionContext } from "@/contexts/selectionContext";
import ReactLenis from "lenis/react";
import Link from "next/link";

export default function Page() {
    const jsonData = data as PortfolioType;
    console.log(data);
    const { currColor, setCurrColor } = useSelectionContext();

    return (
        <div className="portfolio-screen" style={{backgroundColor: currColor}}
        >
            <PortfolioSidebar items={jsonData.items} />
            <div id="portfolio-parent">
                <div 
                    className="portfolio portfolio-mainpage" 
                    data-lenis-prevent
                >
                    <ReactLenis root options={{lerp: 0.5}}>
                        {jsonData.items.map((item: any, i) => (
                            <Fragment key={item.slug}>
                                <Link key={item.slug} className="portfolio-mainpage-row"  href={`/portfolio/${item.slug}`}>
                                    <PortfolioMedia media={{"src": item.cover}} classN="portfolio-mainpage-image" removeBackground/>
                                    <div className="title">
                                        <div>{item.type}: {item.title}</div>
                                        <div>{item.date}</div>
                                    </div>
                                </Link>
                            </Fragment>
                        ))}
                    </ReactLenis>
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