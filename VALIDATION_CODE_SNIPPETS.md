# Input Validation - Copy-Paste Code Snippets

## Quick Copy-Paste Solutions

### 1. Simple Email Input with Validation

```jsx
import { useState } from 'react';
import { validateEmail, getValidationError } from '../utils/validationUtils';

function EmailInput() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleBlur = () => {
    if (email && !validateEmail(email)) {
      setError(getValidationError('Email', 'email'));
    } else {
      setError('');
    }
  };

  return (
    <div>
      <label className="block text-white/90 text-sm font-medium mb-2">
        Email Address *
      </label>
      <input
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (error) setError('');
        }}
        onBlur={handleBlur}
        className={`w-full px-3 py-2 bg-white/10 border rounded-lg text-white ${
          error ? 'border-red-400' : 'border-white/20'
        }`}
        placeholder="your@email.com"
      />
      {error && <p className="text-red-300 text-xs mt-1">⚠ {error}</p>}
    </div>
  );
}

export default EmailInput;
```

---

### 2. Contact Form with Full Validation

```jsx
import { useState } from 'react';
import { validateEmail, validateName, validateText } from '../utils/validationUtils';

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!validateName(formData.name)) {
      newErrors.name = 'Please enter a valid name (min 2 characters)';
    }
    
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!validateText(formData.message, 10)) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    console.log('Form submitted:', formData);
    alert('Message sent successfully!');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-white/90 text-sm font-medium mb-2">
          Name *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-3 py-2 bg-white/10 border rounded-lg text-white ${
            errors.name ? 'border-red-400' : 'border-white/20'
          }`}
          placeholder="Your name"
        />
        {errors.name && <p className="text-red-300 text-xs mt-1">⚠ {errors.name}</p>}
      </div>

      <div>
        <label className="block text-white/90 text-sm font-medium mb-2">
          Email *
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-3 py-2 bg-white/10 border rounded-lg text-white ${
            errors.email ? 'border-red-400' : 'border-white/20'
          }`}
          placeholder="your@email.com"
        />
        {errors.email && <p className="text-red-300 text-xs mt-1">⚠ {errors.email}</p>}
      </div>

      <div>
        <label className="block text-white/90 text-sm font-medium mb-2">
          Message *
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          className={`w-full px-3 py-2 bg-white/10 border rounded-lg text-white resize-none ${
            errors.message ? 'border-red-400' : 'border-white/20'
          }`}
          placeholder="Your message (min 10 characters)"
          rows={4}
        />
        {errors.message && <p className="text-red-300 text-xs mt-1">⚠ {errors.message}</p>}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all"
      >
        Send Message
      </button>
    </form>
  );
}

export default ContactForm;
```

---

### 3. Phone Number Input with Validation

```jsx
import { useState } from 'react';
import { validatePhone, getValidationError } from '../utils/validationUtils';

function PhoneInput() {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleBlur = () => {
    if (phone && !validatePhone(phone)) {
      setError(getValidationError('Phone', 'phone'));
    } else {
      setError('');
    }
  };

  return (
    <div>
      <label className="block text-white/90 text-sm font-medium mb-2">
        Phone Number *
      </label>
      <input
        type="tel"
        value={phone}
        onChange={(e) => {
          setPhone(e.target.value);
          if (error) setError('');
        }}
        onBlur={handleBlur}
        className={`w-full px-3 py-2 bg-white/10 border rounded-lg text-white ${
          error ? 'border-red-400' : 'border-white/20'
        }`}
        placeholder="+1 (555) 123-4567"
      />
      {error && <p className="text-red-300 text-xs mt-1">⚠ {error}</p>}
    </div>
  );
}

export default PhoneInput;
```

---

### 4. Password Input with Strength Validation

```jsx
import { useState } from 'react';
import { validatePassword, getValidationError } from '../utils/validationUtils';

function PasswordInput() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleBlur = () => {
    if (password && !validatePassword(password)) {
      setError(getValidationError('Password', 'password'));
    } else {
      setError('');
    }
  };

  return (
    <div>
      <label className="block text-white/90 text-sm font-medium mb-2">
        Password *
      </label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (error) setError('');
          }}
          onBlur={handleBlur}
          className={`w-full px-3 py-2 bg-white/10 border rounded-lg text-white pr-10 ${
            error ? 'border-red-400' : 'border-white/20'
          }`}
          placeholder="Enter password"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
        >
          {showPassword ? '👁️' : '👁️‍🗨️'}
        </button>
      </div>
      {error && <p className="text-red-300 text-xs mt-1">⚠ {error}</p>}
      <p className="text-white/60 text-xs mt-1">
        Min 8 chars, uppercase, lowercase, number
      </p>
    </div>
  );
}

export default PasswordInput;
```

---

### 5. Date Input with Future Date Validation

```jsx
import { useState } from 'react';
import { validateFutureDate, getValidationError } from '../utils/validationUtils';

function FutureDateInput() {
  const [date, setDate] = useState('');
  const [error, setError] = useState('');

  const handleBlur = () => {
    if (date && !validateFutureDate(date)) {
      setError(getValidationError('Date', 'futureDate'));
    } else {
      setError('');
    }
  };

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div>
      <label className="block text-white/90 text-sm font-medium mb-2">
        Select Date *
      </label>
      <input
        type="date"
        value={date}
        onChange={(e) => {
          setDate(e.target.value);
          if (error) setError('');
        }}
        onBlur={handleBlur}
        min={minDate}
        className={`w-full px-3 py-2 bg-white/10 border rounded-lg text-white ${
          error ? 'border-red-400' : 'border-white/20'
        }`}
      />
      {error && <p className="text-red-300 text-xs mt-1">⚠ {error}</p>}
    </div>
  );
}

export default FutureDateInput;
```

