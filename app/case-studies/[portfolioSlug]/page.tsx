import { Metadata } from "next";
import data from "@/data/portfolio-list.json";
import { PortfolioType } from "@/portfoliotypes";
import "@/app/portfolio.scss";
import PortfolioMain from "@/components/portfolio/portfolioMain";

export async function generateMetadata(
    { params }: { params: Promise<{ portfolioSlug: string }> }
): Promise<Metadata> {
    const { portfolioSlug } = await params;
    const jsonData = data as PortfolioType;
    console.log(jsonData)
    return {
        title: `Case studies | ${jsonData.items.find((item) => item.slug === portfolioSlug)?.title}` || "Case studies",
    };
}

export default async function Page({
    params,
}: {
    params: Promise<{ portfolioSlug: string }>;
}) {
    const { portfolioSlug } = await params;
    const jsonData = data as PortfolioType;
    const item = jsonData.items.findIndex((item) => item.slug === portfolioSlug);
    if (item == -1) return <div>Portfolio item not found</div>;
    return (
        <PortfolioMain items={jsonData.items} current={item}/>

    );
}