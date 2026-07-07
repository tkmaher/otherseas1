import { ImageTypeParent } from "@/portfoliotypes";
import { PortfolioMedia } from "./portfoliomedia";

// Simple vertical stack of full-width images (uses the existing,
// previously-unused `.subsection-rowstack` SCSS rule).
export function ColumnGallery({ group }: { group: ImageTypeParent }) {
    if (!group.srcs || group.srcs.length === 0) return null;
    return (
        <div className="subsection-rowstack">
            {group.srcs.map((media, i) => (
                <PortfolioMedia key={media.src ?? i} media={media} classN="portfolio-normal" />
            ))}
        </div>
    );
}