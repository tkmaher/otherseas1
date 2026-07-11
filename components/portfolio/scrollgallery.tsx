import { ImageTypeParent } from "@/portfoliotypes";
import { PortfolioMedia } from "./portfoliomedia";

export function ScrollGallery({ group }: { group: ImageTypeParent }) {
    if (!group.srcs || group.srcs.length === 0) return null;
    return (
        <div className="subsection-scrollleft">
            {group.srcs.map((media, i) => (
                <PortfolioMedia key={media.src ?? i} media={media} classN="portfolio-cover-small" />
            ))}
        </div>
    );
}