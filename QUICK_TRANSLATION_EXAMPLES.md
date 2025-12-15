# Quick Translation Examples

## How to Add Translations to Your Pages

### Example 1: Simple Text Component

**Before:**
```jsx
function MyComponent() {
  return <h1>Contact Us</h1>;
}
```

**After:**
```jsx
import { useTranslation } from '../hooks/useTranslation';

function MyComponent() {
  const { t } = useTranslation();
  return <h1>{t.contactUs}</h1>;
}
```

---

### Example 2: Multiple Translations

**Before:**
```jsx
function ServiceCard() {
  return (
    <div>
      <h2>Our Services</h2>
      <ul>
        <li>Personal Curator</li>
        <li>Car Services</li>
        <li>Beauty Services</li>
      </ul>
    </div>
  );
}
```

**After:**
```jsx
import { useTranslation } from '../hooks/useTranslation';

function ServiceCard() {
  const { t } = useTranslation();
  return (
    <div>
      <h2>{t.ourService}</h2>
      <ul>
        <li>{t.personalCurator}</li>
        <li>{t.carServices}</li>
        <li>{t.beautyServices}</li>
      </ul>
    </div>
  );
}
```

---

### Example 3: Conditional Rendering Based on Language

```jsx
import { useTranslation } from '../hooks/useTranslation';

function LanguageSpecificContent() {
  const { t, language } = useTranslation();
  
  return (
    <div>
      <p>{t.ultimateRomanHoliday}</p>
      {language === 'EN' && <p>English specific content</p>}
      {language === 'ES' && <p>Contenido específico en español</p>}
      {language === 'RU' && <p>Специфическое русское содержание</p>}
    </div>
  );
}
```

---

### Example 4: Adding New Translation Keys

**Step 1: Add to `src/data/translations.js`**
```javascript
export const translations = {
  EN: {
    // ... existing keys
    myNewFeature: "My New Feature",
    myNewDescription: "This is a new feature description",
  },
  ES: {
    // ... existing keys
    myNewFeature: "Mi Nueva Característica",
    myNewDescription: "Esta es una descripción de la nueva característica",
  },
  RU: {
    // ... existing keys
    myNewFeature: "Моя новая функция",
    myNewDescription: "Это описание новой функции",
  },
};
```

**Step 2: Use in component**
```jsx
const { t } = useTranslation();
return (
  <div>
    <h3>{t.myNewFeature}</h3>
    <p>{t.myNewDescription}</p>
  </div>
);
```

---

### Example 5: Full Page Translation (AboutPage)

```jsx
import { useTranslation } from '../hooks/useTranslation';

function AboutPage() {
  const { t } = useTranslation();
  
  return (
    <div className="page-container">
      <h1>{t.aboutUs}</h1>
      <p>{t.aboutDescription}</p>
      
      <section>
        <h2>{t.ourService}</h2>
        <ul>
          <li>{t.personalCurator}</li>
          <li>{t.ourTours}</li>
          <li>{t.beautyServices}</li>
        </ul>
      </section>
      
      <section>
        <h2>{t.contactUs}</h2>
        <p>{t.address}</p>
        <p>{t.company}</p>
      </section>
    </div>
  );
}

export default AboutPage;
```

---

## Common Patterns

### Pattern 1: Button with Translation
```jsx
<button className="btn">
  {t.loginSignUp}
</button>
```

### Pattern 2: Navigation Links
```jsx
<nav>
  <a href="/about">{t.aboutUs}</a>
  <a href="/services">{t.ourService}</a>
  <a href="/contact">{t.contactUs}</a>
</nav>
```

### Pattern 3: Form Labels
```jsx
<form>
  <label>{t.personalCurator}</label>
  <input type="text" />
  
  <label>{t.contactUs}</label>
  <input type="email" />
</form>
```

### Pattern 4: Error Messages
```jsx
// Add to translations.js
EN: {
  errorRequired: "This field is required",
  errorEmail: "Please enter a valid email",
}

// In component
{error && <p>{t.errorRequired}</p>}
```

---

## Pages to Update

These pages should be updated to use translations:

- [ ] `AboutPage.jsx`
- [ ] `ServicesPage.jsx`
- [ ] `ContactPage.jsx`
- [ ] `PersonalCurator.jsx`
- [ ] `PersonalCuratorForm.jsx`
- [ ] `GalleryPage.jsx`
- [ ] `WishlistPage.jsx`
- [ ] `BottomNav.jsx`
- [ ] `FullscreenMenu.jsx`
- [ ] `servicespage/Personalized.jsx`
- [ ] `servicespage/Seamless.jsx`
- [ ] `servicespage/Sitting.jsx`
- [ ] `servicespage/Beauty.jsx`
- [ ] `servicespage/Tour.jsx`

---

## Testing Your Translations

1. **Test language switching:**
   - Click the language toggle button
   - Verify all text updates immediately
   - Refresh page and verify language persists

2. **Test all languages:**
   - Switch to EN and verify English text
   - Switch to ES and verify Spanish text
   - Switch to RU and verify Russian text

3. **Check for missing translations:**
   - Look for any hardcoded text that didn't translate
   - Add those keys to `translations.js`

---

## Troubleshooting

### Issue: "useTranslation must be used within LanguageProvider"
**Solution:** Make sure the component is wrapped by the LanguageProvider in App.jsx (it already is)

### Issue: Translation key shows as undefined
**Solution:** Check that the key exists in all three language objects in `translations.js`

### Issue: Language doesn't persist after refresh
**Solution:** Check browser localStorage is enabled and not blocked

### Issue: Old language showing after toggle
**Solution:** Make sure you're using the hook correctly and component is re-rendering
