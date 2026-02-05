import { useEffect, useState } from 'react';

interface UseCounterAnimationOptions {
  end: number;
  duration?: number;
  start?: number;
  isActive?: boolean;
}

export function useCounterAnimation({
  end,
  duration = 2000,
  start = 0,
  isActive = true,
}: UseCounterAnimationOptions) {
  const [count, setCount] = useState(start);

  useEffect(() => {
    if (!isActive) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);

      // Easing function (easeOutQuart)
      const easeOut = 1 - Math.pow(1 - percentage, 4);
      const currentCount = Math.floor(start + (end - start) * easeOut);

      setCount(currentCount);

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration, start, isActive]);

  return count;
}
