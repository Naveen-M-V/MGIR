import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaChevronLeft, FaHome } from 'react-icons/fa';
import { useTranslation } from '../hooks/useTranslation';

export default function BackButton({ variant = 'default', className = '' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);
  const [isHomeHovered, setIsHomeHovered] = useState(false);

  // Get breadcrumb path
  const pathSegments = location.pathname.split('/').filter(Boolean);

  // Format page name
  const formatPageName = (path) =>
    path
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/');
  };

  const handleHome = () => {
    navigate('/');
  };

  // Variant styles
  const variants = {
    default: {
      container: 'fixed top-20 sm:top-24 md:top-32 left-4 sm:left-6 md:left-8 z-40',
      button:
        'group relative overflow-hidden bg-gradient-to-r from-amber-500/90 to-orange-600/90 backdrop-blur-xl border-2 border-amber-400/50 text-white rounded-2xl shadow-2xl hover:shadow-amber-500/50 transition-all duration-500',
      size: 'px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3',
    },
    floating: {
      container: 'fixed top-20 sm:top-24 md:top-32 left-4 sm:left-6 md:left-8 z-40',
      button:
        'group relative overflow-hidden bg-white/10 backdrop-blur-2xl border border-white/30 text-white rounded-full shadow-2xl hover:shadow-white/30 transition-all duration-500 hover:bg-white/20',
      size: 'px-4 py-2 sm:px-5 sm:py-2.5 md:px-5 md:py-3',
    },
    minimal: {
      container: 'fixed top-20 sm:top-24 md:top-32 left-4 sm:left-6 md:left-8 z-40',
      button:
        'group relative overflow-hidden bg-black/40 backdrop-blur-md border border-amber-400/30 text-amber-400 rounded-xl shadow-lg hover:shadow-amber-400/40 transition-all duration-500 hover:border-amber-400/70',
      size: 'px-4 py-2 sm:px-5 sm:py-2.5 md:px-5 md:py-2.5',
    },
    glass: {
      container: 'fixed top-20 sm:top-24 md:top-32 left-4 sm:left-6 md:left-8 z-40',
      button:
        'group relative overflow-hidden bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl border border-white/40 text-white rounded-3xl shadow-2xl hover:shadow-white/40 transition-all duration-500 hover:from-white/30 hover:to-white/10',
      size: 'px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3',
    },
  };

  const currentVariant = variants[variant] || variants.default;

  return (
    <div className={`${currentVariant.container} ${className}`}>
      <div className="flex items-center gap-3">
        {/* Back Button */}
        <button
          onClick={handleBack}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`${currentVariant.button} ${currentVariant.size} flex items-center gap-3 transform hover:scale-105 hover:-translate-x-1 active:scale-95`}
          aria-label="Go back"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-x" />
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          <div className="relative flex items-center gap-3">
            <div className="relative">
              <FaChevronLeft
                className={`text-lg transition-all duration-300 ${
                  isHovered ? 'animate-bounce-x' : ''
                }`}
              />
              <div className="absolute inset-0 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <FaChevronLeft className="text-lg text-white" />
              </div>
            </div>
            <span className="font-semibold text-xs sm:text-sm tracking-wide uppercase">
              {t.back}
            </span>
          </div>
          <div className="absolute inset-0 rounded-2xl border-2 border-white/50 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
        </button>

        {/* Breadcrumb separator */}
        <div className="flex items-center gap-3 animate-fade-in">
          <div className="flex items-center gap-1">
            
          </div>

          {/* Home Button (updated to match Back button hover animation) 
          <button
            onClick={handleHome}
            onMouseEnter={() => setIsHomeHovered(true)}
            onMouseLeave={() => setIsHomeHovered(false)}
            className={`${currentVariant.button} ${currentVariant.size} flex items-center gap-3 transform hover:scale-105 hover:-translate-x-1 active:scale-95`}
            aria-label="Go to home"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-x" />
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <div className="relative flex items-center gap-3">
              <div className="relative">
                <FaHome
                  className={`text-base transition-all duration-300 ${
                    isHomeHovered ? 'animate-bounce-x' : ''
                  }`}
                />
                <div className="absolute inset-0 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <FaHome className="text-base text-white" />
                </div>
              </div>
              <span className="font-semibold text-sm tracking-wide uppercase hidden sm:inline">
                Home
              </span>
            </div>
            <div className="absolute inset-0 rounded-2xl border-2 border-white/50 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
          </button> */}
        </div> 
      </div>

      {/* Breadcrumb Trail 
      {pathSegments.length > 0 && (
        <div className="mt-3 flex items-center gap-2 text-xs text-white/70 font-medium animate-slide-down">
          <FaHome className="text-amber-400" />
          <span className="text-amber-400">/</span>
          {pathSegments.map((segment, index) => (
            <React.Fragment key={segment}>
              <span
                className={`${
                  index === pathSegments.length - 1
                    ? 'text-white font-bold'
                    : 'text-white/60'
                } transition-colors duration-300`}
              >
                {formatPageName(segment)}
              </span>
              {index < pathSegments.length - 1 && (
                <span className="text-amber-400">/</span>
              )}
            </React.Fragment>
          ))}
        </div>
      )} */}

      {/* Animations */}
      <style>{`
        @keyframes bounce-x {
          0%,
          100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(-4px);
          }
        }

        @keyframes gradient-x {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-bounce-x {
          animation: bounce-x 0.6s ease-in-out infinite;
        }

        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .animate-slide-down {
          animation: slide-down 0.5s ease-out;
        }

        .delay-100 {
          animation-delay: 0.1s;
        }

        .delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
    </div>
  );
}
