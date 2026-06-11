'use client';

import { useEffect, useState, type ComponentType } from 'react';

/**
 * Renders the morphing hero animation (public/hero-morph.json).
 * lottie-react (and its lottie-web runtime, ~250KB) is dynamically imported so
 * it stays out of the initial bundle and only loads on the client after mount.
 */
export function HeroLottie({ className }: { className?: string }) {
  const [Lottie, setLottie] = useState<ComponentType<any> | null>(null);
  const [data, setData] = useState<unknown>(null);

  useEffect(() => {
    let mounted = true;
    import('lottie-react').then((mod) => {
      if (mounted) setLottie(() => mod.default);
    });
    fetch('/hero-morph.json')
      .then((res) => res.json())
      .then((json) => {
        if (mounted) setData(json);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  // Reserve the space before load to avoid layout shift.
  if (!Lottie || !data) {
    return <div className={className} aria-hidden="true" />;
  }

  return (
    <Lottie
      animationData={data}
      loop
      className={className}
      aria-hidden="true"
      rendererSettings={{ preserveAspectRatio: 'xMidYMid meet' }}
    />
  );
}
