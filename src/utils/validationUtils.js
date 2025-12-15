/**
 * Comprehensive Input Validation Utilities
 * Provides validation functions for all input types across the website
 */

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone number validation (supports international formats)
export const validatePhone = (phone) => {
  const phoneRegex = /^[\d\s\-\+\(\)]{7,}$/;
  return phoneRegex.test(phone.trim());
};

// Name validation (letters, spaces, hyphens, apostrophes)
export const validateName = (name) => {
  const nameRegex = /^[a-zA-Z\s\-']{2,}$/;
  return nameRegex.test(name.trim());
};

// Text field validation (not empty, min length)
export const validateText = (text, minLength = 1) => {
  return text.trim().length >= minLength;
};

// Number validation
export const validateNumber = (num, min = null, max = null) => {
  const number = parseFloat(num);
  if (isNaN(number)) return false;
  if (min !== null && number < min) return false;
  if (max !== null && number > max) return false;
  return true;
};

// Age validation
export const validateAge = (age) => {
  return validateNumber(age, 0, 120);
};

// Date validation
export const validateDate = (date) => {
  if (!date) return false;
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj);
};

// Future date validation
export const validateFutureDate = (date) => {
  if (!validateDate(date)) return false;
  const dateObj = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return dateObj >= today;
};

// Date range validation
export const validateDateRange = (startDate, endDate) => {
  if (!validateDate(startDate) || !validateDate(endDate)) return false;
  return new Date(startDate) < new Date(endDate);
};

// URL validation
export const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Address validation
export const validateAddress = (address) => {
  return validateText(address, 5);
};

// Postal code validation (flexible for international)
export const validatePostalCode = (code) => {
  const codeRegex = /^[a-zA-Z0-9\s\-]{3,}$/;
  return codeRegex.test(code.trim());
};

// Credit card validation (Luhn algorithm)
export const validateCreditCard = (cardNumber) => {
  const sanitized = cardNumber.replace(/\s/g, '');
  if (!/^\d{13,19}$/.test(sanitized)) return false;
  
  let sum = 0;
  let isEven = false;
  
  for (let i = sanitized.length - 1; i >= 0; i--) {
    let digit = parseInt(sanitized[i]);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

// Password validation (min 8 chars, uppercase, lowercase, number)
export const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

// Username validation (alphanumeric, underscore, hyphen, 3-20 chars)
export const validateUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_\-]{3,20}$/;
  return usernameRegex.test(username);
};

// Checkbox validation
export const validateCheckbox = (isChecked) => {
  return isChecked === true;
};

// File validation
export const validateFile = (file, allowedTypes = [], maxSizeMB = 5) => {
  if (!file) return false;
  
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return false;
  }
  
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) return false;
  
  return true;
};

// Compound validation for forms
export const validateFormField = (value, type, options = {}) => {
  const { required = true, minLength, maxLength, min, max, pattern } = options;
  
  // Check if required
  if (required && !value) return false;
  
  // If not required and empty, it's valid
  if (!required && !value) return true;
  
  // Type-specific validation
  switch (type) {
    case 'email':
      return validateEmail(value);
    case 'phone':
      return validatePhone(value);
    case 'name':
      return validateName(value);
    case 'age':
      return validateAge(value);
    case 'date':
      return validateDate(value);
    case 'futureDate':
      return validateFutureDate(value);
    case 'address':
      return validateAddress(value);
    case 'url':
      return validateUrl(value);
    case 'password':
      return validatePassword(value);
    case 'username':
      return validateUsername(value);
    case 'number':
      return validateNumber(value, min, max);
    case 'text':
      return validateText(value, minLength || 1);
    case 'checkbox':
      return validateCheckbox(value);
    default:
      // Generic text validation
      if (minLength && value.length < minLength) return false;
      if (maxLength && value.length > maxLength) return false;
      if (pattern && !new RegExp(pattern).test(value)) return false;
      return true;
  }
};

// Get error message for validation failure
export const getValidationError = (fieldName, type, options = {}) => {
  const { required = true, minLength, maxLength, min, max } = options;
  
  switch (type) {
    case 'email':
      return `Please enter a valid email address (e.g., user@example.com)`;
    case 'phone':
      return `Please enter a valid phone number`;
    case 'name':
      return `Name must contain only letters, spaces, hyphens, and apostrophes (min 2 characters)`;
    case 'age':
      return `Age must be between 0 and 120`;
    case 'date':
      return `Please select a valid date`;
    case 'futureDate':
      return `Please select a future date`;
    case 'address':
      return `Please enter a valid address (min 5 characters)`;
    case 'url':
      return `Please enter a valid URL`;
    case 'password':
      return `Password must be at least 8 characters with uppercase, lowercase, and numbers`;
    case 'username':
      return `Username must be 3-20 characters (letters, numbers, underscore, hyphen)`;
    case 'number':
      return `Please enter a valid number${min !== null ? ` (min: ${min})` : ''}${max !== null ? ` (max: ${max})` : ''}`;
    case 'text':
      return `${fieldName} must be at least ${minLength || 1} characters`;
    case 'checkbox':
      return `Please accept ${fieldName}`;
    default:
      if (required) return `${fieldName} is required`;
      if (minLength) return `${fieldName} must be at least ${minLength} characters`;
      if (maxLength) return `${fieldName} must not exceed ${maxLength} characters`;
      return `Invalid ${fieldName}`;
  }
};

// Sanitize input to prevent XSS
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Trim and normalize whitespace
export const normalizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/\s+/g, ' ');
};

// Validate entire form object
export const validateForm = (formData, validationSchema) => {
  const errors = {};
  
  Object.keys(validationSchema).forEach((fieldName) => {
    const schema = validationSchema[fieldName];
    const value = formData[fieldName];
    
    if (!validateFormField(value, schema.type, schema.options)) {
      errors[fieldName] = getValidationError(fieldName, schema.type, schema.options);
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export default {
  validateEmail,
  validatePhone,
  validateName,
  validateText,
  validateNumber,
  validateAge,
  validateDate,
  validateFutureDate,
  validateDateRange,
  validateUrl,
  validateAddress,
  validatePostalCode,
  validateCreditCard,
  validatePassword,
  validateUsername,
  validateCheckbox,
  validateFile,
  validateFormField,
  getValidationError,
  sanitizeInput,
  normalizeInput,
  validateForm
};
