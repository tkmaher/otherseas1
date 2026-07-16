import { ItemType } from "@/types";
import { ListItem } from "./listItem";

export function Table({ data, title }: {
    data: ItemType[];
    title: string;
}) {

    return (
        <table id="list">
            <tbody>
                <tr className="row">
                    <td colSpan={3}>
                        <div className="row-inner">
                            <div className="row-cell row-title">{title}</div>
                            <div className="row-cell row-date" />
                            <div className="row-cell row-tags" />
                        </div>
                    </td>
                </tr>
                {data.map((item, i) =>
                    <ListItem item={item} key={i}/>
                )}
            </tbody>
        </table>
    );
}