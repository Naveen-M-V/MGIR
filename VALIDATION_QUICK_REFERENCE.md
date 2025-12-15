# Input Validation - Quick Reference Guide

## Quick Start

### Option 1: Use ValidatedInput Component (Easiest)
```jsx
import ValidatedInput from '../components/ValidatedInput';

<ValidatedInput
  type="email"
  name="email"
  label="Email Address"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={errors.email}
  validationType="email"
  required={true}
/>
```

### Option 2: Manual Validation
```jsx
import { validateEmail, getValidationError } from '../utils/validationUtils';

const handleBlur = () => {
  if (!validateEmail(email)) {
    setError(getValidationError('Email', 'email'));
  }
};
```

---

## Validation Types Reference

| Type | Function | Example |
|------|----------|---------|
| Email | `validateEmail(email)` | `validateEmail('user@example.com')` |
| Phone | `validatePhone(phone)` | `validatePhone('+1 (555) 123-4567')` |
| Name | `validateName(name)` | `validateName('John Doe')` |
| Text | `validateText(text, minLength)` | `validateText(message, 10)` |
| Number | `validateNumber(num, min, max)` | `validateNumber(age, 18, 65)` |
| Age | `validateAge(age)` | `validateAge(25)` |
| Date | `validateDate(date)` | `validateDate('2024-12-04')` |
| Future Date | `validateFutureDate(date)` | `validateFutureDate('2025-12-04')` |
| URL | `validateUrl(url)` | `validateUrl('https://example.com')` |
| Address | `validateAddress(address)` | `validateAddress('123 Main St')` |
| Password | `validatePassword(pwd)` | `validatePassword('SecurePass123')` |
| Username | `validateUsername(user)` | `validateUsername('john_doe')` |
| Checkbox | `validateCheckbox(checked)` | `validateCheckbox(true)` |

---

## Common Patterns

### Pattern 1: Contact Form
```jsx
import { validateEmail, validateName, validateText } from '../utils/validationUtils';

const validateContactForm = () => {
  const errors = {};
  
  if (!validateName(name)) errors.name = "Invalid name";
  if (!validateEmail(email)) errors.email = "Invalid email";
  if (!validateText(message, 10)) errors.message = "Min 10 characters";
  
  return errors;
};
```

### Pattern 2: User Registration
```jsx
import { validateEmail, validatePassword, validateUsername } from '../utils/validationUtils';

const validateSignup = () => {
  const errors = {};
  
  if (!validateUsername(username)) errors.username = "3-20 chars, alphanumeric";
  if (!validateEmail(email)) errors.email = "Invalid email";
  if (!validatePassword(password)) errors.password = "Min 8 chars, uppercase, lowercase, number";
  
  return errors;
};
```

### Pattern 3: Booking Form
```jsx
import { validateName, validatePhone, validateFutureDate } from '../utils/validationUtils';

const validateBooking = () => {
  const errors = {};
  
  if (!validateName(fullName)) errors.fullName = "Invalid name";
  if (!validatePhone(phone)) errors.phone = "Invalid phone";
  if (!validateFutureDate(date)) errors.date = "Select future date";
  
  return errors;
};
```

### Pattern 4: Real-time Validation
```jsx
const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
  
  // Clear error when user starts typing
  if (errors[name]) {
    setErrors(prev => ({ ...prev, [name]: "" }));
  }
};

const handleBlur = (e) => {
  const { name, value } = e.target;
  
  // Validate on blur
  if (!validateFormField(value, validationType[name])) {
    setErrors(prev => ({
      ...prev,
      [name]: getValidationError(name, validationType[name])
    }));
  }
};
```

---

## Error Message Customization

### Use Default Messages
```jsx
import { getValidationError } from '../utils/validationUtils';

const error = getValidationError('Email', 'email');
// Returns: "Please enter a valid email address (e.g., user@example.com)"
```

### Use Custom Messages
```jsx
if (!validateEmail(email)) {
  setError("Please provide a valid email");
}
```

---

## Form Validation Schema

### Define Schema
```jsx
const validationSchema = {
  name: { 
    type: 'name', 
    options: { required: true } 
  },
  email: { 
    type: 'email', 
    options: { required: true } 
  },
  message: { 
    type: 'text', 
    options: { required: true, minLength: 10 } 
  }
};
```

### Validate Entire Form
```jsx
import { validateForm } from '../utils/validationUtils';

const handleSubmit = (e) => {
  e.preventDefault();
  
  const { isValid, errors } = validateForm(formData, validationSchema);
  
  if (!isValid) {
    setErrors(errors);
    return;
  }
  
  // Process form
  submitForm(formData);
};
```

---

## Security: Input Sanitization

### Prevent XSS Attacks
```jsx
import { sanitizeInput } from '../utils/validationUtils';

const userInput = "<script>alert('XSS')</script>";
const safe = sanitizeInput(userInput);
// Result: "&lt;script&gt;alert('XSS')&lt;/script&gt;"
```

### Normalize Input
```jsx
import { normalizeInput } from '../utils/validationUtils';

const messy = "  Hello    World  ";
const clean = normalizeInput(messy);
// Result: "Hello World"
```

---

## Visual Feedback Examples

### Error State
```jsx
className={`
  border rounded-lg px-3 py-2
  ${error ? 'border-red-400 bg-red-500/10' : 'border-white/20'}
`}
```

### Error Message Display
```jsx
{error && (
  <p className="text-red-300 text-xs mt-1 flex items-center gap-1">
    <span>⚠</span> {error}
  </p>
)}
```

---

## Testing Validation

### Test Valid Inputs
```javascript
validateEmail('user@example.com') // true
validatePhone('+1 (555) 123-4567') // true
validateName('John Doe') // true
validateAge('25') // true
```

### Test Invalid Inputs
```javascript
validateEmail('invalid.email') // false
validatePhone('123') // false
validateName('J') // false
validateAge('150') // false
```

---

## Common Mistakes to Avoid

❌ **Don't:**
- Skip server-side validation
- Display technical error messages
- Validate only on submit
- Store sensitive data unencrypted
- Forget to sanitize user input

✅ **Do:**
- Always validate on both client and server
- Use user-friendly error messages
- Validate in real-time (on blur)
- Sanitize all user input
- Keep validation rules consistent

---

## Implementation Checklist

- [ ] Import validation utilities
- [ ] Define validation schema or rules
- [ ] Add error state management
- [ ] Implement real-time validation (blur)
- [ ] Implement form-level validation (submit)
- [ ] Add error message display
- [ ] Add visual feedback (red borders)
- [ ] Test with valid inputs
- [ ] Test with invalid inputs
- [ ] Test with edge cases
- [ ] Sanitize sensitive inputs
- [ ] Add accessibility labels

---

## Support Resources

1. **Full Guide:** `INPUT_VALIDATION_GUIDE.md`
2. **Validation Utils:** `src/utils/validationUtils.js`
3. **Component:** `src/components/ValidatedInput.jsx`
4. **Example:** `src/pages/ContactPage.jsx`

---

**Last Updated:** December 4, 2025
