# Translation System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        App.jsx                              │
│                  (Wrapped with LanguageProvider)            │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              LanguageContext (Global State)                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ State: language = "EN" | "ES" | "RU"                │  │
│  │ Function: changeLanguage(lang)                       │  │
│  │ Storage: localStorage.selectedLanguage              │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
    ┌────────┐        ┌────────┐        ┌────────┐
    │ Toggle │        │ Footer │        │ Pages  │
    │Component│        │Component│        │(Any)   │
    └────────┘        └────────┘        └────────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
                    useTranslation()
                           │
                           ▼
                ┌──────────────────────┐
                │  translations.js     │
                │  ┌────────────────┐  │
                │  │ EN: {...}      │  │
                │  │ ES: {...}      │  │
                │  │ RU: {...}      │  │
                │  └────────────────┘  │
                └──────────────────────┘
```

## Data Flow

### 1. User Clicks Language Toggle

```
User clicks "ES" button
        │
        ▼
handleLanguageChange(1) called
        │
        ▼
changeLanguage("ES") called
        │
        ▼
LanguageContext state updates
        │
        ▼
localStorage.setItem("selectedLanguage", "ES")
        │
        ▼
All components using useTranslation() re-render
        │
        ▼
Components read new language from context
        │
        ▼
Components get Spanish translations from translations.js
        │
        ▼
UI updates with Spanish text
```

### 2. Page Refresh

```
User refreshes page
        │
        ▼
App loads
        │
        ▼
LanguageProvider initializes
        │
        ▼
language state = "EN" (default)
        │
        ▼
Components render with English
        │
        ▼
(Note: localStorage restoration would require additional code)
```

## Component Hierarchy

```
App
├── LanguageProvider
│   ├── AuthProvider
│   │   ├── Router
│   │   │   ├── Home
│   │   │   │   ├── LanguageToggle (uses context)
│   │   │   │   ├── MyAccountDropdown
│   │   │   │   ├── Footer (uses useTranslation)
│   │   │   │   └── ResponsiveBottomNav
│   │   │   ├── AboutPage (should use useTranslation)
│   │   │   ├── ServicesPage (should use useTranslation)
│   │   │   ├── ContactPage (should use useTranslation)
│   │   │   └── ... other pages
│   │   └── AuthModal
```

## File Structure

```
src/
├── context/
│   ├── AuthContext.jsx
│   └── LanguageContext.jsx ✨ NEW
│
├── hooks/
│   ├── useWishlist.js
│   └── useTranslation.js ✨ NEW
│
├── data/
│   └── translations.js ✨ NEW
│
├── components/
│   ├── ui/
│   │   └── toggle.jsx (UPDATED)
│   ├── Footer.jsx (UPDATED)
│   └── ... other components
│
├── pages/
│   ├── AboutPage.jsx (TODO)
│   ├── ServicesPage.jsx (TODO)
│   └── ... other pages
│
└── App.jsx (UPDATED)
```

## State Management Flow

```
┌─────────────────────────────────────────┐
│      LanguageContext                    │
│  ┌───────────────────────────────────┐  │
│  │ State:                            │  │
│  │ - language: "EN" | "ES" | "RU"   │  │
│  │                                   │  │
│  │ Methods:                          │  │
│  │ - changeLanguage(lang)            │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
           │
           │ Provides via Context
           │
           ▼
┌─────────────────────────────────────────┐
│      useTranslation Hook                │
│  ┌───────────────────────────────────┐  │
│  │ Returns:                          │  │
│  │ - t: translations[language]       │  │
│  │ - language: current language      │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
           │
           │ Used by Components
           │
           ▼
┌─────────────────────────────────────────┐
│      Components                         │
│  ┌───────────────────────────────────┐  │
│  │ <h1>{t.experienceRomeAsLocal}</h1>│  │
│  │ <p>{t.ultimateRomanHoliday}</p>   │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

## Translation Resolution

```
Component requests: t.contactUs
        │
        ▼
useTranslation() hook called
        │
        ▼
Get current language from context: "ES"
        │
        ▼
Look up in translations.js: translations["ES"]
        │
        ▼
Get value: "CONTÁCTENOS"
        │
        ▼
Return to component
        │
        ▼
Render: <h1>CONTÁCTENOS</h1>
```

## localStorage Integration

```
User selects language
        │
        ▼
changeLanguage("ES") called
        │
        ▼
localStorage.setItem("selectedLanguage", "ES")
        │
        ▼
Value stored in browser
        │
        ▼
Persists across:
├── Page refreshes
├── Browser restarts
├── New tabs (same domain)
└── Different pages (same domain)
```

## Rendering Flow

```
┌──────────────────────────────────────────┐
│  User clicks language toggle             │
└──────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────┐
│  handleLanguageChange() executes         │
└──────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────┐
│  changeLanguage(newLang) called          │
└──────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────┐
│  LanguageContext state updates           │
│  (triggers re-render of all subscribers) │
└──────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────┐
│  All components using useTranslation()   │
│  re-render with new language             │
└──────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────┐
│  Components read new translations        │
│  from translations.js                    │
└──────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────┐
│  UI updates with new language text       │
│  (instant, no page reload)               │
└──────────────────────────────────────────┘
```

## Performance Characteristics

```
Operation                    Time Complexity    Space Complexity
─────────────────────────────────────────────────────────────────
Language change              O(1)               O(1)
Translation lookup           O(1)               O(1)
Component re-render          O(n)               O(n)
localStorage access          O(1)               O(1)
─────────────────────────────────────────────────────────────────

Where n = number of components using useTranslation()
```

## Scalability

### Current Implementation
- ✅ Supports 3 languages
- ✅ ~25 translation keys
- ✅ All components can access translations
- ✅ No performance issues

### Scalability Limits
- Can handle 10+ languages easily
- Can handle 1000+ translation keys
- Performance remains O(1) for lookups
- localStorage has ~5-10MB limit per domain

### When to Upgrade
- If you need 100+ languages
- If you need dynamic translation updates
- If you need translation management UI
- If you need server-side translations

## Integration Points

```
LanguageContext
    │
    ├── Provides: language state
    ├── Provides: changeLanguage function
    └── Consumed by: useTranslation hook
            │
            ├── Consumed by: LanguageToggle
            ├── Consumed by: Footer
            ├── Consumed by: Home
            └── Consumed by: All other pages (TODO)

translations.js
    │
    └── Imported by: useTranslation hook
            │
            └── Used by: All components
```

## Error Handling

```
Component tries to use useTranslation()
    │
    ├─ If inside LanguageProvider
    │  └─ ✅ Works correctly
    │
    └─ If outside LanguageProvider
       └─ ❌ Throws error: "useTranslation must be used within LanguageProvider"
```

## Future Architecture Enhancements

```
Current:
App → LanguageProvider → useTranslation → translations.js

Future (with backend):
App → LanguageProvider → useTranslation → API → Backend Database
                                        ↓
                                   localStorage (cache)
```

---

This architecture is simple, efficient, and scalable for the current needs of the application.
