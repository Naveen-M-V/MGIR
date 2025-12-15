import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';

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

  // Use provided minDate or allow all dates
  const finalMinDate = minDate;

  const handleDateChange = (e) => {
    const dateStr = e.target.value;
    if (dateStr) {
      const date = new Date(dateStr + 'T00:00:00');
      onSelect(date);
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
      : format(selected, 'MMM dd, yyyy'))
    : placeholder;

  const inputValue = selected 
    ? (Array.isArray(selected) ? '' : selected.toISOString().split('T')[0])
    : '';

  return (
    <div className={`relative w-full ${className}`}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-white/50 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all duration-300 flex items-center justify-between hover:border-white/40 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="flex items-center gap-2 min-w-0">
          <Calendar className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
          <span className={`${selected ? "text-white" : "text-white/50"} truncate text-sm`}>
            {displayText}
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-slate-900 border border-white/20 rounded-lg shadow-xl p-2 backdrop-blur-xl">
          <input
            type="date"
            value={inputValue}
            onChange={handleDateChange}
            min={getMinDateString()}
            max={getMaxDateString()}
            disabled={disabled}
            className="w-full px-2 py-1.5 bg-white/10 border border-white/20 rounded-md text-white text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
            style={{
              colorScheme: 'dark'
            }}
          />
        </div>
      )}
    </div>
  );
}

export default ModernDatePicker;
