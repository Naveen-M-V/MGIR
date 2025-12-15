import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import TopNav from "../components/TopNav";
import BackButton from "../components/BackButton";
import Footer from "../components/Footer";
import FullscreenMenu from "./FullscreenMenu";
import ValidatedInput from "../components/ValidatedInput";
import { validateEmail, validateName, validateText } from "../utils/validationUtils";
import { contactPageTranslations } from "../locales/contactPageTranslations";
import { LanguageContext } from "../context/LanguageContext";
import FloatingSocial from "../components/FloatingSocial";

export default function ContactPage() {
  const [isFullMenuOpen, setFullMenuOpen] = useState(false);
  const { language } = useContext(LanguageContext);
  
  // Map global language codes to translation keys
  const langMap = { 'EN': 'en', 'ES': 'es', 'RU': 'ru' };
  const currentLang = langMap[language] || 'en';
  const t = contactPageTranslations[currentLang];
  const [contactData, setContactData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [feedbackData, setFeedbackData] = useState({
    fullName: "",
    orderId: "",
    feedback: "",
    rating: 0,
  });

  const [contactErrors, setContactErrors] = useState({});
  const [feedbackErrors, setFeedbackErrors] = useState({});

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (contactErrors[name]) {
      setContactErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFeedbackChange = (e) => {
    const { name, value } = e.target;
    setFeedbackData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (feedbackErrors[name]) {
      setFeedbackErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleRating = (value) => {
    setFeedbackData((prev) => ({ ...prev, rating: value }));
    if (feedbackErrors.rating) {
      setFeedbackErrors((prev) => ({ ...prev, rating: "" }));
    }
  };

  const validateContactForm = () => {
    const errors = {};
    
    if (!validateName(contactData.name)) {
      errors.name = "Please enter a valid name (min 2 characters)";
    }
    
    if (!validateEmail(contactData.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    if (!validateText(contactData.message, 10)) {
      errors.message = "Message must be at least 10 characters";
    }
    
    return errors;
  };

  const validateFeedbackForm = () => {
    const errors = {};
    
    if (!validateName(feedbackData.fullName)) {
      errors.fullName = "Please enter a valid name (min 2 characters)";
    }
    
    if (!validateText(feedbackData.orderId, 1)) {
      errors.orderId = "Order ID is required";
    }
    
    if (!validateText(feedbackData.feedback, 10)) {
      errors.feedback = "Feedback must be at least 10 characters";
    }
    
    if (feedbackData.rating === 0) {
      errors.rating = "Please select a rating";
    }
    
    return errors;
  };

  const submitContact = (e) => {
    e.preventDefault();
    const errors = validateContactForm();
    
    if (Object.keys(errors).length > 0) {
      setContactErrors(errors);
      return;
    }
    
    console.log("Contact Form:", contactData);
    alert("Your message has been sent successfully!");
    setContactData({ name: "", email: "", message: "" });
    setContactErrors({});
  };

  const submitFeedback = (e) => {
    e.preventDefault();
    const errors = validateFeedbackForm();
    
    if (Object.keys(errors).length > 0) {
      setFeedbackErrors(errors);
      return;
    }
    
    console.log("Feedback Form:", feedbackData);
    alert("Thank you for your feedback!");
    setFeedbackData({ fullName: "", orderId: "", feedback: "", rating: 0 });
    setFeedbackErrors({});
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/contactusbg.jpeg')" }}
      />

      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-transparent z-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40 z-0" />
      
      <FullscreenMenu isOpen={isFullMenuOpen} setIsOpen={setFullMenuOpen} />

      {/* Back Button */}
      <BackButton variant="glass" />

      <div className="relative z-10 min-h-screen flex flex-col">
        <TopNav active="contact" />

        {/* Hero */}
        <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8 text-center">
          <div className="max-w-6xl mt-8 sm:mt-12 md:mt-16 mx-auto">
            {/* Home Button */}
            <div className="mb-6 sm:mb-8 mt-4 sm:mt-6 md:mt-8 flex justify-center">
              <Link to="/">
                <button className="group flex items-center gap-2 sm:gap-3 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium text-sm sm:text-base hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 hover:scale-105">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  {t.home}
                </button>
              </Link>
            </div>
            <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-300 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
                {t.contactUs}
              </h1>
              <p className="text-white/80 mt-3 sm:mt-4 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
                {t.heroSubtitle}
              </p>
            </div>
          </div>
        </section>

        {/* TWO BOXES */}
        <section className="relative py-8 sm:py-12 px-4 sm:px-6 md:px-8 flex-grow">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 items-stretch">

            {/* ------------------ LEFT BOX ------------------ */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-purple-500/20 to-pink-400/20 rounded-3xl blur-xl" />

              <div className="
                relative 
                bg-white/10 
                backdrop-blur-2xl 
                border 
                border-white/20 
                rounded-2xl sm:rounded-3xl
                p-6 sm:p-8 
                shadow-2xl 
                h-full
                flex flex-col           
              ">
                <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-300 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6 sm:mb-8">
                  {t.getInTouch}
                </h2>

                {/* Email */}
                <div className="flex items-center gap-3 sm:gap-4 mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-amber-400/20 to-orange-500/20 border border-amber-400/30 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-white/60 text-xs sm:text-sm">{t.emailLabel}</p>
                    <p className="text-white font-medium text-sm sm:text-base break-all">info@myguideinrome.com</p>
                  </div>
                </div>

                {/* Contact Form */}
                <form onSubmit={submitContact} className="space-y-4 sm:space-y-6 flex-grow flex flex-col">
                  <div>
                    <label className="text-white/80 block mb-2 text-sm sm:text-base">{t.nameLabel} *</label>
                    <input
                      type="text"
                      name="name"
                      value={contactData.name}
                      onChange={handleContactChange}
                      className={`w-full bg-white/10 border rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-white/50 focus:outline-none transition-all text-sm sm:text-base ${
                        contactErrors.name ? 'border-red-400 focus:border-red-400' : 'border-white/20 focus:border-blue-400'
                      }`}
                      placeholder={t.namePlaceholder}
                      required
                    />
                    {contactErrors.name && (
                      <p className="text-red-300 text-xs mt-1 flex items-center gap-1">
                        <span>⚠</span> {contactErrors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-white/80 block mb-2 text-sm sm:text-base">{t.emailLabel} *</label>
                    <input
                      type="email"
                      name="email"
                      value={contactData.email}
                      onChange={handleContactChange}
                      className={`w-full bg-white/10 border rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-white/50 focus:outline-none transition-all text-sm sm:text-base ${
                        contactErrors.email ? 'border-red-400 focus:border-red-400' : 'border-white/20 focus:border-blue-400'
                      }`}
                      placeholder={t.emailPlaceholder}
                      required
                    />
                    {contactErrors.email && (
                      <p className="text-red-300 text-xs mt-1 flex items-center gap-1">
                        <span>⚠</span> {contactErrors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-white/80 block mb-2 text-sm sm:text-base">{t.messageLabel} *</label>
                    <textarea
                      name="message"
                      rows={4}
                      value={contactData.message}
                      onChange={handleContactChange}
                      className={`w-full bg-white/10 border rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-white/50 focus:outline-none transition-all resize-none text-sm sm:text-base ${
                        contactErrors.message ? 'border-red-400 focus:border-red-400' : 'border-white/20 focus:border-blue-400'
                      }`}
                      placeholder={t.messagePlaceholder}
                      required
                    />
                    {contactErrors.message && (
                      <p className="text-red-300 text-xs mt-1 flex items-center gap-1">
                        <span>⚠</span> {contactErrors.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold py-2 sm:py-3 rounded-lg sm:rounded-xl hover:from-amber-600 hover:to-yellow-600 transition-all text-sm sm:text-base mt-auto"
                  >
                    {t.sendMessage}
                  </button>
                </form>
              </div>
            </div>

            {/* ------------------ RIGHT BOX ------------------ */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 via-orange-500/20 to-yellow-400/20 rounded-3xl blur-xl" />

              <div className="
                relative 
                bg-white/10 
                backdrop-blur-2xl 
                border 
                border-white/20 
                rounded-2xl sm:rounded-3xl
                p-6 sm:p-8 
                shadow-2xl 
                h-full
                flex flex-col           
              ">
                <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-300 via-orange-400 to-yellow-300 bg-clip-text text-transparent mb-6 sm:mb-8">
                  {t.leaveYourFeedback}
                </h2>

                <form onSubmit={submitFeedback} className="space-y-4 sm:space-y-6 flex-grow flex flex-col">
                  <div>
                    <label className="text-white/80 block mb-2 text-sm sm:text-base">{t.fullNameLabel} *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={feedbackData.fullName}
                      onChange={handleFeedbackChange}
                      className={`w-full bg-white/10 border rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-white/50 focus:outline-none transition-all text-sm sm:text-base ${
                        feedbackErrors.fullName ? 'border-red-400 focus:border-red-400' : 'border-white/20 focus:border-amber-400'
                      }`}
                      placeholder={t.fullNamePlaceholder}
                      required
                    />
                    {feedbackErrors.fullName && (
                      <p className="text-red-300 text-xs mt-1 flex items-center gap-1">
                        <span>⚠</span> {feedbackErrors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-white/80 block mb-2 text-sm sm:text-base">{t.orderIdLabel} *</label>
                    <input
                      type="text"
                      name="orderId"
                      value={feedbackData.orderId}
                      onChange={handleFeedbackChange}
                      className={`w-full bg-white/10 border rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-white/50 focus:outline-none transition-all text-sm sm:text-base ${
                        feedbackErrors.orderId ? 'border-red-400 focus:border-red-400' : 'border-white/20 focus:border-amber-400'
                      }`}
                      placeholder={t.orderIdPlaceholder}
                      required
                    />
                    {feedbackErrors.orderId && (
                      <p className="text-red-300 text-xs mt-1 flex items-center gap-1">
                        <span>⚠</span> {feedbackErrors.orderId}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-white/80 block mb-2 text-sm sm:text-base">{t.feedbackLabel} *</label>
                    <textarea
                      name="feedback"
                      rows={4}
                      value={feedbackData.feedback}
                      onChange={handleFeedbackChange}
                      className={`w-full bg-white/10 border rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-white/50 focus:outline-none transition-all resize-none text-sm sm:text-base ${
                        feedbackErrors.feedback ? 'border-red-400 focus:border-red-400' : 'border-white/20 focus:border-amber-400'
                      }`}
                      placeholder={t.feedbackPlaceholder}
                      required
                    />
                    {feedbackErrors.feedback && (
                      <p className="text-red-300 text-xs mt-1 flex items-center gap-1">
                        <span>⚠</span> {feedbackErrors.feedback}
                      </p>
                    )}
                  </div>

                  {/* Star Rating */}
                  <div>
                    <label className="block text-white/80 mb-3 text-sm sm:text-base">{t.ratingLabel} *</label>
                    <div className="flex gap-1 sm:gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          onClick={() => handleRating(star)}
                          className={`cursor-pointer text-2xl sm:text-3xl transition-all ${
                            star <= feedbackData.rating ? "text-yellow-400" : "text-white/40 hover:text-white/60"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    {feedbackErrors.rating && (
                      <p className="text-red-300 text-xs mt-1 flex items-center gap-1">
                        <span>⚠</span> {feedbackErrors.rating}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-white font-bold py-2 sm:py-3 rounded-lg sm:rounded-xl hover:from-amber-600 hover:via-orange-600 hover:to-yellow-600 transition-all text-sm sm:text-base mt-auto"
                  >
                    {t.submitFeedback}
                  </button>
                </form>
              </div>
            </div>

          </div>
        </section>
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
                                  Personal Curator
                                </button>
                              </Link>
                              
                            </div>
                          </div>
                        </section>

        <Footer />
      </div>
    </div>
  );
}
