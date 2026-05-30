import { ItemType, CardType } from "@/types";
import { ListItem } from "./listItem";
import { useSelectedCards } from "@/contexts/selectedCardsContext";

export function Table({ data, title, onToggle }: {
    data: ItemType[];
    title: string;
    onToggle: (add: boolean, card: CardType | null) => void;
}) {
    const { selectedSrcs } = useSelectedCards();
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
                        onToggle={add => onToggle(add, item.card ?? null)} 
                        highlight={item.card?.src ? selectedSrcs.has(item.card.src) : false}
                    />
                )}
            </tbody>
        </table>
    );
}