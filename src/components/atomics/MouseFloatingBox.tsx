import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useRef, useState } from 'react';

export default function MouseFloatingBox({
  disabled = false,
  children,
}: { disabled?: boolean; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isMouseEnter, setIsMouseEnter] = useState<boolean>(false);

  const [isMobile] = useMediaQuery(['(pointer: coarse)']);

  const moveBox = (clientX: number, clientY: number) => {
    requestAnimationFrame(() => {
      if (!ref.current) return;
      const { top, left, width, height } = ref.current.getBoundingClientRect();
      const centerX = left + width * 0.5;
      const centerY = top + height * 0.5;
      const x = (clientX - centerX) * 0.05;
      const y = (clientY - centerY) * 0.05;
      setPosition({ x, y });
    });
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    moveBox(e.clientX, e.clientY);
    setIsMouseEnter(true);
  };
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    moveBox(e.clientX, e.clientY);
  };
  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  if (disabled) {
    return children;
  }

  if (isMobile) {
    return <div className="active:scale-105 duration-200">{children}</div>;
  }

  return (
    <div
      ref={ref}
      className={`transition-transform will-change-transform hover:scale-105 ${isMouseEnter ? '' : 'duration-1000'}`}
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}
