import { ImageType } from "@/portfoliotypes";
import Image from "next/image";

export function PortfolioMedia({
    media,
    classN,
    removeBackground
}: {
    media: ImageType,
    classN?: string,
    removeBackground?: boolean
}) {
    return (
        <div className={removeBackground ? "portfolio-media-flex no-bg" : "portfolio-media-flex"}>
            {media.src.includes(".mp4") ?
                <video className={classN} autoPlay muted loop playsInline>
                    <source src={media.src} type="video/mp4" />
                    Your browser does not
                    support the video tag.
                </video> :
                <Image src={media.src} alt="portfolio media" width={3600} height={3600} className={classN} />
            }
            <div className="portfolio-media-caption">{media.caption}</div>
        </div>
    )
}