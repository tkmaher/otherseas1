import { Citation, ImageType, PortfolioItemType, SectionType, StackType, SubsectionType } from "@/portfoliotypes";
import Image from "next/image";
import { AutoCarousel } from "./autocarousel";
import { ImageSlider } from "./imageslider";

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
                <video className={classN} autoPlay muted loop playsInline >
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

function PortfolioStack({stack}: {stack: StackType}) {
    return (
        <div>
            <div className="portfolio-stack">
                <div className="portfolio-stack-title">{stack.type}</div>
                {stack.tools.map((tool, index) => (
                    <div key={index} className="portfolio-stack-tool">{tool}</div>
                ))}
            </div>
        </div>
    );
}

function Slider({subsection}: {subsection: SubsectionType}) {
    if (!subsection.images || subsection.images.length < 2) return null;
    return (
        <div className="subsection-row">
            <ImageSlider image1={subsection.images[0]} image2={subsection.images[1]}/>
            {subsection.description && 
                <div className="desc-right" dangerouslySetInnerHTML={{__html: subsection.description}}/>
            }
        </div>
    )
}

function ScrollLeft({subsection}: {subsection: SubsectionType}) {
    if (!subsection.images || subsection.images.length == 0) return null;

    return (
        <div className="subsection-row">
            {subsection.description && 
                <div className="desc-right" dangerouslySetInnerHTML={{__html: subsection.description}}/>
            }
            {subsection.images.length > 0 && 
                <>
                {subsection.images.map((media, i) => (
                    <PortfolioMedia key={media.src ?? i} media={media} classN="portfolio-cover-small" />
                ))}
                </>
            }
        </div>
    );
}

function Row({subsection, index, type}: {subsection: SubsectionType, index: number, type: "left" | "right"}) {
    if (!subsection.images) return null;
    const letter = String.fromCharCode(97 + index);
    return (
        <div className="subsection-row" style={{flexDirection: type == "left" ? "row-reverse" : "row"}}>
            <div className="portfolio-subsection-header">{letter}. {subsection.header}</div>
            <div>
                {subsection.images.map((media, i) => (
                    <PortfolioMedia key={media.src ?? i} media={media} classN="portfolio-normal" />
                ))}
            </div>
            {subsection.description && 
                <div className="desc-right" dangerouslySetInnerHTML={{__html: subsection.description}}/>
            }

        </div>
    );
}

function PortfolioSection({section, index}: {section: SectionType, index: number}) {
    return (
        <div className="portfolio-section">
            {section.header && <div className="portfolio-section-header">
                <div>{index}. {section.header}</div>
                <img src="/section_next.svg"/>
            </div>}
            {section.subsections.map((subsection, i) => (
                <div key={i}>
                    {subsection.displayStyle == "autocarousel" && <AutoCarousel subsection={subsection}/>}
                    {subsection.displayStyle == "slider" && <Slider subsection={subsection}/>}
                    {subsection.displayStyle == "scroll-left" && <ScrollLeft subsection={subsection}/>}
                    {subsection.displayStyle == "row-right" && <Row subsection={subsection} index={i} type="right"/>}
                    {subsection.displayStyle == "row-left" && <Row subsection={subsection} index={i} type="left"/>}

                </div>
            ))}
        </div>
    )
}

function References({bibliography}: {bibliography: Citation[]}) {
    if (!bibliography || bibliography.length == 0) return null;
    return (
        <div>
            <div className="portfolio-stack-title">References</div>
            {bibliography.map((citation, i) => (
                <div key={i} className="portfolio-stack-tool">
                    <>{citation.description} </>
                    <a href={citation.link} target="_blank">{citation.link}</a>
                </div>
            ))}
        </div>
    )
}

export default function PortfolioViewer({item}: {item: PortfolioItemType}) {
    return (
        <div className="portfolio">

            <div className="portfolio-header">
                <div className="portfolio-title">
                    <div>
                        {item.title}
                    </div>
                </div>
                <a href={item.link} target="_blank">
                    <img src="/linkout.svg"/>
                </a>
            </div>
            <div className="date">
                {item.date}
            </div>
            <div className="portfolio-header-title">
                <PortfolioMedia media={{src: item.cover}} classN="portfolio-cover" />
                <div className="portfolio-stats portfolio-row">
                    {item.stack.map((stack, index) => (
                        <PortfolioStack key={index} stack={stack} />
                        ))}
                </div>
            </div>
            <div className="portfolio-sections-column">
                {item.sections.map((section, i) => (
                    <PortfolioSection section={section} key={i} index={i}/>
                ))}
            </div>
            <References bibliography={item.bibliography}/>
        </div>
    )
}