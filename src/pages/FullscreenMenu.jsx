import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "../hooks/useTranslation";
import {
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";

const MENU_SECTIONS = [
  {
    label: "ABOUT US",
    route: "/about",
    subsections: ["About Us"],
  },
  
  {
    label: "OUR SERVICES",
    route: "/services",
    subsections: [
      { name: "Personal Curator", route: "/personal" },
      { name: "Personal Companion", route: "/personalized" },
      { name: "Our Tours", route: "/tour" },
      { name: "Car Services", route: "/seamless" },
      { name: "Sitting Services", route: "/sitting" },
      { name: "Beauty Services", route: "/beauty" },
      { name: "Personal Companion", route: "/personalized" },
      { name: "Our Tours", route: "/tour" },
      { name: "Car Services", route: "/seamless" },
      { name: "Sitting Services", route: "/sitting" },
      { name: "Beauty Services", route: "/beauty" },
    ],
  },
  {
    label: "PERSONAL CURATOR",
    route: "/personal",
    subsections: [{ name: "Personal Curator", route: "/personal" }],
  },
  {
    label: "GALLERY",
    route: "/gallery",
    subsections: [
      { name: "General", route: "/general" },
      { name: "Tour", route: "/tour" },
      { name: "Beauty", route: "/beauty" },
    ],
  },
  {
    label: "CONTACT US",
    route: "/contact",
    subsections: ["Contact Us"],
  },
];

// Sidebar for mobile
function MobileSidebar({ isOpen, setIsOpen, menuSections }) {
  const [expandedSection, setExpandedSection] = useState(null);

  const sidebarVariants = {
    hidden: { x: "-100%" },
    visible: { x: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { x: "-100%", transition: { duration: 0.3 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={sidebarVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed top-0 left-0 z-50 w-72 sm:w-80 max-w-[90vw] h-full bg-[#121212] text-white shadow-lg flex flex-col px-0 pb-6 pt-6 md:hidden"
        >
          
          {/* Overlay for close */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setIsOpen(false)}
            aria-label="Close sidebar"
          />
          
          <div className="relative z-50 flex flex-col h-full">
            {/* Logo and Close Button */}
            <div className="flex justify-between items-center mb-2 sm:mb-3 relative z-60 px-4">
              <div className="flex-1 flex justify-center">
                <Link to="/">
                  <img 
                    src="logo.png" 
                    alt="Logo" 
                    className="w-16 sm:w-20 md:w-28 cursor-pointer opacity-100 transition-opacity hover:opacity-90" 
                  />
                </Link>
              </div>
              
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-300"
                aria-label="Close sidebar"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Sections */}
            <nav className="flex-grow overflow-y-auto">
              {menuSections.map((section, idx) => (
                <div key={section.label} className="border-b border-white/20">
                  <button
                    onClick={() =>
                      setExpandedSection(expandedSection === idx ? null : idx)
                    }
                    className="w-full flex justify-between items-center text-sm sm:text-base md:text-lg font-bold px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 focus:outline-none hover:text-[#c96451] transition-colors"
                  >
                    <Link
                      to={section.route}
                      onClick={() => setIsOpen(false)}
                      className="hover:text-[#c96451] transition-colors flex-1 text-left"
                    >
                      {section.label}
                    </Link>
                    <span
                      className={`transform transition-transform duration-300 flex-shrink-0 ml-2 ${
                        expandedSection === idx
                          ? "rotate-90 text-[#c96451]"
                          : "rotate-0"
                      }`}
                    >
                      ▶
                    </span>
                  </button>

                  {/* Dropdown subsections */}
                  <AnimatePresence>
                    {expandedSection === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-6 sm:px-8 md:px-10 py-2 bg-white/5"
                      >
                        <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base">
                          {Array.isArray(section.subsections)
                            ? section.subsections.map((item, i) =>
                                typeof item === "string" ? (
                                  <li key={i}>
                                    <Link
                                      to={section.route}
                                      onClick={() => setIsOpen(false)}
                                      className="block px-2 py-2 rounded-lg hover:text-[#c96451] hover:bg-white/10 transition-all"
                                    >
                                      {item}
                                    </Link>
                                  </li>
                                ) : (
                                  <li key={i}>
                                    <Link
                                      to={item.route}
                                      onClick={() => setIsOpen(false)}
                                      className="block px-2 py-2 rounded-lg hover:text-[#c96451] hover:bg-white/10 transition-all"
                                    >
                                      {item.name}
                                    </Link>
                                  </li>
                                )
                              )
                            : null}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            {/* Footer Socials */}
            <div className="mt-auto flex justify-center space-x-8 text-2xl pt-4">
              <a href="https://www.instagram.com/myguideinrome/" className="hover:text-blue-500 transition-colors">
                <FaInstagram />
              </a>
              <a href="https://wa.me/+918072429184" className="hover:text-pink-500 transition-colors">
                <FaWhatsapp />
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function FullscreenMenu({ isOpen, setIsOpen }) {
  const { t } = useTranslation();
  
  // Get translated menu sections
  const getTranslatedMenuSections = () => [
    {
      label: t.aboutUsMenu,
      route: "/about",
      subsections: [t.aboutUsMenu],
    },
    {
      label: t.ourServicesMenu,
      route: "/services",
      subsections: [
        { name: t.personalCuratorSub, route: "/personal" },
        { name: t.personalCompanionSub, route: "/personalized" },
        { name: t.ourToursSub, route: "/tour" },
        { name: t.carServicesSub, route: "/seamless" },
        { name: t.sittingServicesSub, route: "/sitting" },
        { name: t.beautyServicesSub, route: "/beauty" },
      ],
    },
    {
      label: t.personalCuratorMenu,
      route: "/personal",
      subsections: [{ name: t.personalCuratorSub, route: "/personal" }],
    },
    {
      label: t.galleryMenu,
      route: "/gallery",
      subsections: [
        { name: t.generalSub, route: "/general" },
        { name: t.tourSub, route: "/tour" },
        { name: t.beautySub, route: "/beauty" },
      ],
    },
    {
      label: t.contactUsMenu,
      route: "/contact",
      subsections: ["Contact Us"],
    },
  ];
  
  const menuVariants = {
    hidden: { opacity: 0, scale: 1.05 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.4 } },
  };

  const linkVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.5 },
    }),
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 sm:top-12 left-6 sm:left-6 z-50 flex flex-col justify-between w-6 h-4 group"
        aria-label="Toggle menu"
      >
        <motion.span
          animate={isOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.4 }}
          className="block h-0.5 w-full bg-white rounded origin-center group-hover:bg-[#c96451]"
        />
        <motion.span
          animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="block h-0.5 w-full bg-white rounded group-hover:bg-[#c96451]"
        />
        <motion.span
          animate={isOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.4 }}
          className="block h-0.5 w-full bg-white rounded origin-center group-hover:bg-[#c96451]"
        />
      </button>

      {/* MOBILE SIDEBAR */}
      {isMobile ? (
        <MobileSidebar isOpen={isOpen} setIsOpen={setIsOpen} menuSections={getTranslatedMenuSections()} />
      ) : (
        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 text-white flex flex-col items-center justify-center z-40 bg-cover bg-no-repeat"
              style={{ backgroundImage: "url('/hambtn.jpg')" }}
            >
              <div className="absolute inset-0 bg-black/60"></div>

              {/* Logo */}
              <motion.img
                src="logo.png"
                alt="Logo"
                className="w-32 mb-8 relative z-60 opacity-100"
                initial={{ opacity: 1, scale: 1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              />

              {/* Menu Sections */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8 lg:gap-10 text-center text-sm sm:text-base md:text-lg">
                {getTranslatedMenuSections().map((section, i) => (
                  <div key={section.label}>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold mb-4 sm:mb-6 gap-10 relative group cursor-pointer">
                      <Link
                        to={section.route}
                        onClick={() => setIsOpen(false)}
                        className="hover:text-[#FFD700] transition-colors"
                      >
                        {section.label}
                      </Link>
                      <span className="absolute left-0 bottom-0 w-full h-0.5 bg-[#FFD700] scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                    </h3>
                    <ul className="space-y-3">
                      {section.subsections.map((item, j) => {
                        const name = typeof item === "string" ? item : item.name;
                        const route =
                          typeof item === "string"
                            ? section.route
                            : item.route;
                        return (
                          <motion.li
                            key={j}
                            custom={j}
                            variants={linkVariants}
                            initial="hidden"
                            animate="visible"
                            className="relative group cursor-pointer"
                          >
                            <Link
                              to={route}
                              onClick={() => setIsOpen(false)}
                              className="block px-3 py-2 rounded-lg hover:text-[#FFD700] hover:bg-white/10 hover:scale-105 transition-all duration-300"
                            >
                              {name}
                              <span className="absolute left-0 bottom-0 w-full h-0.5 bg-[#FFD700] scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                            </Link>
                          </motion.li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Floating WhatsApp Button 
              <a
                href="https://wa.me/+393518741550"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed right-5 bottom-5 bg-[#25D366] hover:bg-[#1ebe57] rounded-full p-4 shadow-lg flex items-center justify-center text-white text-2xl z-50 transition-colors"
                aria-label="Chat via WhatsApp"
              >
                <FaWhatsapp />
              </a> */}

              {/* Floating Instagram Button (visible when menu is closed) 
              
                <a
                  href="https://www.instagram.com/myguideinrome/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="fixed left-5 bottom-5 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 hover:opacity-90 rounded-full p-4 shadow-lg flex items-center justify-center text-white text-2xl z-50 transition-all"
                  aria-label="Visit Instagram"
                >
                  <FaInstagram />
                </a> */}
             

              
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  );
}
