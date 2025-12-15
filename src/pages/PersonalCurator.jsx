import React, { useState, useEffect, useRef, useContext } from "react";
import { X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import FullscreenMenu from "./FullscreenMenu";
import TopNav from "../components/TopNav";
import BackButton from "../components/BackButton";
import Footer from "../components/Footer";
import FloatingSocial from "../components/FloatingSocial";
import paymentService from "../services/paymentService";
import { ModernDatePicker } from "../components/ModernDatePicker";
import { ModernTimePicker } from "../components/ModernTimePicker";
import { personalCuratorTranslations } from "../locales/personalCuratorTranslations";
import { LanguageContext } from "../context/LanguageContext";

export default function Personal() {
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);
  
  // Map global language codes to translation keys
  const langMap = { 'EN': 'en', 'ES': 'es', 'RU': 'ru' };
  const currentLang = langMap[language] || 'en';
  const t = personalCuratorTranslations[currentLang];
  const [isFullMenuOpen, setFullMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef(null);
  const progressBarRef = useRef(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [detailsStep, setDetailsStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [peopleCount, setPeopleCount] = useState(2);
  const [isImageFlowOpen, setIsImageFlowOpen] = useState(false);
  const [imageStep, setImageStep] = useState(1);
  const imageSources = ["/image-step-1.png", "/image-step-2.png", "/image-step-3.png"]; // replace with your actual asset paths
  const [callDate, setCallDate] = useState("");
  const [callTime, setCallTime] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Video control functions
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const skipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
    }
  };

  const skipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(videoRef.current.duration, videoRef.current.currentTime + 10);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleProgressBarClick = (e) => {
    if (videoRef.current && progressBarRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = pos * videoRef.current.duration;
    }
  };

  const handlePayment = async () => {
    try {
      const orderResponse = await paymentService.createOrder({
        amount: 100,
        currency: 'EUR',
        description: 'Personal Curator Service',
        serviceType: 'personal_curator',
        customerName: 'Guest',
        customerEmail: 'guest@example.com',
        customerPhone: '0000000000',
        bookingDetails: {
          callDate,
          callTime,
          selectedPackage: selectedPackage?.days
        }
      });

      if (orderResponse.success) {
        const approvalUrl = orderResponse.links?.find(link => link.rel === 'approve')?.href;
        if (approvalUrl) {
          window.location.href = approvalUrl;
        } else {
          alert('Unable to redirect to PayPal. Please try again.');
        }
      } else {
        alert('Failed to create order. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    }
  };

  const handleProgressBarDrag = (e) => {
    if (videoRef.current && progressBarRef.current && e.buttons === 1) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      videoRef.current.currentTime = pos * videoRef.current.duration;
    }
  };

  // Lock background scroll when any modal is open
  useEffect(() => {
    const original = document.body.style.overflow;
    if (isFormOpen || isOptionsOpen || isDetailsOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = original || '';
    return () => { document.body.style.overflow = original || ''; };
  }, [isFormOpen, isOptionsOpen, isDetailsOpen]);

  // Close on Escape (priority: details > options > form)
  useEffect(() => {
    if (!isFormOpen && !isOptionsOpen && !isDetailsOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (isDetailsOpen) setIsDetailsOpen(false);
        else if (isOptionsOpen) setIsOptionsOpen(false);
        else if (isFormOpen) setIsFormOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isFormOpen, isOptionsOpen, isDetailsOpen]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Fixed Background */}
      <div 
        className="fixed inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('/personalcuratorbg.jpeg')",
        }}
      />
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-black/60 to-transparent z-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40 z-0" />

      {/* Floating Elements */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute top-60 left-20 w-24 h-24 bg-gradient-to-r from-amber-400/20 to-orange-500/20 rounded-full blur-xl animate-pulse delay-1000" />
      <div className="absolute bottom-40 right-1/4 w-40 h-40 bg-gradient-to-r from-blue-400/20 to-cyan-500/20 rounded-full blur-xl animate-pulse delay-2000" />
      
      <FullscreenMenu isOpen={isFullMenuOpen} setIsOpen={setFullMenuOpen} />

      {/* Back Button */}
      <BackButton variant="floating" />

      {/* Content container */}
      <div className="relative z-10 min-h-screen text-white flex flex-col">
        {/* Elite Premium Navbar */}
        <TopNav active="personal" />

        {/* Hero Section */}
        <div className="flex-1 flex items-center justify-center mt-8 px-8 py-20">
          <div className="max-w-6xl mx-auto text-center">
          {/* Home Button */}
           {/* Home Button */}
                    <div className="mb-8 mt-4 flex justify-center">
                      <Link to="/">
                        <button className="group flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-purple-400 via-pink-300 to-orange-400 text-white font-medium hover:from-purple-600 hover:via-pink-700 hover:to-orange-700 transition-all duration-300 shadow-2xl hover:shadow-cyan-500/25 hover:scale-105">
                          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                          {t.home}
                        </button>
                      </Link>
                    </div>
            {/* Main Title */}
            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-purple-200 via-pink-300 to-amber-400 bg-clip-text text-transparent drop-shadow-2xl">
              {t.personalCurator}
            </h1>
            
            <div className="w-32 h-1 bg-gradient-to-r from-purple-400 to-pink-500 mx-auto mb-8 rounded-full" />
            <p className="text-xl md:text-2xl text-purple-100 mb-12 font-light leading-relaxed max-w-4xl mx-auto">
              {t.heroSubtitle}
            </p>

            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20  max-w-4xl mx-auto">
              {/*<h3 className="text-2xl font-semibold mb-4 text-amber-300">The Personal Touch</h3>*/}
              <p className="text-white/80  leading-relaxed">
              {t.welcomeTitle}, {t.welcomeSubtitle}
              </p>
              <p className="text-white/80 pt-8 leading-relaxed">
              {t.welcomeDescription}
              </p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-black/50 backdrop-blur-2xl border-t border-purple-500/30">
          <div className="max-w-6xl mx-auto px-8 py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left Content */}
              <div className="space-y-8">
                <div className="space-y-6">
                  <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-300 to-pink-400 bg-clip-text text-transparent">
                    {t.whatIncludedTitle}
                  </h2>
                  <p className="text-lg text-gray-300 leading-relaxed">
                    {t.whatIncludedSubtitle}
                  </p>
                </div>

                <div className="space-y-6">
                  {t.whatIncludedItems.map((item, index) => (
                    <p key={index} className="text-lg text-gray-300 leading-relaxed">
                      ◉ {item}
                    </p>
                  ))}
                </div>

                {/*<div className="flex flex-col sm:flex-row gap-4">
                  <button
                    className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25"
                    onClick={() => navigate("/personal-curator-form")}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a1 1 0 01-1 1H5a1 1 0 01-1-1V8a1 1 0 011-1h3z" />
                      </svg>
                       {t.bookCallTitle}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
                  </button>
                </div>*/}
              </div>

              {/* Right Video */}
              <div className="relative">
                <div className="relative overflow-hidden rounded-2xl shadow-2xl group">
                  <video
                    ref={videoRef}
                    src="/personal.mp4"
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    className="w-full h-[700px] object-cover transition-transform duration-700 hover:scale-110"
                  >
                    Your browser does not support the video tag.
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  
                  {/* Audio Control Button */}
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 z-10"
                    aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                  >
                    {isMuted ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                    )}
                  </button>

                  {/* Video Playback Controls */}
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                    {/* Progress Bar */}
                    <div 
                      ref={progressBarRef}
                      className="w-full h-1 bg-white/30 rounded-full cursor-pointer mb-2 group/progress"
                      onClick={handleProgressBarClick}
                      onMouseMove={handleProgressBarDrag}
                    >
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full relative transition-all"
                        style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                      >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity" />
                      </div>
                    </div>

                    {/* Control Buttons */}
                    <div className="flex items-center justify-center gap-2 bg-black/70 backdrop-blur-md px-4 py-2 rounded-full mx-auto w-fit">
                      {/* 10 Seconds Backward */}
                      <button
                        onClick={skipBackward}
                        className="text-white hover:text-purple-400 transition-colors duration-200 hover:scale-110 transform"
                        aria-label="Skip backward 10 seconds"
                        title="-10s"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                        </svg>
                      </button>

                      {/* Play/Pause Button */}
                      <button
                        onClick={togglePlayPause}
                        className="text-white hover:text-pink-400 transition-colors duration-200 hover:scale-110 transform"
                        aria-label={isPlaying ? 'Pause video' : 'Play video'}
                      >
                        {isPlaying ? (
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                          </svg>
                        ) : (
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        )}
                      </button>

                      {/* 10 Seconds Forward */}
                      <button
                        onClick={skipForward}
                        className="text-white hover:text-purple-400 transition-colors duration-200 hover:scale-110 transform"
                        aria-label="Skip forward 10 seconds"
                        title="+10s"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full blur-xl opacity-60" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full blur-xl opacity-40" />
              </div>
            </div>
          </div>
          <div className="w-32 h-1 bg-gradient-to-r from-purple-400 to-pink-500 mx-auto mb-8 rounded-full" />
            <p className="text-xl md:text-2xl text-purple-100 mb-12 font-light text-center leading-relaxed max-w-4xl mx-auto">
              {t.letMeTakeCareTitle} {t.letMeTakeCareDescription}
            </p> 
            <div className="flex flex-col justify-center mb-10 sm:flex-row gap-4">
                  <button
                    className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25"
                    onClick={() => setIsFormOpen(true)}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a1 1 0 01-1 1H5a1 1 0 01-1-1V8a1 1 0 011-1h3z" />
                      </svg>
                       {t.bookCallTitle}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
                  </button>
                </div>
        </div>
      </div>
      {/* Modal: Personal Curator Form */}
      {isFormOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-3xl p-4"
          onClick={() => setIsFormOpen(false)}
        >
    {/* Animated floating glows */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-10 left-1/4 w-48 h-48 bg-pink-500/20 blur-3xl rounded-full animate-floatGlow"></div>
      <div className="absolute bottom-16 right-1/4 w-64 h-64 bg-purple-500/30 blur-3xl rounded-full animate-floatGlow delay-500"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-amber-400/10 blur-3xl rounded-full opacity-50 animate-pulse"></div>
    </div>

    {/* Glass popup card */}
    <div
  className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto hide-scrollbar rounded-3xl
              bg-gradient-to-br from-white/10 via-white/20 to-white/5 backdrop-blur-[28px] border border-white/30 shadow-[0_12px_60px_rgba(0,0,0,0.6)]
              transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]
              scale-100 opacity-100 animate-popSpring"
  onClick={(e) => e.stopPropagation()}
>
  {/* Close Button inside container */}
  <button
    aria-label="Close"
    title="Close"
    onClick={() => setIsFormOpen(false)}
    className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all duration-300 group z-50"
    >
      <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
      <span className="pointer-events-none absolute top-0 left-[-60%] h-full w-8 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-[-20deg] opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out group-hover:left-[160%]" />
  
  </button>

  {/* Gradient moving border ring */}
  <div className="absolute inset-0 rounded-3xl pointer-events-none">
    <div className="absolute inset-[-1px] rounded-3xl bg-[conic-gradient(from_0deg,rgba(255,191,0,0.25),rgba(236,72,153,0.25),rgba(147,51,234,0.25),rgba(59,130,246,0.25),rgba(255,191,0,0.25))] animate-rotateBorder blur-lg opacity-60"></div>
  </div>

      {/* Content */}
      <div className="overflow-hidden rounded-3xl">
        <div className="relative">
          <img src="/about3.jpeg" alt="Rome" className="w-full h-56 md:h-64 object-cover brightness-90" />
          {/* Glass reflection stripe */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/30 to-transparent"></div>
        </div>
        <div className="bg-gradient-to-br from-white/10 via-white/15 to-white/5 px-6 md:px-8 py-6 text-white/95">
          <p className="text-sm md:text-base mb-4 opacity-90"> 
            This call will help our Expert to understand your unique interests and needs to
          </p>

          <ul className="space-y-2 text-sm md:text-base list-disc pl-5 opacity-95">
            <li>Custom-Designed Roman Journey: a meticulously planned, step-by-step PDF itinerary, perfectly paced to your preferences and travel style.</li>
            <li>VIP Access & reservations: We leverage our network to secure tickets/tours for highly sought-after, often sold-out experiences (e.g., Colosseum Underground, Vatican Early Entry, Scavi/Borgo).</li>
            <li>Elite Dining Portfolio: A curated list of hand-selected restaurant and cocktail bar recommendations, from Michelin-starred fine dining to the best local trattorias.</li>
            <li>Zero-Friction Logistics: A tailored transportation plan (private drivers, taxi coordination, efficient use of metro) that minimizes travel time and maximizes enjoyment.</li>
          </ul>

          {/* Info Card 
          <div className="mt-8 w-full flex justify-center">
            <div className="w-[280px] md:w-[320px] rounded-xl bg-white/10 backdrop-blur-xl text-white px-5 py-5 shadow-lg ring-1 ring-white/20 border border-white/20">
              <h3 className="text-center text-[#b5ff66] font-bold mb-3 tracking-wide">What You'll Need</h3>
              <ul className="text-xs md:text-sm space-y-2 list-disc pl-4 opacity-95">
                <li>Your party size and preferences</li>
                <li>Dates and length of stay</li>
                <li>Must-see interests (art, food, history, shopping)</li>
                <li>Restaurants/experiences you’d love to try</li>
              </ul>
              <p className="mt-3 text-[10px] md:text-xs opacity-80 text-center">
                This helps the team craft the most personal and precise itinerary.
              </p>
            </div>
          </div> */}

          {/* Continue Button */}
          <div className="mt-10 flex items-center justify-center gap-3">
            
            <button
              onClick={() => { setIsFormOpen(false); setIsOptionsOpen(true); }}
              className="btn-shine relative overflow-hidden px-10 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-600 shadow-lg shadow-purple-600/30 transition-all duration-300 hover:scale-105 hover:shadow-pink-500/40"
            >
              <span className="relative z-10">Continue</span>
              <span className="shine" />
            </button>
          </div>
        </div>
      </div>
    </div>

    {/* Custom Animations */}
    <style>{`
      @keyframes rotateBorder {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes floatGlow {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      @keyframes scaleFadeIn {
        0% { opacity: 0; transform: scale(0.9); }
        100% { opacity: 1; transform: scale(1); }
      }
      .animate-rotateBorder { animation: rotateBorder 8s linear infinite; }
      .animate-floatGlow { animation: floatGlow 6s ease-in-out infinite; }
      .animate-scaleFadeIn { animation: scaleFadeIn 0.6s ease forwards; }
      .hide-scrollbar { scrollbar-width: none; }
      .hide-scrollbar::-webkit-scrollbar { display: none; }
    `}</style>
  </div>
)}

      {/* Options Popup: fully glass effect */}
      {isOptionsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-3xl p-4"
          onClick={() => setIsOptionsOpen(false)}
        >
          {/* Ambient glows */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-14 left-1/5 w-52 h-52 bg-pink-400/15 rounded-full blur-3xl animate-floatGlow" />
            <div className="absolute bottom-12 right-1/5 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-floatGlow delay-500" />
          </div>

          {/* Glass container */}
          <div
            className="relative w-full max-w-4xl overflow-hidden rounded-3xl
                       bg-gradient-to-br from-white/10 via-white/20 to-white/5
                       backdrop-blur-[28px] border border-white/30
                       shadow-[0_12px_60px_rgba(0,0,0,0.6)] animate-popSpring"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Rotating conic border sheen */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-[-1px] rounded-3xl bg-[conic-gradient(from_0deg,rgba(255,191,0,0.25),rgba(236,72,153,0.25),rgba(147,51,234,0.25),rgba(59,130,246,0.25),rgba(255,191,0,0.25))] animate-rotateBorder blur-lg opacity-60" />
            </div>

            {/* Close Button inside container */}
            <button
            aria-label="Close"
            title="Close"
            onClick={() => setIsOptionsOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all duration-300 group z-50"
            >
              <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
              <span className="pointer-events-none absolute top-0 left-[-60%] h-full w-8 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-[-20deg] opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out group-hover:left-[160%]" />
          </button>

            {/* Title */}
            <div className="px-8 pt-10 pb-6 text-center">
              <h2 className="text-3xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400 bg-clip-text text-transparent drop-shadow-2xl">Choose an option</h2>
            </div>

            {/* Cards */}
            <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch">
              {[
                { days: '3 Days', eur: '€500 – €750', usd: '($550 – $825)', image: '/3day.jpeg' },
                { days: '5 Days', eur: '€700 – €1200', usd: '($770 – $1320)', image: '/5day.jpeg' },
                { days: '7 Days', eur: '€900 – €1500', usd: '($990 – $1650)', image: '/7day.jpeg' },
              ].map((opt) => (
                <button
                  key={opt.days}
                  className="group relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 hover:bg-white/15 backdrop-blur-xl shadow-lg transition-all duration-300 transform-gpu hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl hover:ring-1 hover:ring-pink-400/40 flex flex-col h-full"
                  onClick={() => { setSelectedPackage(opt); setIsOptionsOpen(false); setDetailsStep(1); setIsDetailsOpen(true); }}
                >
                  {/* animated border sheen */}
                  <span className="pointer-events-none absolute -inset-[1px] rounded-2xl bg-[conic-gradient(from_0deg,rgba(255,192,203,0.15),rgba(147,51,234,0.15),rgba(59,130,246,0.15),rgba(255,192,203,0.15))] opacity-0 group-hover:opacity-100 animate-rotateBorderSoft" />
                  {/* sweeping shine on hover */}
                  <span className="pointer-events-none absolute top-0 left-[-30%] h-full w-16 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-[-20deg] opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out group-hover:left-[120%]" />
                  <div className="relative overflow-hidden">
                    <img src={opt.image} alt={opt.days} className="w-full h-40 object-cover transition-transform duration-500 ease-out group-hover:scale-110" />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-80" />
                  </div>
                  <div className="flex-1 p-5 bg-gradient-to-br from-[#4a375b]/60 to-[#6b5a7d]/60 text-white">
                    <div className="font-semibold mb-1">{opt.days}</div>
                    <div className="text-sm opacity-95">{opt.eur} <span className="opacity-80">{opt.usd}</span></div>
                  </div>
                  {/* subtle glow */}
                  <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute -inset-10 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-amber-400/10 blur-2xl" />
                  </div>
                </button>
              ))}
            </div>
            <div className="px-6 pb-8 flex justify-center">
              <button
                onClick={() => { setIsOptionsOpen(false); setIsFormOpen(true); }}
                className="group relative overflow-hidden px-8 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-white/20 to-white/30 shadow-lg transition-all duration-300 hover:scale-105"
              >
                <span className="relative z-10">Back</span>
                <span className="pointer-events-none absolute top-0 left-[-60%] h-full w-12 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-[-20deg] opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out group-hover:left-[160%]" />
              </button>
            </div>
          </div>
        </div>
      )}

      {isDetailsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-3xl p-4"
          onClick={() => setIsDetailsOpen(false)}
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-10 left-1/4 w-56 h-56 bg-emerald-400/20 rounded-full blur-3xl animate-floatGlow" />
            <div className="absolute bottom-12 right-1/4 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl animate-floatGlow delay-500" />
          </div>
          <div
            className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto hide-scrollbar rounded-3xl
                       bg-gradient-to-br from-white/10 via-white/20 to-white/5 backdrop-blur-[28px]
                       border border-white/30 shadow-[0_12px_60px_rgba(0,0,0,0.6)] animate-popSpring"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-[-1px] rounded-3xl bg-[conic-gradient(from_0deg,rgba(34,197,94,0.2),rgba(59,130,246,0.2),rgba(236,72,153,0.2),rgba(250,204,21,0.2),rgba(34,197,94,0.2))] animate-rotateBorder blur-lg opacity-60" />
            </div>

            <button
            aria-label="Close"
            title="Close"
            onClick={() => setIsDetailsOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all duration-300 group z-50"
            >
              <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
              <span className="pointer-events-none absolute top-0 left-[-60%] h-full w-8 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-[-20deg] opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out group-hover:left-[160%]" />
          </button>

            <div className="p-6 md:p-8 text-white/95">
            <h3 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent drop-shadow-sm">{detailsStep === 1 ? 'Contact person’s details' : 'Choose a type' } {selectedPackage ? `– ${selectedPackage.days}` : ''}</h3>
              {detailsStep === 1 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-1 md:col-span-2">
                    <label className="text-sm opacity-90">Contact person’s name</label>
                    <input className="mt-2 w-full rounded-xl bg-white/10 border border-white/20 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30" placeholder="Enter full name" />
                  </div>
                  <div className="col-span-1">
                    <label className="text-sm opacity-90">No. of people traveling</label>
                    <div className="mt-2 flex items-center gap-3">
                      <button className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30" onClick={() => setPeopleCount((c) => Math.max(1, c-1))}>-</button>
                      <div className="px-4 py-2 rounded-lg bg-white/10 border border-white/20">{peopleCount}</div>
                      <button className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30" onClick={() => setPeopleCount((c) => c+1)}>+</button>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <label className="text-sm opacity-90">Contact Number</label>
                    <input className="mt-2 w-full rounded-xl bg-white/10 border border-white/20 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30" placeholder="Enter number" />
                  </div>
                  <div className="col-span-1">
                    <label className="text-sm opacity-90">Whatsapp Number</label>
                    <input className="mt-2 w-full rounded-xl bg-white/10 border border-white/20 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30" placeholder="Enter whatsapp" />
                  </div>
                  <div className="col-span-1">
                    <label className="text-sm opacity-90">Email Address</label>
                    <input type="email" className="mt-2 w-full rounded-xl bg-white/10 border border-white/20 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30" placeholder="you@example.com" />
                  </div>
                  <div className="col-span-1">
                    <label className="text-sm opacity-90">Preferred mode of communication</label>
                    <select className="mt-2 w-full rounded-xl bg-white/10 border border-white/20 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30 text-white/90">
                      <option className="bg-[#1f1f1f]">Whatsapp</option>
                      <option className="bg-[#1f1f1f]">Facetime</option>
                      <option className="bg-[#1f1f1f]">Call</option>
                      <option className="bg-[#1f1f1f]">Email</option>
                    </select>
                  </div>

                  <div className="col-span-1 md:col-span-2 mt-4 flex items-center justify-center gap-3">
                    <button
                      onClick={() => { setIsDetailsOpen(false); setIsOptionsOpen(true); }}
                      className="group relative overflow-hidden px-8 py-2 rounded-full bg-gradient-to-r from-white/20 to-white/30 text-white font-semibold shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      <span className="relative z-10">Back</span>
                      <span className="pointer-events-none absolute top-0 left-[-60%] h-full w-10 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-[-20deg] opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out group-hover:left-[160%]" />
                    </button>
                    <button onClick={() => setDetailsStep(2)} className="group relative overflow-hidden px-10 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold shadow-lg hover:scale-105 transition">
                      <span className="relative z-10">Continue</span>
                      <span className="pointer-events-none absolute top-0 left-[-60%] h-full w-12 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-[-20deg] opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out group-hover:left-[160%]" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-1 md:col-span-2">
                    <label className="text-sm opacity-90">Mode of contact</label>
                    <div className="mt-2 flex flex-wrap gap-4 text-sm">
                      <label className="flex items-center gap-2"><input type="checkbox" defaultChecked/> Audio Call</label>
                      <label className="flex items-center gap-2"><input type="checkbox"/> Video Call</label>
                      <label className="flex items-center gap-2"><input type="checkbox"/> Live Text</label>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <label className="text-sm opacity-90">Type of travel</label>
                    <select className="mt-2 w-full rounded-xl bg-white/10 border border-white/20 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30 text-white/90">
                      <option className="bg-[#1f1f1f]">Friends</option>
                      <option className="bg-[#1f1f1f]">Family</option>
                      <option className="bg-[#1f1f1f]">Couple</option>
                      <option className="bg-[#1f1f1f]">On your own</option>
                      <option className="bg-[#1f1f1f]">Other</option>
                    </select>
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label className="text-sm opacity-90">If other, please specify</label>
                    <textarea rows={3} className="mt-2 w-full rounded-xl bg-white/10 border border-white/20 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30" />
                  </div>

                  <div className="col-span-1 md:col-span-2 mt-4 flex items-center justify-center gap-3">
                    <button
                      onClick={() => setDetailsStep(1)}
                      className="group relative overflow-hidden px-8 py-2 rounded-full bg-gradient-to-r from-white/20 to-white/30 text-white font-semibold shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      <span className="relative z-10">Back</span>
                      <span className="pointer-events-none absolute top-0 left-[-60%] h-full w-10 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-[-20deg] opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out group-hover:left-[160%]" />
                    </button>
                    <button onClick={() => { setIsDetailsOpen(false); setImageStep(1); setIsImageFlowOpen(true); }} className="group relative overflow-hidden px-10 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold shadow-lg hover:scale-105 transition">
                      <span className="relative z-10">Continue</span>
                      <span className="pointer-events-none absolute top-0 left-[-60%] h-full w-12 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-[-20deg] opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out group-hover:left-[160%]" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Image Flow Popup */}
      {isImageFlowOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-3xl p-4"
          onClick={() => setIsImageFlowOpen(false)}
        >
          {/* Ambient glows */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-14 left-1/5 w-52 h-52 bg-pink-400/15 rounded-full blur-3xl animate-floatGlow" />
            <div className="absolute bottom-12 right-1/5 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-floatGlow delay-500" />
          </div>

          <div
            className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-gradient-to-br from-white/10 via-white/20 to-white/5 backdrop-blur-[28px] border border-white/30 shadow-[0_12px_60px_rgba(0,0,0,0.6)] animate-popSpring"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Rotating conic border sheen */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-[-1px] rounded-3xl bg-[conic-gradient(from_0deg,rgba(255,191,0,0.25),rgba(236,72,153,0.25),rgba(147,51,234,0.25),rgba(59,130,246,0.25),rgba(255,191,0,0.25))] animate-rotateBorder blur-lg opacity-60" />
            </div>

            {/* Close Button */}
            <button
              aria-label="Close"
              title="Close"
              onClick={() => setIsImageFlowOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all duration-300 group z-50"
            >
              <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="pointer-events-none absolute top-0 left-[-60%] h-full w-8 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-[-20deg] opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out group-hover:left-[160%]" />
            </button>

            {/* Step content */}
            <div className="p-6 md:p-8 text-white/95">
              {imageStep === 1 && (
                <div className="max-w-xl mx-auto">
                  <p className="text-sm md:text-base mb-4 opacity-90">We’re delighted you’ve chosen to work with our Rome expert to design your personalized travel experience. Kindly select a time for your private consultation so we may begin crafting the finer details of your itinerary.</p>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm opacity-90">Select call date</label>
                      <ModernDatePicker
                        selected={callDate ? new Date(callDate) : null}
                        onSelect={(date) => setCallDate(date.toISOString().slice(0, 10))}
                        placeholder="Select a date"
                      />
                    </div>
                    <div>
                      <label className="text-sm opacity-90">Select call time</label>
                      <ModernTimePicker
                        selected={callTime}
                        onSelect={setCallTime}
                        placeholder="Select a time"
                        interval={30}
                        startHour={9}
                        endHour={18}
                      />
                    </div>
                    <div className="text-xs px-3 py-2 rounded-lg bg-white/10 border border-white/20 inline-block opacity-90">The schedule is displayed in Rome's local time (CET)</div>
                  </div>
                </div>
              )}
              {imageStep === 2 && (
                <div className="max-w-xl mx-auto">
                  <div className="mb-4 rounded-xl bg-pink-300/60 text-white px-4 py-3 text-sm">
                    A €100 non-refundable consultation retainer is required to reserve your private session with our expert curator. This amount will be deducted from your final payment for the bespoke itinerary should you choose to proceed.
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm opacity-90">Card Number</label>
                      <input inputMode="numeric" placeholder="1234 5678 9012 3456" value={cardNumber} onChange={(e)=>setCardNumber(e.target.value)} className="mt-2 w-full rounded-xl bg-white/10 border border-white/20 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm opacity-90">Expiry Date</label>
                        <input placeholder="MM/YY" value={expiry} onChange={(e)=>setExpiry(e.target.value)} className="mt-2 w-full rounded-xl bg-white/10 border border-white/20 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30" />
                      </div>
                      <div>
                        <label className="text-sm opacity-90">CVV</label>
                        <input inputMode="numeric" placeholder="123" value={cvv} onChange={(e)=>setCvv(e.target.value)} className="mt-2 w-full rounded-xl bg-white/10 border border-white/20 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30" />
                      </div>
                    </div>
                    <div className="text-center text-2xl font-semibold mt-2">Total: €100</div>

                    {/* Terms & Conditions Checkbox */}
                    <div className="flex items-start gap-3 text-white/80 text-sm pt-4 bg-white/5 p-4 rounded-lg border border-white/10 hover:border-white/20 transition-colors mt-4">
                      <input
                        type="checkbox"
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                        className="accent-pink-400 flex-shrink-0 w-4 h-4 mt-0.5 cursor-pointer"
                      />
                      <label className="cursor-pointer">
                        I accept the{" "}
                        <a href="/terms-and-conditions" className="text-pink-300 hover:text-pink-200 underline font-medium">
                          Terms and Conditions
                        </a>
                      </label>
                    </div>
                  </div>
                </div>
              )}
              {imageStep === 3 && (
                <div className="max-w-2xl mx-auto text-center">
                  <p className="text-xl md:text-2xl leading-relaxed">Congratulation, our expert curator will contact you as per the schedule chosen by you. Sit back and enjoy the experience</p>
                </div>
              )}
            </div>

            {/*{/* Actions */}
            <div className="px-6 pb-6 pt-4 flex items-center justify-center gap-3">
              {imageStep > 1 && imageStep < 3 && (
                <button
                  onClick={() => setImageStep((s) => Math.max(1, s - 1))}
                  className="group relative overflow-hidden px-8 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-white/20 to-white/30 shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <span className="relative z-10">Back</span>
                  <span className="pointer-events-none absolute top-0 left-[-60%] h-full w-12 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-[-20deg] opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out group-hover:left-[160%]" />
                </button>
              )}

              {imageStep < 3 ? (
                <button
                  onClick={async () => {
                    if (imageStep === 1) {
                      if (!callDate || !callTime) return;
                      setImageStep(2);
                    } else if (imageStep === 2) {
                      if (!cardNumber || !expiry || !cvv) {
                        alert('❌ Please fill in all card details');
                        return;
                      }
                      if (!acceptTerms) {
                        alert('❌ Please accept the Terms and Conditions to proceed');
                        return;
                      }
                      handlePayment();
                    }
                  }}
                  className={`group relative overflow-hidden px-10 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-600 shadow-lg shadow-purple-600/30 transition-all duration-300 hover:scale-105 hover:shadow-pink-500/40 ${imageStep===1 && (!callDate||!callTime) ? 'opacity-60 cursor-not-allowed' : ''} ${imageStep===2 && (!cardNumber||!expiry||!cvv||!acceptTerms) ? 'opacity-60 cursor-not-allowed' : ''}`}
                  disabled={(imageStep===1 && (!callDate||!callTime)) || (imageStep===2 && (!cardNumber||!expiry||!cvv||!acceptTerms))}
                >
                  <span className="relative z-10">{imageStep === 2 ? 'Pay with PayPal - €100' : 'Continue'}</span>
                  <span className="pointer-events-none absolute top-0 left-[-60%] h-full w-12 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-[-20deg] opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out group-hover:left-[160%]" />
                </button>
              ) : (
                <button
                  onClick={() => { setIsImageFlowOpen(false); navigate('/'); }}
                  className="group relative overflow-hidden px-10 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-600 shadow-lg shadow-purple-600/30 transition-all duration-300 hover:scale-105 hover:shadow-pink-500/40"
                >
                  <span className="relative z-10">Back to home</span>
                  <span className="pointer-events-none absolute top-0 left-[-60%] h-full w-12 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-[-20deg] opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out group-hover:left-[160%]" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
 );
}
