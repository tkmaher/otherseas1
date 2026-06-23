"use client";
import data from "@/data/items.json";
import Main from "@/components/main";
import { SelectionProvider } from "@/contexts/selectionContext";

export default function Home() {

  return (
    <SelectionProvider>
      <Main data={data}/>
    </SelectionProvider>
  );
}
