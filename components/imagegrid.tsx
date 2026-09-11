"use client";
import { useState, useRef, useEffect } from 'react';

export default function ImageGrid({ srcs }: { srcs: string[] }) {
    const ROTATION_DRIFT = 0.01; // magnitude of per-tick idle rotation drift

    const [rotation, setRotation] = useState({ x: 45, z: 90 });
    const [pan, setPan] = useState({ x: 100, y: -100 });
    const [isDragging, setIsDragging] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [zoom, setZoom] = useState(-2500);
    
    const dragStart = useRef({ x: 0, y: 0 });
    const dragStartRotation = useRef({ x: 0, z: -180 }); // baseline captured at mousedown, used only for this drag's delta math
    const currentRotation = useRef({ x: 45, z: 90 });   // always-live rotation; source of truth for drift + next drag's baseline
    const currentPan = useRef({ x: 100, y: -100 });
    const currentZoom = useRef(-2500);
    const dragMode = useRef<'rotate' | 'pan'>('rotate');
    
    // Decided once, on first mount: does drift add to or subtract from rotation?
    const driftSign = useRef<number>(Math.random() < 0.5 ? 1 : -1);
    
    const handleMouseDown = (e) => {
      setIsDragging(true);
      dragMode.current = e.shiftKey ? 'pan' : 'rotate';
      dragStart.current = { x: e.clientX, y: e.clientY };
      dragStartRotation.current = { ...currentRotation.current };
      currentPan.current = { ...pan };
    };
    
    useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
    
        const deltaX = e.clientX - dragStart.current.x;
        const deltaY = e.clientY - dragStart.current.y;
    
        if (dragMode.current === 'pan') {
          setPan({
            x: currentPan.current.x + deltaX,
            y: currentPan.current.y + deltaY
          });
        } else {
          const newRot = {
            x: dragStartRotation.current.x - deltaY * 0.5,
            z: dragStartRotation.current.z - deltaX * 0.5
          };
          setRotation(newRot);
          currentRotation.current = newRot;
        }
      };
    
      const handleMouseUp = () => {
        setIsDragging(false);
      };
    
      if (isDragging) {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
          window.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('mouseup', handleMouseUp);
        };
      }
    
      const intervalRot = setInterval(() => {
        const newRot = {
          x: currentRotation.current.x + driftSign.current * ROTATION_DRIFT,
          z: currentRotation.current.z + driftSign.current * ROTATION_DRIFT
        };
        setRotation(newRot);
        currentRotation.current = newRot;
      }, 1);
    
      return () => clearInterval(intervalRot);
    }, [isDragging]);

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const handleScroll = (e: WheelEvent) => {
            e.preventDefault();
            e.stopPropagation();
            const next = Math.min(Math.max(currentZoom.current - e.deltaY, -5000), 1200);
            currentZoom.current = next;
            setZoom(next);
          };

        el.addEventListener('wheel', handleScroll, { passive: false });
        return () => el.removeEventListener('wheel', handleScroll);
    }, []);

  return (
    <div
        ref={containerRef}
      onMouseDown={handleMouseDown}
      style={{
        cursor: isDragging ? (dragMode.current === 'pan' ? 'move' : 'grabbing') : 'grab',
      }}
      className='grid-canvas'
    >
      <div
        className='grid-parent'
        style={{
          transform: `translate3d(${pan.x}px, ${pan.y}px, ${zoom}px) rotateX(${rotation.x}deg)`,
        }}
      >
        {srcs.map((url, index) => {
          const isHovered = hoveredIndex === index;
          const billboardTransform =
            `rotateZ(${-rotation.z}deg) rotateX(${-rotation.x}deg) translateZ(${isHovered ? 30 : 0}px)`;

          return (
            <div
              key={index}
              style={{
                transform: billboardTransform,               
              }}
              className='image-billboard'
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <img
                src={url}
                alt={`Grid Item ${index + 1}`}
                className='item-billboard'
              />
            </div>
          );
        })}
        <div
            style={{
                fontSize: '12px',
                transform: `rotateZ(${-rotation.z}deg) rotateX(${-rotation.x}deg))`,
                height: 'fit-content'     
            }}
            className='image-billboard'
        >
            <div className='item-billboard'>
                rotX:{rotation.x.toFixed(2)}°rotY:{rotation.z.toFixed(2)}°
                <br/>
                panX:{pan.x}panY:{pan.y}
                <br/>
                zoom:{zoom / 100}
            </div>
        </div>
      </div>
    </div>
  );
}