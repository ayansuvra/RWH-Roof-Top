import { motion } from 'framer-motion';
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
}

const languages: Language[] = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'te', name: 'Telugu', native: 'తెలుগు' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'ta', name: 'Tamil', native: 'தமিழ்' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
];

export function LanguageSelection({ onLanguageSelect }: LanguageSelectionProps) {
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
                Welcome to RainWater Harvesting System
              </h1>
              <p className="text-gray-600">
                Choose your preferred language to continue
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {languages.map((language, index) => (
                <motion.div
                  key={language.code}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Button
                    variant="outline"
                    className="w-full h-16 flex flex-col items-center justify-center hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                    onClick={() => onLanguageSelect(language.code)}
                  >
                    <span className="font-medium text-sm">{language.name}</span>
                    <span className="text-xs text-gray-500 mt-1">{language.native}</span>
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