---

### 6. Checkbox with Validation

```jsx
import { useState } from 'react';

function TermsCheckbox() {
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setAccepted(e.target.checked);
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!accepted) {
      setError('You must accept the terms and conditions');
      return;
    }
    console.log('Form submitted');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={accepted}
          onChange={handleChange}
          className={`w-4 h-4 mt-1 rounded border-2 ${
            error ? 'border-red-400' : 'border-white/20'
          }`}
        />
        <label className="text-white/90 text-sm">
          I accept the{' '}
          <a href="/terms" className="text-blue-400 hover:text-blue-300">
            Terms and Conditions
          </a>
          *
        </label>
      </div>
      {error && <p className="text-red-300 text-xs">⚠ {error}</p>}
      
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
      >
        Submit
      </button>
    </form>
  );
}

export default TermsCheckbox;
```

---

### 7. Number Input with Range Validation

```jsx
import { useState } from 'react';
import { validateNumber, getValidationError } from '../utils/validationUtils';

function AgeInput() {
  const [age, setAge] = useState('');
  const [error, setError] = useState('');

  const handleBlur = () => {
    if (age && !validateNumber(age, 18, 120)) {
      setError('Age must be between 18 and 120');
    } else {
      setError('');
    }
  };

  return (
    <div>
      <label className="block text-white/90 text-sm font-medium mb-2">
        Age *
      </label>
      <input
        type="number"
        value={age}
        onChange={(e) => {
          setAge(e.target.value);
          if (error) setError('');
        }}
        onBlur={handleBlur}
        min="18"
        max="120"
        className={`w-full px-3 py-2 bg-white/10 border rounded-lg text-white ${
          error ? 'border-red-400' : 'border-white/20'
        }`}
        placeholder="Enter your age"
      />
      {error && <p className="text-red-300 text-xs mt-1">⚠ {error}</p>}
    </div>
  );
}

export default AgeInput;
```

---

### 8. Using ValidatedInput Component

```jsx
import { useState } from 'react';
import ValidatedInput from '../components/ValidatedInput';

function BookingForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});

  return (
    <form className="space-y-4">
      <ValidatedInput
        type="text"
        name="name"
        label="Full Name"
        value={formData.name}
        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        error={errors.name}
        validationType="name"
        required={true}
        placeholder="John Doe"
      />

      <ValidatedInput
        type="email"
        name="email"
        label="Email Address"
        value={formData.email}
        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
        error={errors.email}
        validationType="email"
        required={true}
        placeholder="your@email.com"
      />

      <ValidatedInput
        type="tel"
        name="phone"
        label="Phone Number"
        value={formData.phone}
        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
        error={errors.phone}
        validationType="phone"
        required={true}
        placeholder="+1 (555) 123-4567"
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold"
      >
        Submit
      </button>
    </form>
  );
}

export default BookingForm;
```

---

### 9. Form-Level Validation with Schema

```jsx
import { useState } from 'react';
import { validateForm } from '../utils/validationUtils';

function RegistrationForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const validationSchema = {
    username: { type: 'username', options: { required: true } },
    email: { type: 'email', options: { required: true } },
    password: { type: 'password', options: { required: true } }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const { isValid, errors: validationErrors } = validateForm(formData, validationSchema);
    
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }
    
    console.log('Form is valid, submitting...', formData);
    // Submit form
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-white/90 text-sm font-medium mb-2">
          Username *
        </label>
        <input
          type="text"
          value={formData.username}
          onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
          className={`w-full px-3 py-2 bg-white/10 border rounded-lg text-white ${
            errors.username ? 'border-red-400' : 'border-white/20'
          }`}
          placeholder="username"
        />
        {errors.username && <p className="text-red-300 text-xs mt-1">⚠ {errors.username}</p>}
      </div>

      <div>
        <label className="block text-white/90 text-sm font-medium mb-2">
          Email *
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          className={`w-full px-3 py-2 bg-white/10 border rounded-lg text-white ${
            errors.email ? 'border-red-400' : 'border-white/20'
          }`}
          placeholder="your@email.com"
        />
        {errors.email && <p className="text-red-300 text-xs mt-1">⚠ {errors.email}</p>}
      </div>

      <div>
        <label className="block text-white/90 text-sm font-medium mb-2">
          Password *
        </label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
          className={`w-full px-3 py-2 bg-white/10 border rounded-lg text-white ${
            errors.password ? 'border-red-400' : 'border-white/20'
          }`}
          placeholder="••••••••"
        />
        {errors.password && <p className="text-red-300 text-xs mt-1">⚠ {errors.password}</p>}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
      >
        Register
      </button>
    </form>
  );
}

export default RegistrationForm;
```

---

### 10. Input Sanitization Example

```jsx
import { sanitizeInput, normalizeInput } from '../utils/validationUtils';

function SafeInput() {
  const handleUserInput = (userInput) => {
    // Prevent XSS
    const safe = sanitizeInput(userInput);
    
    // Normalize whitespace
    const normalized = normalizeInput(safe);
    
    console.log('Safe input:', normalized);
  };

  return (
    <input
      type="text"
      onChange={(e) => handleUserInput(e.target.value)}
      placeholder="Type something..."
    />
  );
}

export default SafeInput;
```

---

## 🎯 Quick Integration Steps

1. **Copy the snippet** you need
2. **Paste into your component**
3. **Import validation utilities** at the top
4. **Customize as needed** (colors, messages, etc.)
5. **Test with sample data**

---

## 📝 Notes

- All snippets use Tailwind CSS classes
- Adjust styling to match your design
- Customize error messages as needed
- Test thoroughly before production
- Remember to validate on the server too!

---

**Last Updated:** December 4, 2025
