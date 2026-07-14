import PortfolioSidebar from "@/components/portfolio/portfoliosidebar";
import data from "@/data/portfolio-list.json";
import { PortfolioType } from "@/portfoliotypes";
import "@/app/portfolio.scss";
import { PortfolioMedia } from "@/components/portfolio/portfoliomedia";
import { redirect } from "next/navigation";
import { Fragment } from "react/jsx-runtime";

export default function Page() {
    const jsonData = data as PortfolioType;
    console.log(data);
    return (
        <div className="portfolio-screen">
            <div>
                Selected Projects
            </div>
            <div id="portfolio-parent" data-lenis-prevent>
                <div className="portfolio portfolio-mainpage">
                    {jsonData.items.map((item: any, i) => (
                        <Fragment key={item.slug}>
                            <div key={item.slug} className="portfolio-mainpage-row" >
                                <PortfolioMedia media={{"src": item.cover}} classN="portfolio-mainpage-image" removeBackground/>
                                <a href={`/portfolio/${item.slug}`}>{item.title}</a>
                            </div>
                        </Fragment>
                    ))}
                </div>
            </div>
            <PortfolioSidebar items={jsonData.items} />
        </div>
    );
}