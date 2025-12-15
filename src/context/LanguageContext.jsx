import React, { createContext, useState, useCallback, useEffect } from 'react';

export const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      return localStorage.getItem('selectedLanguage') || 'EN';
    }
    return 'EN';
  });

  const changeLanguage = useCallback((lang) => {
    setLanguage(lang);
    localStorage.setItem('selectedLanguage', lang);
  }, []);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}
