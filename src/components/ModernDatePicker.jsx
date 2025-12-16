import React, { useState, useRef } from 'react';
import { format } from 'date-fns';
import { Calendar, X } from 'lucide-react';

export function ModernDatePicker({ 
  selected, 
  onSelect, 
  minDate = null,
  maxDate = null,
  placeholder = "Select a date",
  disabled = false,
  className = "",
  mode = "single"
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);

  // Use provided minDate or allow all dates
  const finalMinDate = minDate;

  // Initialize inputValue when selected changes
  React.useEffect(() => {
    if (selected && selected instanceof Date && !isNaN(selected.getTime())) {
      setInputValue(selected.toISOString().split('T')[0]);
    } else {
      setInputValue('');
    }
  }, [selected]);

  const handleDateChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (value) {
      const date = new Date(value + 'T00:00:00');
      if (!isNaN(date.getTime())) {
        onSelect(date);
      }
    }
  };

  const handleClear = () => {
    setInputValue('');
    onSelect(null);
    setIsOpen(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      setIsOpen(false);
    }
  };

  // Get min and max date strings for input
  const getMinDateString = () => {
    if (!finalMinDate) return '';
    const date = new Date(finalMinDate);
    return date.toISOString().split('T')[0];
  };

  const getMaxDateString = () => {
    if (!maxDate) return '';
    return maxDate.toISOString().split('T')[0];
  };

  const displayText = selected 
    ? (Array.isArray(selected) 
      ? `${selected.length} date(s) selected`
      : format(selected, 'dd/MM/yyyy'))
    : placeholder;

  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="date"
          value={inputValue}
          onChange={handleDateChange}
          onKeyPress={handleKeyPress}
          min={getMinDateString()}
          max={getMaxDateString()}
          disabled={disabled}
          placeholder={placeholder}
          className="w-full px-3 py-2 pr-10 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-white/50 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all duration-300 hover:border-white/40 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            colorScheme: 'dark'
          }}
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {selected && (
            <button
              type="button"
              onClick={handleClear}
              disabled={disabled}
              className="p-1 text-white/50 hover:text-white/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            className="p-1 text-amber-400 hover:text-amber-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Calendar className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModernDatePicker;
