# Translation System - Testing Guide

## 🧪 Manual Testing Checklist

### Basic Functionality Tests

#### Test 1: Language Toggle Works
- [ ] Open app in browser
- [ ] Locate language toggle button (top-right)
- [ ] Click "EN" - verify it's selected
- [ ] Click "ES" - verify it's selected
- [ ] Click "RU" - verify it's selected
- [ ] Verify smooth animation between selections

#### Test 2: Home Page Translations
- [ ] Select "EN" - verify English text
  - [ ] "EXPERIENCE ROME AS A LOCAL"
  - [ ] "Your ultimate roman holiday starts here!"
  - [ ] "Login / Sign Up" button
  - [ ] "Wishlist" button
- [ ] Select "ES" - verify Spanish text
  - [ ] "¡VIVE ROMA COMO UN LOCAL"
  - [ ] "¡Empieza aquí tu escapada romana perfecta!"
  - [ ] "Iniciar sesión/Registrarse" button
  - [ ] "Lista de deseos" button
- [ ] Select "RU" - verify Russian text
  - [ ] "ПОЗНАКОМЬТЕСЬ С РИМОМ КАК МЕСТНЫЙ ЖИТЕЛЬ"
  - [ ] "Ваше идеальное римское путешествие начинается здесь!"
  - [ ] "Войти/Зарегистрироваться" button
  - [ ] "Список желаний" button

#### Test 3: Footer Translations
- [ ] Scroll to footer
- [ ] Select "EN" - verify English footer text
- [ ] Select "ES" - verify Spanish footer text
- [ ] Select "RU" - verify Russian footer text
- [ ] Verify all footer elements translate:
  - [ ] Contact address
  - [ ] All rights reserved
  - [ ] P.IVA
  - [ ] Address
  - [ ] Company name
  - [ ] Privacy policy
  - [ ] Terms of service

#### Test 4: Language Persistence
- [ ] Select "ES" language
- [ ] Refresh page (F5 or Cmd+R)
- [ ] Verify Spanish is still selected
- [ ] Verify Spanish text is displayed
- [ ] Close browser tab
- [ ] Open new tab to same URL
- [ ] Verify Spanish is still selected

#### Test 5: Real-time Updates
- [ ] Select "EN"
- [ ] Verify all text is English
- [ ] Click "ES" without refreshing
- [ ] Verify all text updates instantly
- [ ] Click "RU" without refreshing
- [ ] Verify all text updates instantly
- [ ] No page reload should occur

### Page-Specific Tests

#### Test 6: Navigation Works with Translations
- [ ] Click "Get Started" button
- [ ] Verify page loads
- [ ] Verify language is still selected
- [ ] Verify new page uses same language
- [ ] Change language
- [ ] Verify new page translates

#### Test 7: Multiple Pages Same Language
- [ ] Select "ES"
- [ ] Navigate to different pages
- [ ] Verify all pages use Spanish
- [ ] Navigate back to home
- [ ] Verify home is still Spanish

### Browser Compatibility Tests

#### Test 8: Chrome
- [ ] Open in Chrome
- [ ] Test all language switches
- [ ] Test persistence
- [ ] Check console for errors

#### Test 9: Firefox
- [ ] Open in Firefox
- [ ] Test all language switches
- [ ] Test persistence
- [ ] Check console for errors

#### Test 10: Safari
- [ ] Open in Safari
- [ ] Test all language switches
- [ ] Test persistence
- [ ] Check console for errors

#### Test 11: Edge
- [ ] Open in Edge
- [ ] Test all language switches
- [ ] Test persistence
- [ ] Check console for errors

### Mobile Testing

#### Test 12: Mobile Responsiveness
- [ ] Open on iPhone/iPad
- [ ] Verify toggle button is visible
- [ ] Test language switching
- [ ] Verify text translates
- [ ] Test persistence

#### Test 13: Mobile Browsers
- [ ] Test on Chrome Mobile
- [ ] Test on Safari Mobile
- [ ] Test on Firefox Mobile
- [ ] Verify all work correctly

### Edge Cases

#### Test 14: localStorage Disabled
- [ ] Disable localStorage in browser
- [ ] Select different language
- [ ] Refresh page
- [ ] Verify language reverts to default
- [ ] Re-enable localStorage

#### Test 15: Private/Incognito Mode
- [ ] Open in private/incognito mode
- [ ] Select language
- [ ] Refresh page
- [ ] Verify language reverts (expected)
- [ ] Close and reopen private window
- [ ] Verify default language

#### Test 16: Multiple Tabs
- [ ] Open app in Tab 1
- [ ] Select "ES" in Tab 1
- [ ] Open app in Tab 2
- [ ] Verify Tab 2 shows English (separate storage)
- [ ] Select "RU" in Tab 2
- [ ] Switch to Tab 1
- [ ] Verify Tab 1 still shows Spanish

#### Test 17: Rapid Language Switching
- [ ] Rapidly click through EN → ES → RU → EN
- [ ] Verify no errors occur
- [ ] Verify final language is correct
- [ ] Verify UI updates correctly

