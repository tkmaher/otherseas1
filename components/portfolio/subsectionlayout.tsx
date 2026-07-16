import { SubsectionType } from "@/portfoliotypes";
import { ImageGroups } from "./imagegroup";
import SubsectionDescription from "./subsectiondescription";

export function Subsection({ subsection, index }: { subsection: SubsectionType, index: string }) {
    const isRowLayout = subsection.displayStyle === "row-right" || subsection.displayStyle === "row-left";

    if (isRowLayout) {
        const flexDirection = subsection.displayStyle === "row-left" ? "row-reverse" : "row";
        return (
            <div className="subsection-row" style={{ flexDirection }}>
                {subsection.header &&
                    <div className="portfolio-subsection-header">{index} {subsection.header}</div>
                }
                <div className="subsection-images">
                    <ImageGroups groups={subsection.images} />
                </div>
                <SubsectionDescription subsection={subsection} />
            </div>
        );
    }

    return (
        <div className="subsection-row no-gap">
            <SubsectionDescription subsection={subsection} />
            <div className="subsection-images">
                <ImageGroups groups={subsection.images} />
            </div>
        </div>
    );
}