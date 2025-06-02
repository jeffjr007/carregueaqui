
import React, { useState, useEffect, useRef } from 'react';

interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  windowHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  overscan?: number;
}

export function VirtualList<T>({
  items,
  itemHeight,
  windowHeight,
  renderItem,
  className = "",
  overscan = 3
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate visible range
  const visibleItemsCount = Math.ceil(windowHeight / itemHeight);
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.floor(scrollTop / itemHeight) + visibleItemsCount + overscan
  );

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        setScrollTop(containerRef.current.scrollTop);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Render only visible items
  const visibleItems = items.slice(startIndex, endIndex + 1).map((item, index) => {
    const itemIndex = startIndex + index;
    const top = itemIndex * itemHeight;
    return (
      <div 
        key={itemIndex} 
        style={{ 
          position: 'absolute', 
          top, 
          height: itemHeight,
          width: '100%'
        }}
      >
        {renderItem(item, itemIndex)}
      </div>
    );
  });

  return (
    <div 
      ref={containerRef} 
      style={{ 
        height: windowHeight, 
        overflow: 'auto',
        position: 'relative'
      }}
      className={className}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        {visibleItems}
      </div>
    </div>
  );
}
