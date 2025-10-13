# Internationalization (i18n) Setup

This project uses `react-i18next` for multi-language support.

## Supported Languages

- English (en) 🇺🇸
- Spanish (es) 🇪🇸  
- French (fr) 🇫🇷
- German (de) 🇩🇪
- Hindi (hi) 🇮🇳
- Chinese (zh) 🇨🇳

## Usage

### In Components

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('onboarding.welcome')}</h1>
      <p>{t('onboarding.subtitle')}</p>
    </div>
  );
}
```

### Using Custom Hook

```tsx
import { useTranslations } from '../hooks/useTranslations';

function MyComponent() {
  const { t, changeLanguage, getCurrentLanguage } = useTranslations();
  
  return (
    <div>
      <h1>{t('common.welcome')}</h1>
      <button onClick={() => changeLanguage('es')}>
        Switch to Spanish
      </button>
    </div>
  );
}
```

## Adding New Translations

1. Add the key-value pair to all language files in `src/i18n/locales/`
2. Use the translation key in your component with `t('key.path')`

## Translation Keys Structure

```json
{
  "common": {
    "next": "Next",
    "back": "Back"
  },
  "onboarding": {
    "welcome": "Welcome",
    "step1": "Step 1"
  }
}
```

## Language Detection

The app automatically detects the user's browser language and falls back to English if the detected language is not supported.
