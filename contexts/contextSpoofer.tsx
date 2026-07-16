"use client";
import { ReactNode } from "react";
import { SelectionProvider } from "./selectionContext";

export default function ContextSpoofer(data: {data: ReactNode}) {
    return (
        <SelectionProvider>
            {data.data}
        </SelectionProvider>
    );
}