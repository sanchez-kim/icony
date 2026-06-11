'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Muted, looping promo video that lazy-loads: the MP4 bytes are only fetched
 * once the player scrolls into view, and playback pauses when it scrolls away.
 * Keeps the video off the initial page load.
 */
export function PromoVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setLoad(true);
          el.play?.().catch(() => {});
        } else {
          el.pause?.();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      autoPlay
      preload="none"
      poster="/icony-promo-poster.png"
      aria-label="Icony product demo"
      className="block w-full aspect-video"
      {...(load ? { src: '/icony-promo.mp4' } : {})}
    />
  );
}
