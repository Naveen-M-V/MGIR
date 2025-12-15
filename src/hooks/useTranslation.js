import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { translations } from '../data/translations';

export function useTranslation() {
  const context = useContext(LanguageContext);
  
  if (!context) {
    throw new Error('useTranslation must be used within LanguageProvider');
  }

  const { language } = context;
  const t = translations[language] || translations.EN;

  return { t, language };
}
