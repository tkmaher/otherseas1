import { useRef, useState, useCallback, useEffect } from "react";
import { ImageType } from "@/portfoliotypes";
import { PortfolioMedia } from "./portfolioviewer";

export function ImageSlider({ image1, image2 }: { image1: ImageType; image2: ImageType }) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [handlePos, setHandlePos] = useState(50); // % — matches your SCSS default
  const [fullWidth, setFullWidth] = useState(0);
  const draggingRef = useRef(false);

  // Track the slider's full width so the "top" image can be pinned to it
  // instead of shrinking with its clipped container.
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

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    draggingRef.current = true;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    updateFromClientX(e.clientX);
  }, [updateFromClientX]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    updateFromClientX(e.clientX);
  }, [updateFromClientX]);

  const stopDragging = useCallback(() => {
    draggingRef.current = false;
  }, []);

  return (
    <div
      className="slider"
      ref={sliderRef}
      onPointerMove={onPointerMove}
      onPointerUp={stopDragging}
      onPointerLeave={stopDragging}
    >
      <div
        className="slider-container-handle"
        style={{ width: `${handlePos}%`, touchAction: "none", cursor: "ew-resize" }}
        onPointerDown={onPointerDown}
      />

      <div className="slider-container">
        <PortfolioMedia media={image2} classN="slider-image" />
      </div>

     
      <div className="slider-container" style={{ width: `${handlePos}%` }}>
        <div style={{ width: fullWidth, height: "100%", flexShrink: 0 }}>
          <PortfolioMedia
            media={image1}
            classN="slider-image"
            
          />
        </div>
      </div>
    </div>
  );
}