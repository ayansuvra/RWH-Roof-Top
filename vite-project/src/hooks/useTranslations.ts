import { useTranslation } from 'react-i18next';

export const useTranslations = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };

  const getCurrentLanguage = () => i18n.language;

  return {
    t,
    changeLanguage,
    getCurrentLanguage,
    isRTL: ['ar', 'he', 'fa'].includes(i18n.language),
  };
};
