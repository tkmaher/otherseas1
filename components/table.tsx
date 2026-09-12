import { ItemType } from "@/types";
import { ListItem } from "./listItem";

export function Table({ data, title, onSelectItem }: {
    data: ItemType[];
    title: string;
    onSelectItem: (item: ItemType) => void;
}) {

    return (
        <table id="list">
            <tbody>
                <tr className="row">
                    <td colSpan={3}>
                        <div className="row-inner">
                            <div className="row-cell row-title">{title}</div>
                        </div>
                    </td>
                </tr>
                {data.map((item, i) =>
                    <ListItem item={item} key={i} onSelectItem={onSelectItem}/>
                )}
            </tbody>
        </table>
    );
}