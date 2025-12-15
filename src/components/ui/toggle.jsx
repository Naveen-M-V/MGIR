import React, { useState, useEffect, useContext } from "react";
import { LanguageContext } from "../../context/LanguageContext";

export default function LanguageToggle() {
  const { language, changeLanguage } = useContext(LanguageContext);
  const [index, setIndex] = useState(0);

  const options = [
    {
      code: "EN",
      label: "EN",
      flag: <img src="https://flagcdn.com/gb.svg" className="w-4 h-4 rounded-full" />,
    },
    {
      code: "ES",
      label: "ES",
      flag: <img src="https://flagcdn.com/es.svg" className="w-4 h-4 rounded-full" />,
    },
    {
      code: "RU",
      label: "RU",
      flag: (
        <div className="w-4 h-4 rounded-full overflow-hidden">
          <div className="w-full h-full">
            <div className="w-full h-1/3 bg-white"></div>
            <div className="w-full h-1/3 bg-blue-600"></div>
            <div className="w-full h-1/3 bg-red-600"></div>
          </div>
        </div>
      ),
    },
  ];

  // Initialize index based on current language
  useEffect(() => {
    const currentIndex = options.findIndex(opt => opt.code === language);
    setIndex(currentIndex !== -1 ? currentIndex : 0);
  }, [language]);

  const handleLanguageChange = (i) => {
    setIndex(i);
    changeLanguage(options[i].code);
  };

  return (
    <div
      className="
        relative w-32 h-11      /* Slightly taller capsule */
        rounded-full cursor-pointer select-none
        bg-white/20 backdrop-blur-xl 
        border border-white/30
        shadow-[0_4px_10px_rgba(0,0,0,0.15)]
        flex items-center justify-between px-4
        overflow-hidden          /* FIX: prevents glow overflow */
        transition-all duration-300
        z-[9999]
      "
    >
      {/* Labels */}
      <div className="flex justify-between w-full text-white font-medium text-base">
        {options.map((option, i) => (
          <span
            key={i}
            onClick={() => handleLanguageChange(i)}
            className="cursor-pointer transition-opacity"
            style={{ opacity: index === i ? "1" : "0.5" }}
          >
            {option.label}
          </span>
        ))}
      </div>

      {/* Sliding knob */}
      <div
        className="
          absolute top-1/2 -translate-y-1/2 
          w-9 h-9 rounded-full     /* Smaller knob so edges are smooth */
          bg-white/90 backdrop-blur-xl
          border border-white/40
          shadow-[0_2px_5px_rgba(0,0,0,0.15)]
          transition-all duration-300
          flex items-center justify-center
        "
        style={{
          left:
            index === 0
              ? "4px"
              : index === 1
              ? "calc(50% - 18px)"
              : "calc(100% - 40px)",
        }}
      >
        {options[index].flag}
      </div>
    </div>
  );
}
