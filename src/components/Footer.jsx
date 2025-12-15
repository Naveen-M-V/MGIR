import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="relative w-full mt-auto overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-10 right-1/4 w-48 h-48 bg-orange-400/10 rounded-full blur-3xl animate-pulse delay-500" />
        <div className="absolute -bottom-16 right-10 w-56 h-56 bg-yellow-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Main footer container */}
      <div className="relative backdrop-blur-xl bg-gradient-to-br from-black/80 via-black/70 to-black/60 border-t border-amber-400/20 shadow-2xl">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8">

          {/* ⭐ Logo Section ⭐ */}
          <div className="flex flex-col items-center justify-center mb-4 sm:mb-6 relative">
            <div className="absolute w-48 sm:w-64 h-48 sm:h-64 rounded-full bg-amber-400/20 blur-3xl animate-pulse" />
            <img
              src="/logo.png"
              alt="myguideinrome logo"
              className="w-24 sm:w-32 md:w-40 h-auto relative z-10 animate-logoPulse"
            />
            <div className="flex gap-2 mt-2 sm:mt-3 animate-shimmer">
              <div className="w-2 sm:w-3 h-2 sm:h-3 bg-amber-400 rounded-full"></div>
              <div className="w-2 sm:w-3 h-2 sm:h-3 bg-amber-400 rounded-full"></div>
              <div className="w-2 sm:w-3 h-2 sm:h-3 bg-amber-400 rounded-full"></div>
            </div>
          </div>

          {/* Footer links */}
          <div className="pt-4 sm:pt-6">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-4 text-white/60 text-xs sm:text-sm">
              <span className='hover:text-amber-300 transition-colors'>{t.contactAddress}</span>
              <span className="text-amber-400/50">•</span>
              <span className="hover:text-amber-300 transition-colors">{t.allRightsReserved}</span>
              <span className="text-amber-400/50">•</span>
              <span className="hover:text-amber-300 transition-colors">{t.pIva}</span>
              <span className="text-amber-400/50">•</span>
              <span className="hover:text-amber-300 transition-colors">{t.address}</span>
              <span className="text-amber-400/50">•</span>
              <span className="hover:text-amber-300 transition-colors">{t.company}</span>
              <span className="text-amber-400/50">•</span>
              <span className="hover:text-amber-300 transition-colors">{t.privacyPolicy}</span>
              <span className="text-amber-400/50">•</span>
              <Link to="/terms-and-conditions" className="hover:text-amber-300 transition-colors">{t.termsAndConditions}</Link>
            </div>

          </div>

        </div>
      </div>

      {/* Custom CSS */}
      <style>{`
        /* Logo pulse animation */
        @keyframes logoPulse {
          0% { filter: drop-shadow(0 0 4px #ffa93a); }
          50% { filter: drop-shadow(0 0 14px #ffb84d); }
          100% { filter: drop-shadow(0 0 4px #ffa93a); }
        }
        .animate-logoPulse {
          animation: logoPulse 3.5s ease-in-out infinite;
        }

        /* Shimmer for dots */
        @keyframes shimmer {
          0% { opacity: 0.4; }
          50% { opacity: 1; }
          100% { opacity: 0.4; }
        }
        .animate-shimmer {
          animation: shimmer 2.5s ease-in-out infinite;
        }

        .delay-500 { animation-delay: 500ms; }
        .delay-1000 { animation-delay: 1000ms; }

      `}</style>
    </footer>
  );
};

export default Footer;
