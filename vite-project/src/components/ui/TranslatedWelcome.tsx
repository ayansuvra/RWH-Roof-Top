import React from 'react';
import { useTranslation } from 'react-i18next';

export const TranslatedWelcome: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="text-center p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        {t('onboarding.welcome')}
      </h1>
      <p className="text-lg text-gray-600 mb-6">
        {t('onboarding.subtitle')}
      </p>
      <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
        {t('onboarding.getStarted')}
      </button>
    </div>
  );
};
