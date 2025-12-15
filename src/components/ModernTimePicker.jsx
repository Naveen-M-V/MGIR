import React, { useState, useMemo } from 'react';
import { Clock } from 'lucide-react';

export function ModernTimePicker({ 
  selected = "", 
  onSelect,
  placeholder = "Select a time",
  disabled = false,
  className = "",
  interval = 15, // minutes between slots
  startHour = 0,
  endHour = 24,
  showSeconds = false
}) {
  const [isOpen, setIsOpen] = useState(false);

  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}${showSeconds ? ':00' : ''}`;
        slots.push(timeStr);
      }
    }
    return slots;
  }, [interval, startHour, endHour, showSeconds]);

  const handleSelect = (time) => {
    onSelect(time);
    setIsOpen(false);
  };

  return (
    <div className={`relative w-full ${className}`}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all duration-300 flex items-center justify-between hover:border-white/40 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-400" />
          <span className={selected ? "text-white" : "text-white/50"}>
            {selected || placeholder}
          </span>
        </div>
        <svg className={`w-4 h-4 text-white/60 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 bg-slate-900 border border-white/20 rounded-xl shadow-2xl backdrop-blur-xl max-h-64 overflow-y-auto">
          <div className="grid grid-cols-3 gap-1 p-3">
            {timeSlots.map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => handleSelect(time)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selected === time
                    ? 'bg-emerald-500 text-white shadow-lg scale-105'
                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ModernTimePicker;
