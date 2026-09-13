"use client";
import { useSelectionContext } from '@/contexts/selectionContext';
import { ItemType } from '@/types';
import { useState, useRef, useEffect } from 'react';

export default function ImageGrid({ srcs, onSelectItem }: { srcs: ItemType[], onSelectItem: (item: ItemType) => void; }) {
    const { currHover, setCurrHover } = useSelectionContext();

    const ROTATION_DRIFT = 0.05;

    const [rotation, setRotation] = useState({ x: 45, z: 90 });
    const [pan, setPan] = useState({ x: 100, y: -100 });
    const [isDragging, setIsDragging] = useState(false);
    const [zoom, setZoom] = useState(-2500);

    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [tooltipText, setTooltipText] = useState<null | string>(null);
    
    const dragStart = useRef({ x: 0, y: 0 });
    const dragStartRotation = useRef({ x: 0, z: -180 }); 
    const currentRotation = useRef({ x: 45, z: 90 });
    const currentPan = useRef({ x: 100, y: -100 });
    const currentZoom = useRef(-2500);
    const dragMode = useRef<'rotate' | 'pan'>('rotate');
    
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
    
      
      let rafId: number;
      const tick = () => {
        const newRot = {
          x: currentRotation.current.x + driftSign.current * ROTATION_DRIFT,
          z: currentRotation.current.z + driftSign.current * ROTATION_DRIFT
        };
        setRotation(newRot);
        currentRotation.current = newRot;
        rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);

      return () => cancelAnimationFrame(rafId);
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

        const handleMove = (e: MouseEvent) => {
          setMousePos({x: e.clientX, y: e.clientY});
        }

        el.addEventListener('wheel', handleScroll, { passive: false });
        el.addEventListener('mousemove', handleMove);
        return () => {
          el.removeEventListener('wheel', handleScroll);
          el.removeEventListener('mousemove', handleMove);
        }
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
        className='tooltip'
        style={{
          top: mousePos.y,
          left: mousePos.x
        }}
      >
        {tooltipText}
      </div>
      <div
        className='grid-parent'
        style={{
          transform: `translate3d(${pan.x}px, ${pan.y}px, ${zoom}px) rotateX(${rotation.x}deg) rotateZ(${rotation.z}deg)`,
        }}
      >
        {srcs.map((url, index) => {
          
          const billboardTransform =
            `rotateZ(${-rotation.z}deg) rotateX(${-rotation.x}deg)`;

          return (
            url.src && <div
              key={index}
              style={{
                transform: billboardTransform,  
                opacity: (currHover == url.title) ? '0.5' : 1         
              }}
              
            >
              <img
                src={url.src[0]}
                alt={`Grid Item ${index + 1}`}
                className='item-billboard'
                onMouseEnter={() => {
                  setCurrHover(url.title);
                  setTooltipText(`${url.title} | ${url.date}`)
                }}
                onMouseLeave={() => {
                  setCurrHover('');
                  setTooltipText(null);
                }}
                onClick={() => onSelectItem(url)}
              />
            </div>
          );
        })}
      <div
          style={{
              fontSize: '12px',
              transform: `rotateZ(${-rotation.z}deg) rotateX(${-rotation.x}deg)`,
              height: 'fit-content',
              pointerEvents: 'none'
          }}
          className='img-billboard'
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