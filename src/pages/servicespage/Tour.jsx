import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import FullscreenMenu from "../FullscreenMenu";
import TopNav from "../../components/TopNav";
import BackButton from "../../components/BackButton";
import WishlistButton from "../../components/WishlistButton";
import { useWishlist } from "../../hooks/useWishlist";
import Footer from "../../components/Footer";
import twemoji from "twemoji";
import paymentService from "../../services/paymentService";
import { ModernDatePicker } from "../../components/ModernDatePicker";
import { ModernTimePicker } from "../../components/ModernTimePicker";
import { LanguageContext } from "../../context/LanguageContext";
import tourTranslations from "../../locales/tourTranslations";
import FloatingSocial from "../../components/FloatingSocial";


// Premium SectionCard Component
function SectionCard({ image, titleKey, descKey, title, description, price, place, onClick, gradient, languages, translations }) {
  const displayTitle = titleKey ? translations[titleKey] : title;
  const displayDesc = descKey ? translations[descKey] : description;
  
  const tourItem = {
    title: displayTitle,
    description: displayDesc || "Guided tour experience in Rome",
    price,
    place,
    category: "tour",
    image
  };

  return (
    <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl flex flex-col h-full">
      {/* Wishlist Button */}
      <div className="absolute top-3 right-3 z-30 pointer-events-auto">
        <WishlistButton 
          item={tourItem}
          size="sm"
          variant="card"
          showText={false}
        />
      </div>
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
      
      <div className="relative flex flex-col h-full">
        <div className="h-56 overflow-hidden flex-shrink-0">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
        
        {/* Content Section - Clickable */}
        <button
          type="button"
          className="p-5 flex flex-col flex-grow w-full text-left focus:outline-none relative z-10"
          onClick={(e) => {
            console.log('Tour card clicked:', title);
            onClick && onClick();
          }}
          aria-label={`Open details for ${title}`}
        >
          <h3 className="text-lg font-bold mb-3 text-white group-hover:text-amber-300 transition-colors duration-300 line-clamp-2">
            {displayTitle}
          </h3>
          
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/10">
            <div className="flex flex-col">
              <span className="text-xl font-bold text-amber-400">
                {price}€/pp
              </span>
              <span
  className="text-white/60 text-xs flex items-center gap-1"
  dangerouslySetInnerHTML={{
    __html: twemoji.parse(
      `${translations.languages}: ${languages || "\uD83C\uDDFA\uD83C\uDDF8 \uD83C\uDDEC\uD83C\uDDE7 \uD83C\uDDF7\uD83C\uDDFA \uD83C\uDDEA\uD83C\uDDF8"}`
    ),
  }}
/>
            </div>
            <div className="flex items-center text-amber-400 font-medium group-hover:text-amber-300 transition-colors duration-300 text-sm">
              {/* Book Tour text will be translated in parent component */}
              <span className="tour-book-text">{translations.bookTour}</span>
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
// Modal component to show service details
function ServiceModal({ service, onClose }) {
  const { language } = useContext(LanguageContext);
  const langMap = { 'EN': 'en', 'ES': 'es', 'RU': 'ru' };
  const currentLang = langMap[language] || 'en';
  const t = tourTranslations[currentLang];

  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('');

  // wishlist helpers from hook
  const { addToWishlist, isInWishlist } = useWishlist();

  const handlePayPalPayment = async (bookingData) => {
    try {
      const price = parseFloat(service.price);
      const orderResponse = await paymentService.createOrder({
        amount: price,
        currency: 'EUR',
        description: service.title,
        serviceType: 'tour',
        customerName: 'Guest',
        customerEmail: 'guest@example.com',
        customerPhone: '0000000000',
        bookingDetails: {
          place: service.place,
          languages: service.languages
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

  if (!service) return null;

  // Parse language flags from service.languages string
  const parseLanguageFlags = (flagString) => {
    if (!flagString) return [];
    // Split by spaces to get individual flag emojis
    const flags = flagString.split(' ').filter(flag => flag.trim());
    
    // Map flags to language names and codes
    const flagMap = {
      '🇺🇸': { name: 'English (USA)', code: 'en-us', flag: '🇺🇸' },
      '🇬🇧': { name: 'English (UK)', code: 'en-uk', flag: '🇬🇧' },
      '🇪🇸': { name: 'Spanish', code: 'es', flag: '🇪🇸' },
      '🇷🇺': { name: 'Russian', code: 'ru', flag: '🇷🇺' },
      '🇫🇷': { name: 'French', code: 'fr', flag: '🇫🇷' },
      '🇩🇪': { name: 'German', code: 'de', flag: '🇩🇪' },
      '🇮🇹': { name: 'Italian', code: 'it', flag: '🇮🇹' },
    };
    
    const languages = [];
    flags.forEach(flag => {
      if (flagMap[flag]) {
        languages.push(flagMap[flag]);
      }
    });
    
    return languages;
  };

  const availableLanguages = parseLanguageFlags(service.languages);

  const handleAddToWishlist = async () => {
    const tourItem = {
      title: service.title,
      description: service.description || "Guided tour experience in Rome",
      price: service.price,
      place: service.place,
      category: "tour",
      image: service.image
    };

    const result = await addToWishlist(tourItem);
    if (result.success) {
      alert(`✅ ${result.message}`);
    } else {
      alert(`❌ ${result.message}`);
    }
  };

  const isServiceInWishlist = isInWishlist(service.title);

  return (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/5 w-48 h-48 bg-gradient-to-r from-blue-400/30 to-purple-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-36 h-36 bg-gradient-to-r from-purple-400/25 to-pink-500/25 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-1/6 w-32 h-32 bg-gradient-to-r from-pink-400/20 to-fuchsia-500/20 rounded-full blur-3xl animate-pulse delay-500" />
        <div className="absolute bottom-1/5 left-1/3 w-28 h-28 bg-gradient-to-r from-amber-400/15 to-orange-500/15 rounded-full blur-3xl animate-pulse delay-1500" />
      </div>

      <div className="relative max-w-md w-full max-h-[85vh] overflow-y-auto hide-scrollbar transform transition-all duration-500 ease-out scale-100 opacity-100">
        {/* Enhanced Glassmorphism Container */}
        <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
          {/* Enhanced Rotating Gradient Border */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-[-1px] rounded-3xl bg-[conic-gradient(from_0deg,rgba(59,130,246,0.3),rgba(147,51,234,0.3),rgba(236,72,153,0.3),rgba(251,146,60,0.3),rgba(59,130,246,0.3))] animate-rotateBorder blur-lg opacity-60" />
          </div>
          
          {/* Enhanced Close Button with Elegant Effects */}
          <button
            aria-label="Close"
            title="Close"
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all duration-300 group z-50"
          >
            <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="pointer-events-none absolute top-0 left-[-60%] h-full w-8 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-[-20deg] opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out group-hover:left-[160%]" />
          </button>
          
          <div className="relative bg-gradient-to-br from-black/40 via-black/30 to-black/20 backdrop-blur-xl rounded-3xl p-6">

            {/* Header */}
            <div className="text-center mb-5">
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-300 via-purple-400 to-pink-400 bg-clip-text text-transparent line-clamp-2 mb-2">
                {service.titleKey ? t[service.titleKey] : service.title}
              </h2>
              <div className="w-16 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto rounded-full" />
            </div>

            {/* Content */}
            <div className="mb-5">
              <div className="relative overflow-hidden rounded-xl mb-4">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-40 object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>
              <p className="text-white/90 mb-4 text-sm leading-relaxed">{service.descKey ? t[service.descKey] : service.description}</p>
              <div className="mb-5 text-center">
                <span className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  {service.price}€/pp
                </span>
              </div>
              {service.languages && (
                <div className="mb-5 text-center">
                  <span
                    className="text-white/80 text-sm flex items-center justify-center gap-1"
                    dangerouslySetInnerHTML={{
                      __html: twemoji.parse(`Languages: ${service.languages}`)
                    }}
                  />
                </div>
              )}
            </div>

            {/* Form */}
            <form className="flex flex-col gap-3" onSubmit={(e) => {
              e.preventDefault();
              if (!acceptTerms) {
                alert('❌ Please accept the Terms and Conditions to proceed');
                return;
              }
              if (availableLanguages.length > 0 && !selectedLanguage) {
                alert('❌ Please select a language preference to proceed');
                return;
              }
              const formData = new FormData(e.target);
              const bookingData = {
                name: formData.get('name'),
                email: formData.get('email'),
                date: formData.get('date'),
                persons: formData.get('persons'),
                time: formData.get('time'),
                language: formData.get('language'),
                service: service.title,
                price: service.price
              };
              handlePayPalPayment(bookingData);
            }}>
              <input
                name="name"
                type="text"
                className="border border-white/20 rounded-xl py-3 px-4 bg-white/10 text-white placeholder-white/50 focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50 focus:outline-none text-sm transition-all duration-300 backdrop-blur-sm"
                placeholder={t.yourName}
                required
              />
              <input
                name="email"
                type="email"
                className="border border-white/20 rounded-xl py-3 px-4 bg-white/10 text-white placeholder-white/50 focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50 focus:outline-none text-sm transition-all duration-300 backdrop-blur-sm"
                placeholder={t.emailAddress}
                required
              />
              <div className="flex gap-3">
                <div className="flex-1">
                  <ModernDatePicker
                    selected={null}
                    onSelect={(date) => {
                      const input = document.querySelector('input[name="date"]');
                      if (input) input.value = date.toISOString().slice(0, 10);
                    }}
                    placeholder={t.selectDate}
                  />
                </div>
                <input
                  name="date"
                  type="hidden"
                  required
                />
                <div className="relative flex-1">
                  {service.title === "Rome Vespa Tour" ? (
                    <input
                      name="persons"
                      type="integer"
                      value="1"
                      readOnly
                      className="w-full border border-white/20 rounded-xl py-3 px-4 bg-white/10 text-white placeholder-white/50 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 focus:outline-none text-sm transition-all duration-300 backdrop-blur-sm cursor-not-allowed"
                      placeholder={t.personCount}
                      required
                    />
                  ) : (
                    <input
                      name="persons"
                      type="integer "
                      defaultValue="1"
                      className="w-full border border-white/20 rounded-xl py-3 px-4 bg-white/10 text-white placeholder-white/50 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 focus:outline-none text-sm transition-all duration-300 backdrop-blur-sm"
                      placeholder={t.personCount}
                      required
                      onInput={(e) => {
                        let value = parseInt(e.target.value) || 1;
                        const maxValue = service.title === "Colosseum and Foro Romano Tour" ? 8 : 6;
                        if (value > maxValue) e.target.value = maxValue;
                        if (value < 1) e.target.value = 1;
                      }}
                    />
                  )}
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 text-xs">
                    {service.title === "Rome Vespa Tour" ? t.onlyOnePerson : t.minTwo}
                  </span>
                </div>
              </div>

              {/* Language Preference Dropdown */}
              {availableLanguages.length > 0 && (
                <select
                  name="language"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full border border-white/20 rounded-xl py-3 px-4 bg-black text-white placeholder-white/50 focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50 focus:outline-none text-sm transition-all duration-300 appearance-none cursor-pointer"
                  required
                >
                  <option value="">{t.selectLanguage}</option>
                  {availableLanguages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              )}
              
              {/* Time Options Dropdown for Private Colosseum Tour */}
              {service.titleKey === "privateColosseum" && (
                <select
                  name="startTime"
                  className="w-full border border-white/20 rounded-xl py-3 px-4 bg-black text-white placeholder-white/50 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 focus:outline-none text-sm transition-all duration-300 appearance-none cursor-pointer"
                  defaultValue=""
                  required
                >
                  <option value="" disabled>Select Start Time Option</option>
                  <option value="option1">9:00 - 14:30</option>
                  <option value="option2">9:00 - 13:30</option>
                </select>
              )}
              
              {/* Time Selection for Colosseum and Foro Romano Tour */}
              {service.title === "Colosseum and Foro Romano Tour" && (
                <div className="mb-3">
                  <ModernTimePicker
                    selected=""
                    onSelect={(time) => {
                      const input = document.querySelector('input[name="time"]');
                      if (input) input.value = time;
                    }}
                    placeholder={t.selectTourTime}
                    interval={60}
                    startHour={9}
                    endHour={18}
                  />
                  <input
                    name="time"
                    type="hidden"
                    required
                  />
                </div>
              )}
              
              {/* View More Details Button for Colosseum and Foro Romano Tour and Vespa Tour */}
              {(service.title === "Colosseum and Foro Romano Tour" || service.title === "Rome Vespa Tour") && (
                <div className="mb-3 text-center">
                  <button
                    type="button"
                    onClick={() => setShowMoreDetails(!showMoreDetails)}
                    className="text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors duration-300 flex items-center justify-center gap-2 mx-auto"
                  >
                    {showMoreDetails ? t.hideDetails : t.viewMoreDetails}
                    <svg 
                      className={`w-4 h-4 transition-transform duration-300 ${showMoreDetails ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              )}
              
              {/* Special Information Container for Colosseum and Foro Romano Tour */}
              {service.title === "Colosseum and Foro Romano Tour" && (
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  showMoreDetails ? 'max-h-96 opacity-100 mb-5' : 'max-h-0 opacity-0'
                }`}>
                  <div className="p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl">
                    <div className="text-center mb-3">
                      <span className="text-amber-400 font-semibold text-sm">{t.tourDuration}: 1h 15m</span>
                      <span className="block text-red-400 font-medium text-sm mt-1">{t.selfGuidedTour}</span>
                    </div>
                    <div className="space-y-3 text-white/90 text-xs leading-relaxed">
                      <p>
                        <span className="text-amber-300 font-medium">{t.exclusiveExperience}:</span> {t.exclusiveExperienceText}
                      </p>
                      <p>
                        <span className="text-amber-300 font-medium">{t.skipTheLines}:</span> {t.skipTheLinesText}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Special Information Container for Rome Vespa Tour */}
              {service.title === "Rome Vespa Tour" && (
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  showMoreDetails ? 'max-h-[600px] opacity-100 mb-5' : 'max-h-0 opacity-0'
                }`}>
                  <div className="p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl">
                    <div className="text-center mb-4">
                      <h4 className="text-amber-400 font-semibold text-sm mb-2">{t.keyTourDetails}</h4>
                    </div>
                    <div className="space-y-3 text-white/90 text-xs leading-relaxed">
                      <div className="space-y-2">
                        <p><span className="text-amber-300 font-medium">•</span> <span className="text-amber-300 font-medium">{t.duration}:</span> {t.durationVespa}</p>
                        <p><span className="text-amber-300 font-medium">•</span> <span className="text-amber-300 font-medium">{t.mode}:</span> {t.modeVespa}</p>
                        <p><span className="text-amber-300 font-medium">•</span> <span className="text-amber-300 font-medium">{t.driver}:</span> {t.driverVespa}</p>
                        <p><span className="text-amber-300 font-medium">•</span> <span className="text-amber-300 font-medium">{t.group}:</span> {t.groupVespa}</p>
                      </div>
                      
                      <div className="mt-4">
                        <h5 className="text-amber-400 font-semibold text-sm mb-2">{t.experienceAndSights}</h5>
                        <p className="mb-3">{t.experienceSightsText}</p>
                        
                        <div className="space-y-2">
                          <p><span className="text-amber-300 font-medium">•</span> <span className="text-amber-300 font-medium">{t.efficiency}:</span> {t.efficiencyText}</p>
                          <p><span className="text-amber-300 font-medium">•</span> <span className="text-amber-300 font-medium">{t.landmarks}:</span> {t.landmarksText}</p>
                          <p><span className="text-amber-300 font-medium">•</span> <span className="text-amber-300 font-medium">{t.immersion}:</span> {t.immersionText}</p>
                        </div>
                        
                        <p className="mt-3 text-amber-200 font-medium">{t.idealOption}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Terms & Conditions Checkbox */}
              <div className="flex items-start gap-3 text-white/80 text-sm pt-2 bg-white/5 p-4 rounded-lg border border-white/10 hover:border-white/20 transition-colors">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="accent-purple-400 flex-shrink-0 w-4 h-4 mt-0.5 cursor-pointer"
                />
                <label className="cursor-pointer">
                  {t.acceptTerms}{" "}
                  <a href="/terms-and-conditions" className="text-purple-300 hover:text-purple-200 underline font-medium">
                    {t.termsAndConditions}
                  </a>
                </label>
              </div>

              {/* Enhanced PayPal Payment Button */}
              <button
                type="submit"
                className="w-full py-3 mt-4 rounded-xl font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 text-sm flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                {t.payWithPayPal} - {service.price}€{t.pricePerPerson}
              </button>
              
              <div className="text-center mt-2">
                <p className="text-white/60 text-xs">
                  {t.securePayment}
                </p>
              </div>
              
              <button
                type="button"
                onClick={handleAddToWishlist}
                className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 text-sm flex items-center justify-center gap-2 ${
                  isServiceInWishlist 
                    ? 'bg-gradient-to-r from-red-500/20 to-rose-500/20 border border-red-400/50 text-red-300 hover:from-red-500/30 hover:to-rose-500/30 hover:scale-105' 
                    : 'border border-white/20 text-white hover:bg-gradient-to-r hover:from-white/10 hover:to-white/5 hover:scale-105'
                }`}
              >
                {isServiceInWishlist ? (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    {t.inWishlist}
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {t.addToWishlist}
                  </>
                )}
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}

export default function Tour() {
  const { language } = useContext(LanguageContext);
  const langMap = { 'EN': 'en', 'ES': 'es', 'RU': 'ru' };
  const currentLang = langMap[language] || 'en';
  const t = tourTranslations[currentLang];

  const [isFullMenuOpen, setFullMenuOpen] = useState(false);

  const tours = [
    {
      image: "/hambtn.jpg",
      titleKey: "privateColosseum",
      descKey: "privateColosseum_desc",
      price: "350",
      place: "Rome",
      link: "/tour-2",
      gradient: "from-amber-400 via-orange-500 to-red-500",
      languages: "🇺🇸 🇬🇧 🇪🇸 🇷🇺",
    },
    {
      image: "/colosseum-underground.jpg",
      titleKey: "colossiumUnderground",
      descKey: "colossiumUnderground_desc",
      price: "230",
      place: "Rome",
      link: "/tour-7",
      gradient: "from-stone-400 via-gray-500 to-slate-600",
      languages: "🇺🇸 🇬🇧 🇪🇸 🇷🇺",
    },
    {
      image: "/vespa-tour.jpg",
      titleKey: "romeVespaTour",
      descKey: "romeVespaTour_desc",
      price: "180",
      place: "Rome",
      link: "/tour-3",
      gradient: "from-blue-400 via-purple-500 to-indigo-600",
      languages: "🇺🇸",
    },
    {
      image: "/ancient.jpeg",
      titleKey: "colossiumArena",
      descKey: "colossiumArena_desc",
      price: "170",
      place: "Rome",
      link: "/tour-5",
      gradient: "from-red-400 via-rose-500 to-pink-600",
      languages: "🇺🇸 🇬🇧 🇪🇸 🇷🇺",
    },
    {
      image: "/trevi1.jpg",
      titleKey: "treviPantheon",
      descKey: "treviPantheon_desc",
      price: "120",
      place: "Tivoli",
      link: "/tour-9",
      gradient: "from-green-400 via-emerald-500 to-teal-600",
      languages: "🇺🇸 🇬🇧 🇪🇸 🇷🇺",
    },
    {
      image: "/golf.jpg",
      titleKey: "romeGolfCart",
      descKey: "romeGolfCart_desc",
      price: "80",
      place: "Rome",
      link: "/tour-2",
      gradient: "from-emerald-400 via-teal-500 to-cyan-600",
      languages: "🇺🇸 🇬🇧 🇪🇸 🇷🇺 🇩🇪",
    },
    {
      image: "/fount.jpeg",
      titleKey: "tivoliFountains",
      descKey: "tivoliFountains_desc",
      price: "70",
      place: "Rome",
      link: "/tour-10",
      gradient: "from-slate-400 via-gray-500 to-stone-600",
      languages: "🇺🇸 🇬🇧 🇪🇸 🇷🇺",
    },
     {
      image: "/col.jpeg",
      titleKey: "colossiumAncientRome",
      descKey: "colossiumAncientRome_desc",
      price: "60",
      place: "Rome",
      link: "/tour-8",
      gradient: "from-indigo-400 via-blue-500 to-cyan-600",
      languages: "🇺🇸 🇬🇧 🇪🇸 🇷🇺",
    },
    {
      image: "/food.jpeg",
      titleKey: "Byke Tour",
      descKey: "foodTour_desc",
      price: "60",
      place: "Rome",
      link: "/tour-11",
      gradient: "from-orange-400 via-red-500 to-rose-600",
      languages: "🇺🇸 🇬🇧 🇪🇸 🇷🇺",
    },
    {
      image: "/vat-mus.jpeg",
      titleKey: "vipVatican",
      descKey: "vipVatican_desc",
      price: "55",
      place: "Vatican City",
      link: "/tour-6",
      gradient: "from-yellow-400 via-amber-500 to-orange-600",
      languages: "🇺🇸 🇬🇧 🇪🇸 🇷🇺",
    },
     {
      image: "/foro.jpeg",
      titleKey: "colossiumForo",
      descKey: "colossiumForo_desc",
      price: "90",
      place: "Rome",
      link: "/tour-4",
      gradient: "from-violet-400 via-purple-500 to-fuchsia-600",
      languages: "🇺🇸 🇬🇧 🇪🇸 🇷🇺",
    },
  ];

  // State for modals
  const [selectedService, setSelectedService] = useState(null);

  // Handle close modal
  const handleCloseModal = () => setSelectedService(null);

  // Handle service selection with debugging
  const handleServiceSelect = (service) => {
    console.log('Opening service modal for:', service);
    setSelectedService(service);
  };

  // Close modal on ESC key
  React.useEffect(() => {
    function handleEsc(e) {
      if (e.key === "Escape") handleCloseModal();
    }
    if (selectedService) {
      window.addEventListener("keydown", handleEsc);
      return () => window.removeEventListener("keydown", handleEsc);
    }
  }, [selectedService]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Fixed Background */}
      <div 
        className="fixed inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('ourtoursbg.jpeg')"
        }}
      />
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-transparent z-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40 z-0" />

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute top-60 right-20 w-24 h-24 bg-gradient-to-r from-amber-400/20 to-orange-500/20 rounded-full blur-xl animate-pulse delay-1000" />
      <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-gradient-to-r from-emerald-400/20 to-teal-500/20 rounded-full blur-xl animate-pulse delay-2000" />

      {/* Hamburger Menu */}
      <FullscreenMenu isOpen={isFullMenuOpen} setIsOpen={setFullMenuOpen} />

      {/* Back Button */}
      <BackButton variant="glass" />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Elite Premium Navbar */}
        <TopNav active="services" />

        {/* Hero Section */}
        <section className="relative mt-2 sm:mt-6 md:mt-8 py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8">
          <div className="max-w-6xl mx-auto text-center">
            {/* Home Button */}
            <div className="mb-6 sm:mb-8 mt-2 sm:mt-6 md:mt-8 flex justify-center">
              <Link to="/">
                <button className="group flex items-center gap-2 sm:gap-3 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium text-sm sm:text-base hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 hover:scale-105">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  {t.homeButton}
                </button>
              </Link>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-blue-200 via-purple-300 to-amber-400 bg-clip-text text-transparent drop-shadow-2xl">
              {t.mainTitle}
            </h1>
            
            <div className="w-20 sm:w-24 md:w-32 h-0.5 sm:h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto mb-6 sm:mb-8 rounded-full" />
            
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light mb-6 sm:mb-8 text-white/90 tracking-wide px-4">
              {t.subtitle}
            </h2>
            
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/80 leading-relaxed mb-8 sm:mb-10 md:mb-12 max-w-4xl mx-auto font-light px-4">
              {t.description}
            </p>
          </div>
        </section>

        {/* Tours Grid */}
        <section className="py-0 px-4 sm:px-6 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 sm:mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
                {t.chooseYourTour}
              </h2>
              <div className="w-16 sm:w-20 md:w-24 h-0.5 sm:h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto mb-4 sm:mb-6 rounded-full" />
            </div>

            <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {tours.slice(0, 9).map((tour, idx) => (
                <SectionCard
                  key={tour.titleKey || tour.title}
                  image={tour.image}
                  titleKey={tour.titleKey}
                  descKey={tour.descKey}
                  title={tour.title}
                  price={tour.price}
                  place={tour.place}
                  gradient={tour.gradient}
                  languages={tour.languages}
                  translations={t}
                  onClick={() => handleServiceSelect(tour)}
                />
              ))}
            </div>
            
            {/* Center the last 2 cards */}
            {tours.length > 9 && (
              <div className="flex justify-center mt-6 sm:mt-8">
                <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 max-w-3xl w-full">
                  {tours.slice(9).map((tour, idx) => (
                    <SectionCard
                      key={tour.titleKey || tour.title}
                      image={tour.image}
                      titleKey={tour.titleKey}
                      descKey={tour.descKey}
                      title={tour.title}
                      description={tour.description}
                      price={tour.price}
                      place={tour.place}
                      gradient={tour.gradient}
                      languages={tour.languages}
                      translations={t}
                      onClick={() => handleServiceSelect(tour)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

         {/* Call to Action */}
                <section className="py-20 px-8">
                  <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                      {t.discoverRoman}
                    </h2>
                    <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">
                      {t.experienceRome}
                    </p>
        
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                      <Link to="/personal">
                        <button className="px-8 py-4 bg-gradient-to-r from-blue-400 to-purple-500 text-white font-semibold rounded-full hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-2xl hover:shadow-emerald-500/25 hover:scale-105">
                          {t.personalCurator}
                        </button>
                      </Link>
                      
                    </div>
                  </div>
                </section>
        {selectedService && (
          <ServiceModal
            service={selectedService}
            onClose={handleCloseModal}
          />
        )}
      </div>
      <style>{`
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        @keyframes rotateBorder {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-rotateBorder {
          animation: rotateBorder 8s linear infinite;
        }
        img.emoji {
          width: 14px;
          height: 14px;
          margin-left: 2px;
          margin-right: 2px;
          vertical-align: -2px;
        }
      `}</style>
      <Footer />
    </div>
  );
}
