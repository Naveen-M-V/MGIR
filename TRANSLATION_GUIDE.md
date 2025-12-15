# Translation System Guide

## Overview
A complete language translation system has been implemented that allows you to switch between English (EN), Spanish (ES), and Russian (RU) languages using the language toggle button.

## How It Works

### 1. **Language Context** (`src/context/LanguageContext.jsx`)
- Manages the current language state globally
- Stores selected language in localStorage for persistence
- Provides `changeLanguage()` function to switch languages

### 2. **Translation Data** (`src/data/translations.js`)
- Contains all translated content for EN, ES, and RU
- Organized by sections (homeScreen, navigation, services, etc.)
- Easy to add new translation keys

### 3. **useTranslation Hook** (`src/hooks/useTranslation.js`)
- Custom hook to access translations in any component
- Returns `t` object with all translations for current language
- Returns `language` for the current language code

### 4. **Language Toggle** (`src/components/ui/toggle.jsx`)
- Visual toggle button to switch languages
- Automatically syncs with LanguageContext
- Displays flag icons for each language

## How to Use in Components

### Basic Usage
```jsx
import { useTranslation } from '../hooks/useTranslation';

function MyComponent() {
  const { t, language } = useTranslation();
  
  return (
    <div>
      <h1>{t.experienceRomeAsLocal}</h1>
      <p>{t.ultimateRomanHoliday}</p>
      <span>Current Language: {language}</span>
    </div>
  );
}
```

### Adding New Translations

1. **Add to `src/data/translations.js`:**
```javascript
export const translations = {
  EN: {
    myNewKey: "English text here",
    // ... other translations
  },
  ES: {
    myNewKey: "Texto en español aquí",
    // ... other translations
  },
  RU: {
    myNewKey: "Русский текст здесь",
    // ... other translations
  },
};
```

2. **Use in component:**
```jsx
const { t } = useTranslation();
<p>{t.myNewKey}</p>
```

## Available Translation Keys

### Home Screen
- `homeScreen` - "Home Screen"
- `experienceRomeAsLocal` - Main heading
- `ultimateRomanHoliday` - Subheading

### Navigation & Auth
- `loginSignUp` - Login/Sign Up button
- `wishlist` - Wishlist button

### Services
- `ourService` - Services section title
- `personalCurator` - Personal Curator service
- `personalCompanion` - Personal Companion service
- `ourTours` - Tours service
- `carServices` - Car Services
- `sittingServices` - Sitting Services
- `beautyServices` - Beauty Services

### Personal Curator
- `personalCuratorTitle` - Section title
- `gallery` - Gallery section
- `general` - General category
- `tour` - Tour category
- `beautyServicesMenu` - Beauty Services menu

### Contact & Footer
- `contactUs` - Contact Us section
- `contactAddress` - Address
- `allRightsReserved` - Copyright text
- `pIva` - P.IVA number
- `address` - Full address
- `company` - Company name
- `privacyPolicy` - Privacy Policy link
- `termsOfService` - Terms of Service link

## Updating Existing Pages

To update any page with translations:

1. Import the hook:
```jsx
import { useTranslation } from '../hooks/useTranslation';
```

2. Use in component:
```jsx
function MyPage() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t.contactUs}</h1>
      <p>{t.contactAddress}</p>
    </div>
  );
}
```

## App Structure

```
src/
├── context/
│   ├── AuthContext.jsx
│   └── LanguageContext.jsx (NEW)
├── hooks/
│   ├── useWishlist.js
│   └── useTranslation.js (NEW)
├── data/
│   └── translations.js (NEW)
├── components/
│   └── ui/
│       └── toggle.jsx (UPDATED)
└── App.jsx (UPDATED)
```

## Features

✅ **Persistent Language Selection** - Language choice saved in localStorage
✅ **Real-time Updates** - All components update instantly when language changes
✅ **Easy to Extend** - Add new translations without code changes
✅ **Type-Safe** - All translation keys are defined in one place
✅ **Performance** - Efficient context-based state management
✅ **Responsive** - Works across all pages and components

## Next Steps

1. Update all page components to use `useTranslation()` hook
2. Add more translation keys as needed
3. Consider adding a backend API to manage translations dynamically (optional)
4. Add language selection to user profile preferences (optional)

## Backend Integration (Optional)

If you want to store language preferences per user:

1. Add language field to user profile in backend
2. Fetch language preference on login
3. Update LanguageContext to sync with user profile
4. Save language preference when user changes it

Example backend endpoint:
```
POST /api/user/preferences/language
{ "language": "ES" }
```
