'use client';

import { createContext, useContext, useState, useEffect, useLayoutEffect, ReactNode } from 'react';
import { ko } from '../locales/ko';
import { en } from '../locales/en';

export type Language = 'ko' | 'en';
export type Translations = typeof ko;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  ko,
  en,
};

// Language of the server-rendered HTML (and of <html lang> in app/layout.tsx).
export const DEFAULT_LANGUAGE: Language = 'en';

// useLayoutEffect warns during SSR; it only needs to run in the browser.
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

function detectClientLanguage(): Language {
  try {
    const stored = localStorage.getItem('icony_language');
    if (stored === 'ko' || stored === 'en') return stored;
  } catch {
    // Storage can be unavailable (privacy mode); fall through to the browser language.
  }
  const browserLang = (navigator.language || '').toLowerCase();
  return browserLang.startsWith('ko') ? 'ko' : 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Always start in English so the server render (static HTML seen by
  // crawlers) and the first client render agree. Reading localStorage or
  // navigator here would make the hydration render differ from the SSR HTML.
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);

  // After hydration, switch to the stored preference or the browser language.
  // A layout effect applies it before the browser paints the hydrated tree,
  // which keeps the English-to-Korean flash as short as possible.
  useIsomorphicLayoutEffect(() => {
    const detected = detectClientLanguage();
    if (detected !== DEFAULT_LANGUAGE) setLanguageState(detected);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('icony_language', lang);
    } catch {
      // Ignore storage failures; the in-memory language still switches.
    }
  };

  useEffect(() => {
    // Update HTML lang attribute
    document.documentElement.lang = language;
  }, [language]);

  const value = {
    language,
    setLanguage,
    t: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
