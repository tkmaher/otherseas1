export interface PortfolioType {
    items: PortfolioItemType[]
}

export interface PortfolioItemType {
    slug: string,
    title: string,
    date: number,
    link: string,
    stack: StackType[],
    sections: SectionType[],
    bibliography: Citation[],
    cover: string,
}

export interface SectionType {
    header?: string,
    subsections: SubsectionType[]
}

export interface SubsectionType {
    header?: string,
    displayStyle: string,
    description?: string,
    images?: ImageType[]
}

export interface ImageType {
    src: string,
    caption?: string
}

export interface StackType {
    type: string,
    tools: string[]
}

export interface Citation {
    description: string,
    link: string
}