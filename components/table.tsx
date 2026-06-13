import { ItemType } from "@/types";
import { ListItem } from "./listItem";

export function Table({ data, title }: {
    data: ItemType[];
    title: string;
}) {
    return (
        <table id="list">
            <colgroup>
                <col style={{ width: "50%" }} />
                <col style={{ width: "10%" }} />
                <col style={{ width: "40%" }} />
            </colgroup>
            <tbody>
                <tr className="row"><td>{title}</td><td/><td/></tr>
                {data.map((item, i) =>
                    <ListItem 
                        item={item} 
                        key={i} 
                    />
                )}
            </tbody>
        </table>
    );
}