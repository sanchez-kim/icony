'use client';

import { type ReactNode } from 'react';
import { ThemeProvider } from '../context/ThemeContext';
import { LanguageProvider } from '../context/LanguageContext';

export function Providers({ children }: { children: ReactNode }) {
  // Children render immediately (no visibility gate) so the SSR'd HTML is
  // visible to crawlers and paints fast for LCP. The dark-theme flash is
  // prevented by the inline pre-paint script in app/layout.tsx instead.
  return (
    <ThemeProvider>
      <LanguageProvider>{children}</LanguageProvider>
    </ThemeProvider>
  );
}
