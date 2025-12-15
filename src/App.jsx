// src/App.jsx
import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';
import FullscreenMenu from './pages/FullscreenMenu';
import BottomNav from './pages/BottomNav';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import Personalized from './pages/servicespage/Personalized';
import Seamless from './pages/servicespage/Seamless';
import Sitting from './pages/servicespage/Sitting';
import Beauty from './pages/servicespage/Beauty';
import Tour from './pages/servicespage/Tour';
import { FaWhatsapp, FaInstagram, FaHeart } from 'react-icons/fa';
import ContactPage from './pages/ContactPage';
import Personal from './pages/PersonalCurator';
import PersonalCuratorForm from './pages/PersonalCuratorForm';
import GalleryPage from './pages/GalleryPage';
import WishlistPage from './pages/WishlistPage';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';
import TermsAndConditions from './pages/TermsAndConditions';
import AuthModal from './components/AuthModal';
import MyAccountDropdown from './components/MyAccountDropdown';
import Footer from './components/Footer';
import LanguageToggle from './components/ui/toggle';
import { translations } from './data/translations';
import { LanguageContext } from './context/LanguageContext';
import { useContext } from 'react';
import FloatingSocial from './components/FloatingSocial';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { useWishlist } from './hooks/useWishlist';
import { useTranslation } from './hooks/useTranslation';

// Responsive bottom nav wrapper: renders BottomNav only on desktop (width>=768px) and scrolls with content
function ResponsiveBottomNav(props) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }
    handleResize(); // initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobile) return null;

  return (
    <div className="relative w-full z-30 pointer-events-auto -mt-20 mb-8">
      <BottomNav {...props} />
    </div>
  );
}

function AnimatedIntro({ onFinish }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), 2500);
    const finishTimer = setTimeout(onFinish, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <img src="/logo.png" alt="Logo" className="w-56 animate-bounce-in" />
    </div>
  );
}

function Home() {
  const { isAuthenticated, loading } = useAuth();
  const { getWishlistCount } = useWishlist();
  const { t } = useTranslation();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDropdownHovered, setDropdownHovered] = useState(false);
  const [isFullMenuOpen, setFullMenuOpen] = useState(false);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const navigate = useNavigate();

  return (
    <div className="relative w-full min-h-screen overflow-auto hide-scrollbar">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content Wrapper */}
      <div>
        {/* Hamburger menu */}
        <FullscreenMenu isOpen={isFullMenuOpen} setIsOpen={setFullMenuOpen} />

        {/* Top Navigation Bar - Responsive */}
        <div className="fixed top-5 right-5 z-20 flex items-center gap-3 flex-wrap justify-end max-w-[90%]">
          {/* Wishlist Button */}
          <button
            onClick={() => navigate('/wishlist')}
            className="flex items-center gap-2 bg-white/20 backdrop-blur-lg border border-white/30 text-white font-medium py-2 px-4 rounded-full shadow-lg transition-all duration-300 hover:bg-white/30 hover:scale-105 whitespace-nowrap"
          >
            <div className="relative">
              <FaHeart className="text-red-400" />
              {getWishlistCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {getWishlistCount()}
                </span>
              )}
            </div>
            <span className="text-sm">{t.wishlist}</span>
          </button>

          {/* Conditional Authentication Button */}
          {!loading && (
            <>
              {isAuthenticated ? (
                /* My Account Dropdown */
                <MyAccountDropdown />
              ) : (
                /* Login/Signup Button */
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setAuthModalOpen(true);
                  }}
                  className="w-fit flex items-center justify-center gap-2 
                             bg-amber-500/50 backdrop-blur-lg 
                             border border-amber-400/70 
                             text-white font-semibold py-2 px-6 
                             rounded-full shadow-lg 
                             hover:bg-amber-500/80 
                             transition duration-300 
                             hover:shadow-[0_0_20px_rgba(251,191,36,0.6)] 
                             hover:scale-105 whitespace-nowrap"
                >
                  {t.loginSignUp}
                </button>
              )}
            </>
          )}

          {/* Language Toggle */}
          <LanguageToggle />
        </div>

        {/* Main page content */}
        <div className="relative flex flex-col font-slab items-center justify-start min-h-screen text-center text-white pt-36 pb-20">
          <img src="logo.png" alt="Logo here" className="mb-2 w-56" />

          <h1 className="text-3xl font-bold mb-2 tracking-wide font-premium">
            {t.experienceRomeAsLocal}
          </h1>
          {t.ultimateRomanHoliday}
          <p className="text-lg max-w-2xl mb-6 font-slab"></p>

          <button
            onClick={() => navigate('/personal')}
            className="
            relative px-6 py-3 text-lg font-semibold rounded-full
            bg-gradient-to-r from-[#c96451] via-[#e97e5a] to-[#c96451]
            text-white shadow-lg overflow-hidden
            transition-transform duration-300
            hover:scale-105 hover:-translate-y-1
          "
          >
            {/* Shine Sweep Animation */}
            <span
              className="
            absolute top-0 left-[-100%] w-[70%] h-full
            bg-gradient-to-r from-white/30 to-transparent
            skew-x-12
            animate-[shine_2.5s_linear_infinite]
          "
            ></span>

            {/* Outer Glow */}
            <span
              className="
            absolute inset-0 rounded-full
            shadow-[0_0_15px_4px_rgba(201,100,81,0.6)]
            pointer-events-none
          "
            ></span>

            {/* Glowing Border Effect */}
            <span
              className="
            absolute inset-0 rounded-full border border-[#fcc266]/70
            animate-[pulseBorder_3s_ease-in-out_infinite]
          "
            ></span>

            {t.getStarted}
          </button>

          {/* NOTE: BottomNav was moved to fixed position (see ResponsiveBottomNav) */}
          {/* The content no longer needs to reserve space for the nav here */}
          {/* You can keep other content below as usual */}

          <style>{`
            @keyframes shine {
              0% { left: -100%; }
              60% { left: 150%; }
              100% { left: 150%; }
            }
            @keyframes pulseBorder {
              0%, 100% { opacity: 0.3; transform: scale(1); }
              50% { opacity: 0.7; transform: scale(1.05); }
            }
          `}</style>
        </div>
      </div>


      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />

      {/* Desktop Bottom Navigation (above footer) */}
      {!isFullMenuOpen && (
        <ResponsiveBottomNav setServicesHovered={setDropdownHovered} />
      )}

      {/* Footer - at the bottom of content */}
      <Footer />

      {/* Floating Social Icons */}
      <FloatingSocial />

      {/* Hide scrollbar styles */}
      <style>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

function PageTemplate({ title }) {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white">
      <h2 className="text-3xl mb-12">{title}</h2>
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/personalized" element={<Personalized />} />
            <Route path="/seamless" element={<Seamless />} />
            <Route path="/sitting" element={<Sitting />} />
            <Route path="/beauty" element={<Beauty />} />
            <Route path="/tour" element={<Tour />} />
            <Route path="/personal" element={<Personal />} />
            <Route path="/personal-curator-form" element={<PersonalCuratorForm />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/gallery/:category" element={<GalleryPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-cancel" element={<PaymentCancel />} />
          </Routes>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}
