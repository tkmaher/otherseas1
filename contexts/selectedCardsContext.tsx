"use client";
import { createContext, useCallback, useContext, useState } from "react";

interface SelectedCardsContextValue {
    selectedSrcs: Set<string>;
    selectCard: (src: string) => void;
    deselectCard: (src: string) => void;
    toggleCard: (src: string) => void;
    isSelected: (src: string) => boolean;
}

const SelectedCardsContext = createContext<SelectedCardsContextValue | null>(null);

export function SelectedCardsProvider({ children }: { children: React.ReactNode }) {
    const [selectedSrcs, setSelectedSrcs] = useState<Set<string>>(new Set());

    const selectCard = useCallback((src: string) => {
        setSelectedSrcs(prev => new Set([...prev, src]));
    }, []);

    const deselectCard = useCallback((src: string) => {
        setSelectedSrcs(prev => {
            const next = new Set(prev);
            next.delete(src);
            return next;
        });
    }, []);

    const toggleCard = useCallback((src: string) => {
        setSelectedSrcs(prev => {
            const next = new Set(prev);
            if (next.has(src)) next.delete(src);
            else next.add(src);
            return next;
        });
    }, []);

    const isSelected = useCallback((src: string) => selectedSrcs.has(src), [selectedSrcs]);

    return (
        <SelectedCardsContext.Provider value={{ selectedSrcs, selectCard, deselectCard, toggleCard, isSelected }}>
            {children}
        </SelectedCardsContext.Provider>
    );
}

export function useSelectedCards() {
    const ctx = useContext(SelectedCardsContext);
    if (!ctx) throw new Error("useSelectedCards must be used inside SelectedCardsProvider");
    return ctx;
}