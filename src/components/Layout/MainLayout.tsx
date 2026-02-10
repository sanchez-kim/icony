import { useState, useEffect, useRef } from 'react';
import { Sidebar } from './Sidebar';
import { CustomizationPanel } from '../CustomizationPanel/CustomizationPanel';

export function MainLayout() {
  const [leftWidth, setLeftWidth] = useState<number>(() => {
    // Load saved width from localStorage, default to 65%
    const saved = localStorage.getItem('icony_layout_width');
    return saved ? parseFloat(saved) : 65;
  });
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Save to localStorage when width changes
  useEffect(() => {
    localStorage.setItem('icony_layout_width', leftWidth.toString());
  }, [leftWidth]);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;

    // Constrain between 30% and 80%
    if (newLeftWidth >= 30 && newLeftWidth <= 80) {
      setLeftWidth(newLeftWidth);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [isDragging]);

  return (
    <div className="container mx-auto px-6 py-10">
      {/* Mobile: Stack vertically */}
      <div className="flex flex-col md:hidden gap-8">
        <Sidebar />
        <CustomizationPanel />
      </div>

      {/* Desktop: Resizable panels */}
      <div
        ref={containerRef}
        className="hidden md:flex gap-0 relative"
      >
        {/* Left Panel - Icon Gallery */}
        <div
          style={{ width: `${leftWidth}%` }}
          className="pr-4 flex-shrink-0"
        >
          <Sidebar />
        </div>

        {/* Resizer */}
        <div
          onMouseDown={handleMouseDown}
          className={`w-1 cursor-col-resize hover:bg-primary-500 transition-colors relative group flex-shrink-0 ${
            isDragging ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-700'
          }`}
        >
          <div className="absolute inset-y-0 -left-1 -right-1 group-hover:bg-primary-500/20" />
        </div>

        {/* Right Panel - Customization */}
        <div
          style={{ width: `${100 - leftWidth}%` }}
          className="pl-4 flex-shrink-0"
        >
          <CustomizationPanel />
        </div>
      </div>
    </div>
  );
}
