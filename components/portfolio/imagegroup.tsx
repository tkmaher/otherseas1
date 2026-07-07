import { ImageTypeParent } from "@/portfoliotypes";
import { AutoCarousel } from "./autocarousel";
import { ImageSlider } from "./imageslider";
import { ScrollGallery } from "./scrollgallery";
import { ColumnGallery } from "./columngallery";
import { PortfolioMedia } from "./portfoliomedia";

// Renders a single image group according to its own `type`.
// This is intentionally independent of any subsection `displayStyle`.
export function ImageGroup({ group }: { group: ImageTypeParent }) {
    if (!group?.srcs || group.srcs.length === 0) return null;

    switch (group.type) {
        case "autocarousel":
            return <AutoCarousel group={group} />;
        case "slider":
            return <ImageSlider group={group} />;
        case "scroll-left":
            return <ScrollGallery group={group} />;
        case "column":
            return <ColumnGallery group={group} />;
        default:
            // Unknown type: fall back to a simple stacked list rather than
            // silently dropping the images.
            return (
                <>
                    {group.srcs.map((media, i) => (
                        <PortfolioMedia key={media.src ?? i} media={media} classN="portfolio-normal" />
                    ))}
                </>
            );
    }
}

// Convenience wrapper for rendering all of a subsection's image groups.
export function ImageGroups({ groups }: { groups?: ImageTypeParent[] }) {
    if (!groups || groups.length === 0) return null;
    return (
        <>
            {groups.map((group, i) => <ImageGroup key={i} group={group} />)}
        </>
    );
}