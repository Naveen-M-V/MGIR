import React, { useState } from 'react';

export default function FloatingSocial() {
  const [whatsappHovered, setWhatsappHovered] = useState(false);
  const [instagramHovered, setInstagramHovered] = useState(false);

  return (
    <>
      {/* WhatsApp - Bottom Right */}
      <a
        href="https://wa.me/+393518741550"
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setWhatsappHovered(true)}
        onMouseLeave={() => setWhatsappHovered(false)}
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 group"
        aria-label="WhatsApp"
      >
        <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20">
          {/* Glow effect */}
          <div className={`absolute inset-0 bg-gradient-to-r from-green-400/40 to-emerald-500/40 rounded-full blur-lg transition-all duration-300 ${
            whatsappHovered ? 'scale-125 opacity-100' : 'scale-100 opacity-60'
          }`} />
          
          {/* Button */}
          <div className={`absolute inset-0 transition-all duration-300 flex items-center justify-center transform ${
            whatsappHovered ? 'scale-110 shadow-green-500/50' : 'hover:scale-105'
          }`}>
            <img
              src="/what.png"
              alt="WhatsApp"
              className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 object-contain"
            />
          </div>
        </div>
      </a>

      {/* Instagram - Bottom Left */}
      <a
        href="https://www.instagram.com/myguideinrome/"
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setInstagramHovered(true)}
        onMouseLeave={() => setInstagramHovered(false)}
        className="fixed bottom-6 left-6 sm:bottom-8 sm:left-8 z-40 group"
        aria-label="Instagram"
      >
        <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20">
          {/* Glow effect */}
          <div className={`absolute inset-0 bg-gradient-to-r from-pink-400/40 to-rose-500/40 rounded-full blur-lg transition-all duration-300 ${
            instagramHovered ? 'scale-125 opacity-100' : 'scale-100 opacity-60'
          }`} />
          
          {/* Button */}
          <div className={`absolute inset-0 transition-all duration-300 flex items-center justify-center transform ${
            instagramHovered ? 'scale-110 shadow-pink-500/50' : 'hover:scale-105'
          }`}>
            <img
              src="/insta.png"
              alt="Instagram"
              className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 object-contain"
            />
          </div>
        </div>
      </a>
    </>
  );
}
