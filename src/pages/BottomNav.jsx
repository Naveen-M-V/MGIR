import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../hooks/useTranslation';

export default function BottomNav({ setServicesHovered }) {
  const { pathname } = useLocation();
  const { t, language } = useTranslation();
  const [hoveredItem, setHoveredItem] = useState(null);

  // Links array with labelKey references - will use t object for actual labels
  const linkConfig = [
    { to: '/about', labelKey: 'aboutUs' },
    {
      to: '/services',
      labelKey: 'ourServices',
      hasDropup: true,
      dropupItems: [
        { to: '/personal', labelKey: 'personalCurator' },
        { to: '/personalized', labelKey: 'personalCompanion' },
        { to: '/tour', labelKey: 'ourTours' },
        { to: '/seamless', labelKey: 'carServices' },
        { to: '/sitting', labelKey: 'sittingServices' },
        { to: '/beauty', labelKey: 'beautyServices' },
      ],
    },
    { to: '/personal', labelKey: 'personalCuratorNav' },
    {
      to: '/gallery',
      labelKey: 'galleryNav',
      hasDropup: true,
      dropupItems: [
        { to: '/gallery/general', labelKey: 'general' },
        { to: '/gallery/tour', labelKey: 'tour' },
        { to: '/gallery/beauty', labelKey: 'beautyServices' }
      ],
    },
    { to: '/contact', labelKey: 'contactUsNav' },
  ];

  // Animation variants for dropup
  const dropupVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      y: 20,
      scale: 0.95,
      transition: {
        duration: 0.15,
        ease: 'easeIn',
      },
    },
  };

  const handleMouseEnter = (link) => {
    setHoveredItem(link.to);
    if (
      (link.labelKey === 'ourServices' || link.labelKey === 'galleryNav') &&
      setServicesHovered
    ) {
      setServicesHovered(true);
    }
  };

  const handleMouseLeave = (link) => {
    setHoveredItem(null);
    if (
      link &&
      (link.labelKey === 'ourServices' || link.labelKey === 'galleryNav') &&
      setServicesHovered
    ) {
      setServicesHovered(false);
    }
  };

  return (
    <div
      className="z-30 mx-auto rounded-full bg-white/10 backdrop-blur-lg border border-white/20 relative px-2 sm:px-4"
      style={{
        width: 'fit-content',
        boxShadow: '0 8px 32px rgba(255,255,255,0.1)',
        overflow: 'visible',
      }}
      onMouseLeave={() => {
        setHoveredItem(null);
        if (setServicesHovered) setServicesHovered(false);
      }}
    >
      <nav className="w-full relative" style={{ overflow: 'visible' }}>
        <ul className="flex justify-center space-x-2 sm:space-x-4 md:space-x-6 lg:space-x-8 xl:space-x-12 py-2 sm:py-3 md:py-4 px-2 sm:px-4 relative flex-wrap" style={{ overflow: 'visible' }}>
          {linkConfig.map((link) => (
            <li
              key={link.to}
              className="relative group overflow-visible"
              onMouseEnter={() => handleMouseEnter(link)}
              onMouseLeave={() => handleMouseLeave(link)}
            >
              <Link
                to={link.to}
                className={`relative text-white uppercase text-xs sm:text-sm font-light flex items-center gap-1`}
              >
                <span
                  className={`
                    inline-block
                    transform transition-all duration-500 origin-center
                    group-hover:scale-110 group-hover:text-amber-400
                    group-hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]
                    group-hover:-translate-y-1
                    ${pathname === link.to ? 'font-semibold scale-110 text-amber-400' : ''}`}
                  style={{
                    perspective: '600px',
                    textShadow: pathname === link.to ? '0 0 10px rgba(251,191,36,0.6)' : 'none',
                  }}
                >
                  {t[link.labelKey]}
                </span>
                {link.hasDropup && (
                  <motion.svg
                    animate={{
                      rotate: hoveredItem?.hasDropup ? 180 : 0,
                      y: hoveredItem?.hasDropup ? -2 : 0,
                    }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="w-3 h-3 ml-1 group-hover:text-amber-400 transition-colors duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 15l7-7 7 7"
                    />
                  </motion.svg>
                )}
              </Link>

              {/* Animated underline with glow */}
              <span
                className={`
                  absolute left-0 right-0 -bottom-1 h-0.5 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400
                  w-0 group-hover:w-full transition-all duration-500 origin-center
                  shadow-[0_0_10px_rgba(251,191,36,0.6)]
                  ${pathname === link.to ? 'w-full' : ''}`}
              />

              {/* Pulse effect on hover */}
              <span
                className={`
                  absolute left-1/2 -translate-x-1/2 -bottom-1 h-0.5 bg-amber-400
                  w-0 group-hover:w-full transition-all duration-700 origin-center
                  blur-sm opacity-0 group-hover:opacity-60
                  ${pathname === link.to ? 'w-full opacity-60' : ''}`}
              />

              {/* Dropup menu */}
              <AnimatePresence>
                {hoveredItem === link.to && link.hasDropup && (
                  <motion.div
  variants={dropupVariants}
  initial="hidden"
  animate="visible"
  exit="exit"
  className="absolute bottom-full left-3/2 transform -translate-x-3/2 mb-3 pointer-events-auto"
  style={{
    zIndex: 9999,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',  
    backdropFilter: 'blur(20px)',  
    borderRadius: '10px',  
    border: '1px solid rgba(255, 255, 255, 0.2)',  
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',  
  }}
>
  <div
    className="flex flex-col items-center px-6 py-3 rounded-2xl
                bg-white/20 backdrop-blur-xl border border-white/30
                shadow-[0_4px_10px_rgba(0,0,0,0.15)]"
    style={{ minWidth: '200px' }}
  >
    {link.dropupItems.map((item, idx) => (
      <React.Fragment key={item.to}>
        {idx !== 0 && <div className="w-full border-t border-white/20 my-1" />}
        <Link
          to={item.to}
          className="w-full text-white text-center py-2 font-semibold transition-all
                      hover:bg-gradient-to-r hover:from-amber-400 hover:to-orange-500
                      hover:bg-clip-text hover:text-transparent"
          onClick={() => setHoveredItem(null)}
        >
          {t[item.labelKey]}
        </Link>
      </React.Fragment>
    ))}
  </div>
</motion.div>

                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
