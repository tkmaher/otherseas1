import { Citation, PortfolioItemType, SectionType, StackType } from "@/portfoliotypes";
import { PortfolioMedia } from "./portfoliomedia";
import { Subsection } from "./subsectionlayout";

function PortfolioStack({ stack }: { stack: StackType }) {
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

function PortfolioSection({ section, index }: { section: SectionType, index: number }) {
    return (
        <div className="portfolio-section" id={`${section.header ?? "sec"}-${index}`}>
            {section.header && <div className="portfolio-section-header">
                <div>{index}. {section.header}</div>
            </div>}
            {section.subsections.map((subsection, i) => (
                <Subsection key={i} subsection={subsection} index={`${index}.${i + 1}.`} />
            ))}
        </div>
    )
}

function References({ bibliography }: { bibliography: Citation[] }) {
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

export default function PortfolioViewer({ item }: { item: PortfolioItemType }) {
    return (
        <div className="portfolio">
            <div className="portfolio-header-container">
                <div className="portfolio-header">
                    <div className="portfolio-header-row">
                        <div className="portfolio-title">
                            {item.title}
                        </div>
                        <a href={item.link} target="_blank">
                            <img src="/linkout.svg" />
                        </a>
                    </div>
                    <div className="date">
                        {item.date}
                    </div>
                </div>
                <div className="portfolio-header-title">
                    <PortfolioMedia media={{ src: item.cover }} classN="portfolio-cover" />
                    <div className="portfolio-stats portfolio-row">
                        {item.stack.map((stack, index) => (
                            <PortfolioStack key={index} stack={stack} />
                        ))}
                    </div>
                </div>
            </div>
            <div className="portfolio-sections-column">
                {item.sections.map((section, i) => (
                    <PortfolioSection section={section} key={i} index={i} />
                ))}
            </div>
            <References bibliography={item.bibliography} />
        </div>
    )
}