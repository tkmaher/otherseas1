export interface ItemType {
    title: string,
    date: string,
    description?: string,
    link?: string,
    tags?: string[],
    category: string,
    client?: string,
    clientLink?: string,
    color: string,
    type?: string,
    src?: string[]
}

export const colors: string[] = [
    "#61b8e8",
    "#efdd01",
    "#84bc1b",
    "#e87c61",
    "#ae427c",
    "#bca9a2",
    "#816746",
    "#a9aeaf",
    "#171717",
    "#fafafa",
]