### Console Testing

#### Test 18: No Console Errors
- [ ] Open browser DevTools
- [ ] Open Console tab
- [ ] Perform all tests above
- [ ] Verify no errors appear
- [ ] Verify no warnings appear

#### Test 19: React DevTools
- [ ] Install React DevTools extension
- [ ] Open React DevTools
- [ ] Select LanguageContext
- [ ] Change language
- [ ] Verify context state updates
- [ ] Verify components re-render

### Performance Testing

#### Test 20: Language Switch Performance
- [ ] Open DevTools Performance tab
- [ ] Record language switch
- [ ] Verify switch completes in <100ms
- [ ] Verify no jank or stuttering
- [ ] Verify smooth animation

#### Test 21: Memory Usage
- [ ] Open DevTools Memory tab
- [ ] Take heap snapshot
- [ ] Switch languages 10 times
- [ ] Take another heap snapshot
- [ ] Verify no memory leak
- [ ] Verify similar memory usage

## 🔍 Automated Testing (Optional)

### Unit Tests Example

```javascript
// useTranslation.test.js
import { renderHook } from '@testing-library/react';
import { useTranslation } from '../hooks/useTranslation';
import { LanguageProvider } from '../context/LanguageContext';

describe('useTranslation', () => {
  it('should return English translations by default', () => {
    const wrapper = ({ children }) => (
      <LanguageProvider>{children}</LanguageProvider>
    );
    const { result } = renderHook(() => useTranslation(), { wrapper });
    
    expect(result.current.language).toBe('EN');
    expect(result.current.t.contactUs).toBe('CONTACT US');
  });

  it('should return Spanish translations when language is ES', () => {
    // Test implementation
  });

  it('should return Russian translations when language is RU', () => {
    // Test implementation
  });
});
```

### Integration Tests Example

```javascript
// LanguageToggle.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import LanguageToggle from '../components/ui/toggle';
import { LanguageProvider } from '../context/LanguageContext';

describe('LanguageToggle', () => {
  it('should switch language when clicked', () => {
    render(
      <LanguageProvider>
        <LanguageToggle />
      </LanguageProvider>
    );
    
    const esButton = screen.getByText('ES');
    fireEvent.click(esButton);
    
    // Verify language changed
  });
});
```

## 📋 Test Results Template

```
Test Date: _______________
Tester: ___________________
Browser: __________________
OS: _______________________

Test Results:
┌─────────────────────────────────────┬────────┬──────────┐
│ Test Name                           │ Status │ Notes    │
├─────────────────────────────────────┼────────┼──────────┤
│ Language Toggle Works               │ ✓ / ✗  │          │
│ Home Page Translations              │ ✓ / ✗  │          │
│ Footer Translations                 │ ✓ / ✗  │          │
│ Language Persistence                │ ✓ / ✗  │          │
│ Real-time Updates                   │ ✓ / ✗  │          │
│ Navigation Works                    │ ✓ / ✗  │          │
│ Multiple Pages Same Language        │ ✓ / ✗  │          │
│ Chrome Compatibility                │ ✓ / ✗  │          │
│ Firefox Compatibility               │ ✓ / ✗  │          │
│ Safari Compatibility                │ ✓ / ✗  │          │
│ Edge Compatibility                  │ ✓ / ✗  │          │
│ Mobile Responsiveness               │ ✓ / ✗  │          │
│ No Console Errors                   │ ✓ / ✗  │          │
│ Performance Acceptable              │ ✓ / ✗  │          │
│ No Memory Leaks                     │ ✓ / ✗  │          │
└─────────────────────────────────────┴────────┴──────────┘

Overall Status: ✓ PASS / ✗ FAIL

Issues Found:
1. ___________________________________________
2. ___________________________________________
3. ___________________________________________

Recommendations:
1. ___________________________________________
2. ___________________________________________
3. ___________________________________________
```

## 🚀 Regression Testing

After updating pages with translations:

1. **Test each updated page:**
   - [ ] All text translates
   - [ ] No hardcoded text remains
   - [ ] Language persists
   - [ ] No console errors

2. **Test affected components:**
   - [ ] Parent components still work
   - [ ] Child components still work
   - [ ] Sibling components still work

3. **Test integration:**
   - [ ] Navigation still works
   - [ ] Forms still work
   - [ ] Buttons still work
   - [ ] Links still work

## 📊 Test Coverage Goals

- [ ] 100% of user-facing text translates
- [ ] 100% of pages tested
- [ ] 100% of browsers tested
- [ ] 0 console errors
- [ ] 0 memory leaks
- [ ] <100ms language switch time

## ✅ Sign-Off

- [ ] All tests passed
- [ ] No critical issues
- [ ] No major issues
- [ ] Minor issues documented
- [ ] Ready for production

**Tested By:** ___________________
**Date:** ___________________
**Status:** ✓ APPROVED / ✗ REJECTED

---

**Note:** This testing guide should be completed before deploying to production.
