"use client";
import { useRef, useState, useCallback, useEffect } from "react";
import { ImageTypeParent } from "@/portfoliotypes";
import { PortfolioMedia } from "./portfoliomedia";

export function ImageSlider({ group }: { group: ImageTypeParent }) {
    const sliderRef = useRef<HTMLDivElement>(null);
    const [handlePos, setHandlePos] = useState(50);
    const [fullWidth, setFullWidth] = useState(0);
    const draggingRef = useRef(false);

    useEffect(() => {
        const el = sliderRef.current;
        if (!el) return;
        const observer = new ResizeObserver(([entry]) => {
            setFullWidth(entry.contentRect.width);
        });
        observer.observe(el);
        setFullWidth(el.getBoundingClientRect().width);
        return () => observer.disconnect();
    }, []);

    const updateFromClientX = useCallback((clientX: number) => {
        const el = sliderRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const pct = ((clientX - rect.left) / rect.width) * 100;
        setHandlePos(Math.min(100, Math.max(0, pct)));
    }, []);

    const onPointerMove = useCallback((e: PointerEvent) => {
        if (!draggingRef.current) return;
        e.preventDefault();
        updateFromClientX(e.clientX);
    }, [updateFromClientX]);

    const stopDragging = useCallback(() => {
        if (!draggingRef.current) return;
        draggingRef.current = false;
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", stopDragging);
        window.removeEventListener("pointercancel", stopDragging);
    }, [onPointerMove]);

    const onPointerDown = useCallback((e: React.PointerEvent) => {
        e.preventDefault();
        draggingRef.current = true;
        updateFromClientX(e.clientX);
        window.addEventListener("pointermove", onPointerMove, { passive: false });
        window.addEventListener("pointerup", stopDragging);
        window.addEventListener("pointercancel", stopDragging);
    }, [updateFromClientX, onPointerMove, stopDragging]);

    // Safety net: clean up listeners if the component unmounts mid-drag.
    useEffect(() => {
        return () => {
            window.removeEventListener("pointermove", onPointerMove);
            window.removeEventListener("pointerup", stopDragging);
            window.removeEventListener("pointercancel", stopDragging);
        };
    }, [onPointerMove, stopDragging]);

    if (!group.srcs || group.srcs.length < 2) return null;
    const [image1, image2] = group.srcs;

    return (
        <div className="slider" ref={sliderRef} style={{ touchAction: "none" }}>
            <div
                className="slider-container-handle"
                style={{ marginLeft: `${handlePos}%`, touchAction: "none", cursor: "ew-resize" }}
                onPointerDown={onPointerDown}
            >
                <div className="slider-handle" />
            </div>
            <div className="slider-container">
                <PortfolioMedia media={image2} classN="slider-image" />
            </div>
            <div className="slider-container" style={{ width: `${handlePos}%` }}>
                <div style={{ width: fullWidth, height: "100%", flexShrink: 0 }}>
                    <PortfolioMedia media={image1} classN="slider-image" />
                </div>
            </div>
        </div>
    );
}