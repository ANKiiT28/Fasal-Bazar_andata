

"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import en from '@/lib/locales/en.json';
import hi from '@/lib/locales/hi.json';

type Language = 'en' | 'hi';

type Translations = {
    [key: string]: string;
}

const translations: { [key in Language]: Translations } = {
    en,
    hi
};

interface LanguageContextType {
    language: Language;
    setLanguage: (language: Language) => void;
    t: (key: string, values?: { [key: string]: string }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const storedLang = localStorage.getItem('language') as Language;
    if (storedLang && (storedLang === 'en' || storedLang === 'hi')) {
      setLanguageState(storedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    localStorage.setItem('language', lang);
    setLanguageState(lang);
  };

  const t = useCallback((key: string, values?: { [key: string]: string }): string => {
    let text = translations[language][key] || key;
    if (values) {
      Object.keys(values).forEach(valueKey => {
        text = text.replace(`{${valueKey}}`, values[valueKey]);
      });
    }
    return text;
  }, [language]);


  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
