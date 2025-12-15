import React, { useState } from 'react';
import { validateFormField, getValidationError } from '../utils/validationUtils';

/**
 * Reusable ValidatedInput Component
 * Provides automatic validation, error messages, and visual feedback
 */
export function ValidatedInput({
  type = 'text',
  name,
  label,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  placeholder,
  className = '',
  validationType = 'text',
  validationOptions = {},
  showErrorMessage = true,
  disabled = false,
  ...props
}) {
  const [touched, setTouched] = useState(false);
  const [internalError, setInternalError] = useState('');

  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange(e);
    
    // Real-time validation
    if (touched) {
      const isValid = validateFormField(newValue, validationType, validationOptions);
      if (!isValid && newValue) {
        setInternalError(getValidationError(label || name, validationType, validationOptions));
      } else {
        setInternalError('');
      }
    }
  };

  const handleBlur = (e) => {
    setTouched(true);
    
    // Validate on blur
    const isValid = validateFormField(value, validationType, validationOptions);
    if (!isValid && value) {
      setInternalError(getValidationError(label || name, validationType, validationOptions));
    } else {
      setInternalError('');
    }
    
    if (onBlur) onBlur(e);
  };

  const displayError = error || internalError;
  const isInvalid = touched && displayError;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-white/90 text-sm font-medium mb-2">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      
      <input
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`
          w-full px-3 py-2 bg-white/10 border rounded-lg text-white 
          placeholder-white/50 focus:outline-none transition-all duration-300
          ${isInvalid 
            ? 'border-red-400 focus:border-red-400 focus:ring-1 focus:ring-red-400' 
            : 'border-white/20 focus:border-blue-400 focus:ring-1 focus:ring-blue-400'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${className}
        `}
        {...props}
      />
      
      {showErrorMessage && isInvalid && (
        <p className="text-red-300 text-xs mt-1 flex items-center gap-1">
          <span>⚠</span>
          {displayError}
        </p>
      )}
    </div>
  );
}

export default ValidatedInput;
