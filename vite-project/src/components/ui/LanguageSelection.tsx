import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from './card';
import { Button } from './button';
import { Globe } from 'lucide-react';

interface Language {
  code: string;
  name: string;
  native: string;
}

interface LanguageSelectionProps {
  onLanguageSelect: (language: string) => void;
  onSkip?: () => void;
}

const languages: Language[] = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'es', name: 'Spanish', native: 'Español' },
  { code: 'fr', name: 'French', native: 'Français' },
  { code: 'de', name: 'German', native: 'Deutsch' },
  { code: 'zh', name: 'Chinese', native: '中文' },
];

export function LanguageSelection({ onLanguageSelect, onSkip }: LanguageSelectionProps) {
  const { t, i18n } = useTranslation();

  const handleLanguageSelect = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setTimeout(() => {
      onLanguageSelect(langCode);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4"
              >
                <Globe className="w-8 h-8 text-blue-600" />
              </motion.div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {t('onboarding.welcome')}
              </h1>
              <p className="text-gray-600">
                Choose your preferred language
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {languages.map((lang, index) => (
                <motion.div
                  key={lang.code}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Button
                    variant="outline"
                    className={`w-full h-16 flex flex-col items-center justify-center transition-all duration-200 ${
                      i18n.language === lang.code 
                        ? 'bg-blue-100 border-blue-500 text-blue-700' 
                        : 'hover:bg-blue-50 hover:border-blue-300'
                    }`}
                    onClick={() => handleLanguageSelect(lang.code)}
                  >
                    <span className="font-medium text-sm">{lang.name}</span>
                    <span className="text-xs text-gray-500 mt-1">{lang.native}</span>
                  </Button>
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-6">
              <Button 
                onClick={onSkip} 
                variant="outline" 
                size="sm"
                className="text-gray-600 hover:text-gray-800"
              >
                Skip
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
