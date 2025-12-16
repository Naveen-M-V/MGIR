import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

const Footer = () => {
  const { t } = useTranslation();
  const [instagramHovered, setInstagramHovered] = useState(false);
  const [whatsappHovered, setWhatsappHovered] = useState(false);

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
            
            {/* Social Media Icons */}
            <div className="flex gap-4 sm:gap-6 mt-3 sm:mt-4">
              {/* Instagram Icon */}
              <a
                href="https://www.instagram.com/myguideinrome"
                target="_blank"
                rel="noopener noreferrer"
                className={`relative group transition-all duration-300 transform ${
                  instagramHovered ? 'scale-110' : 'hover:scale-105'
                }`}
                onMouseEnter={() => setInstagramHovered(true)}
                onMouseLeave={() => setInstagramHovered(false)}
              >
                <div className={`absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-md opacity-0 group-hover:opacity-70 transition-opacity duration-300 ${
                  instagramHovered ? 'opacity-70' : ''
                }`}></div>
                <div className="relative bg-white/10 backdrop-blur-sm rounded-full p-2 sm:p-2.5 border border-white/20 group-hover:border-white/40 transition-colors duration-300">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/>
                    <path d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a3.999 3.999 0 110-7.998 3.999 3.999 0 010 7.998z"/>
                    <circle cx="18.406" cy="5.594" r="1.44"/>
                  </svg>
                </div>
              </a>

              {/* WhatsApp Icon */}
              <a
                href="https://wa.me/39XXXXXXXXXX"
                target="_blank"
                rel="noopener noreferrer"
                className={`relative group transition-all duration-300 transform ${
                  whatsappHovered ? 'scale-110' : 'hover:scale-105'
                }`}
                onMouseEnter={() => setWhatsappHovered(true)}
                onMouseLeave={() => setWhatsappHovered(false)}
              >
                <div className={`absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 rounded-full blur-md opacity-0 group-hover:opacity-70 transition-opacity duration-300 ${
                  whatsappHovered ? 'opacity-70' : ''
                }`}></div>
                <div className="relative bg-white/10 backdrop-blur-sm rounded-full p-2 sm:p-2.5 border border-white/20 group-hover:border-white/40 transition-colors duration-300">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </div>
              </a>

              {/* Stamp Image with Animation */}
              <div className="relative group">
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
                
                {/* Stamp image */}
                <a
                  href="https://www.tripadvisor.co.uk/Attraction_Review-g187791-d33993227-Reviews-Myguideinrome-Rome_Lazio.html" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <img
                    src="/stamp.png"
                    alt="Official Stamp"
                    className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 object-contain animate-stampFloat group-hover:animate-stampRotate transition-all duration-300"
                  />
                </a>
              </div>
            </div>
            </div>

          {/* Footer links */}
          <div className="pt-1 sm:pt-3">
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
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }

        /* Stamp animations */
        @keyframes stampFloat {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          50% { 
            transform: translateY(-10px) rotate(2deg); 
          }
        }
        @keyframes stampRotate {
          0% { 
            transform: rotate(0deg); 
          }
          100% { 
            transform: rotate(360deg); 
          }
        }
        .animate-stampFloat {
          animation: stampFloat 3s ease-in-out infinite;
        }
        .animate-stampRotate {
          animation: stampRotate 0.5s ease-in-out;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
