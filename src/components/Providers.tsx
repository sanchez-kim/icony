'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { ThemeProvider } from '../context/ThemeContext';
import { LanguageProvider } from '../context/LanguageContext';

export function Providers({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ThemeProvider>
      <LanguageProvider>
        {!mounted ? (
          <div style={{ visibility: 'hidden' }}>{children}</div>
        ) : (
          children
        )}
      </LanguageProvider>
    </ThemeProvider>
  );
}
