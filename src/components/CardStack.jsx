import React, { useState, useRef, useCallback } from 'react';

const SPRING_STIFFNESS = 170;
const SPRING_DAMPING = 26;
const OFFSET_PERCENT = 8;
const SCALE_STEP = 0.06;
const DIM_STEP = 0.12;
const DRAG_THRESHOLD = 60;

export default function CardStack({ items, renderCard, className = '' }) {
  const [cards, setCards] = useState(() => items.map((item, i) => ({ ...item, _key: i })));
  const [dragging, setDragging] = useState(false);
  const [dragY, setDragY] = useState(0);
  const startY = useRef(0);
  const containerRef = useRef(null);

  // Update cards when items change
  React.useEffect(() => {
    setCards(items.map((item, i) => ({ ...item, _key: i })));
  }, [items]);

  const cycleToEnd = useCallback(() => {
    setCards(prev => [...prev.slice(1), prev[0]]);
  }, []);

  const handlePointerDown = (e) => {
    e.preventDefault();
    startY.current = e.clientY;
    setDragging(true);
    setDragY(0);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!dragging) return;
    const delta = e.clientY - startY.current;
    setDragY(delta);
  };

  const handlePointerUp = () => {
    if (!dragging) return;
    if (Math.abs(dragY) > DRAG_THRESHOLD) {
      cycleToEnd();
    }
    setDragging(false);
    setDragY(0);
  };

  if (!cards.length) return null;

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{ perspective: '1200px' }}
    >
      {cards.map((card, i) => {
        const isFront = i === 0;
        const zIndex = cards.length - i;
        const offsetY = i * -OFFSET_PERCENT;
        const scale = 1 - i * SCALE_STEP;
        const brightness = Math.max(0.3, 1 - i * DIM_STEP);

        // Front card drag transforms
        const dragScale = isFront && dragging ? 1.03 : 1;
        const dragRotate = isFront && dragging ? (dragY > 0 ? 2 : -2) * Math.min(1, Math.abs(dragY) / 100) : 0;
        const dragTranslateY = isFront ? dragY * 0.6 : 0;

        return (
          <div
            key={card._key}
            className="absolute inset-0"
            style={{
              zIndex,
              transform: `translateY(calc(${offsetY}%)) translateY(${dragTranslateY}px) scale(${scale * dragScale}) rotate(${dragRotate}deg)`,
              filter: `brightness(${brightness})`,
              transition: dragging && isFront ? 'none' : 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: isFront ? (dragging ? 'grabbing' : 'grab') : 'default',
              userSelect: 'none',
              touchAction: 'none',
            }}
            onPointerDown={isFront ? handlePointerDown : undefined}
            onPointerMove={isFront ? handlePointerMove : undefined}
            onPointerUp={isFront ? handlePointerUp : undefined}
            onPointerCancel={isFront ? handlePointerUp : undefined}
          >
            {renderCard(card, i, isFront)}
          </div>
        );
      })}
    </div>
  );
}
