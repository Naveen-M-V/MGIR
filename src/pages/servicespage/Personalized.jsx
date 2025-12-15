import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer";
import FullscreenMenu from "../FullscreenMenu";
import TopNav from "../../components/TopNav";
import BackButton from "../../components/BackButton";
import paymentService from "../../services/paymentService";
import { ModernDatePicker } from "../../components/ModernDatePicker";
import { LanguageContext } from "../../context/LanguageContext";
import personalCompanionTranslations from "../../locales/personalCompanionTranslations";

// Booking Modal Component
function BookingModal({ isOpen, onClose, carOption }) {
  const { language } = useContext(LanguageContext);
  const langMap = { 'EN': 'en', 'ES': 'es', 'RU': 'ru' };
  const currentLang = langMap[language] || 'en';
  const t = personalCompanionTranslations[currentLang];

  const [formData, setFormData] = useState({
    name: '',
    days: '1',
    contact: '',
    date: '',
    members: '1',
    acceptTerms: false
  });
  const [animateIn, setAnimateIn] = useState(false);

  // Pricing based on car option and days (constant regardless of member count)
  const pricing = {
    withCar: { '1': 250,'2': 500,  '3': 600, '5': 900 },
    withoutCar: { '1': 200,'2': 400, '3': 500, '5': 750 }
  };

  const basePrice = carOption === 'withCar' ? pricing.withCar[formData.days] : pricing.withoutCar[formData.days];
  const memberCount = parseInt(formData.members);
  const currentPrice = basePrice; // Price is constant regardless of member count

  React.useEffect(() => {
    if (isOpen) {
      setAnimateIn(true);
    } else {
      setAnimateIn(false);
    }
  }, [isOpen]);

  // Reset member count if switching to car service and current count exceeds limit
  React.useEffect(() => {
    if (carOption === 'withCar' && parseInt(formData.members) > 3) {
      setFormData(prev => ({ ...prev, members: '3' }));
    }
  }, [carOption, formData.members]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.acceptTerms) {
      alert('❌ Please accept the Terms and Conditions to proceed');
      return;
    }
    
    console.log('Booking submitted:', { ...formData, carOption, members: memberCount, price: currentPrice });
    // Handle form submission here
    handlePayPalPayment();
  };

  const handlePayPalPayment = async () => {
    try {
      const orderResponse = await paymentService.createOrder({
        amount: currentPrice,
        currency: 'EUR',
        description: `${carOption === 'withCar' ? 'With Car' : 'Without Car'} - ${formData.days} Day(s) Personal Companion for ${memberCount} member(s)`,
        serviceType: 'personal_companion',
        customerName: formData.name,
        customerEmail: formData.contact,
        customerPhone: formData.contact,
        bookingDetails: {
          days: formData.days,
          members: memberCount,
          date: formData.date,
          carOption: carOption
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

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-teal-900/20 to-cyan-900/20">
        <div className="absolute top-1/4 left-1/3 w-36 h-36 bg-emerald-400/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-28 h-28 bg-teal-400/20 rounded-full blur-xl animate-pulse delay-1000" />
      </div>

      <div className={`relative max-w-md w-full max-h-[80vh] overflow-y-auto hide-scrollbar transform transition-all duration-500 ease-out ${
        animateIn ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}>
        <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
          {/* Close Button */}
          <button
            aria-label="Close"
            title="Close"
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all duration-300 group z-50"
          >
            <span className="text-white text-lg">×</span>
            <span className="pointer-events-none absolute top-0 left-[-60%] h-full w-8 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-[-20deg] opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out group-hover:left-[160%]" />
          </button>

          <div className="relative bg-black/30 backdrop-blur-xl rounded-3xl p-6">
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-300 to-teal-400 bg-clip-text text-transparent mb-2">
                {t.bookYourExperience}
              </h2>
              <p className="text-white/70 text-sm">
                {carOption === 'withCar' ? t.carService : t.withoutCar}
              </p>
              {carOption === 'withCar' && (
                <p className="text-amber-400 text-xs mt-1">
                  {t.perDay}
                </p>
              )}
              <div className="text-emerald-400 font-bold text-lg mt-2">
                €{currentPrice} {t.total}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Name Field */}
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">{t.fullName}</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all duration-300"
                  placeholder={t.enterFullName}
                />
              </div>

              {/* Days Dropdown */}
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">{t.numberOfDays}</label>
                <select
                  name="days"
                  value={formData.days}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all duration-300"
                >
                  <option value="1" className="bg-gray-800">{t.day1} - €{carOption === 'withCar' ? pricing.withCar['1'] : pricing.withoutCar['1']}</option>
                  <option value="2" className="bg-gray-800">{t.day2} - €{carOption === 'withCar' ? pricing.withCar['2'] : pricing.withoutCar['2']}</option>
                  <option value="3" className="bg-gray-800">{t.day3} - €{carOption === 'withCar' ? pricing.withCar['3'] : pricing.withoutCar['3']}</option>
                  <option value="5" className="bg-gray-800">{t.day5} - €{carOption === 'withCar' ? pricing.withCar['5'] : pricing.withoutCar['5']}</option>
                </select>
              </div>

              {/* Members Field */}
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  {t.numberOfMembers}
                  {carOption === 'withCar' && (
                    <span className="text-amber-400 text-xs ml-2">{t.maxMembers}</span>
                  )}
                </label>
                {carOption === 'withCar' ? (
                  <select
                    name="members"
                    value={formData.members}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all duration-300"
                  >
                    <option value="1" className="bg-gray-800">1 {t.member}</option>
                    <option value="2" className="bg-gray-800">2 {t.members}</option>
                    <option value="3" className="bg-gray-800">3 {t.members}</option>
                  </select>
                ) : (
                  <input
                    type="number"
                    name="members"
                    value={formData.members}
                    onChange={handleInputChange}
                    min="1"
                    max="50"
                    required
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all duration-300"
                    placeholder={t.enterFullName}
                  />
                )}
              </div>

              {/* Contact Number */}
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">{t.contactNumber}</label>
                <input
                  type="tel"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all duration-300"
                  placeholder={t.enterPhoneNumber}
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">{t.preferredDate}</label>
                <ModernDatePicker
                  selected={formData.date ? new Date(formData.date) : null}
                  onSelect={(date) => {
                    setFormData({
                      ...formData,
                      date: date.toISOString().slice(0, 10)
                    });
                  }}
                  placeholder={t.selectDate}
                />
              </div>

              {/* Terms & Conditions Checkbox */}
              <div className="flex items-start gap-3 text-white/80 text-sm pt-2 bg-white/5 p-4 rounded-lg border border-white/10 hover:border-white/20 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                  className="accent-emerald-400 flex-shrink-0 w-4 h-4 mt-0.5 cursor-pointer"
                />
                <label className="cursor-pointer">
                  {t.acceptTerms}{" "}
                  <a href="/terms-and-conditions" className="text-emerald-300 hover:text-emerald-200 underline font-medium">
                    {t.termsAndConditions}
                  </a>
                </label>
              </div>

              {/* PayPal Payment Button */}
              <button
                type="submit"
                className="w-full mt-4 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 hover:scale-105 flex items-center justify-center gap-3"
              >
                {t.payWithPayPal} - €{currentPrice}
              </button>
              
              <div className="text-center mt-3">
                <p className="text-white/60 text-xs">
                  {t.securePayment}
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Personalized() {
  const { language } = useContext(LanguageContext);
  const langMap = { 'EN': 'en', 'ES': 'es', 'RU': 'ru' };
  const currentLang = langMap[language] || 'en';
  const t = personalCompanionTranslations[currentLang];

  const [isFullMenuOpen, setFullMenuOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState({ isOpen: false, carOption: null });

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Fixed Background */}
      <div 
        className="fixed inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('/Personalized.jpeg')"
        }}
      />
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-transparent z-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40 z-0" />

      {/* Floating Elements */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-r from-emerald-400/20 to-teal-500/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute top-60 left-20 w-24 h-24 bg-gradient-to-r from-amber-400/20 to-orange-500/20 rounded-full blur-xl animate-pulse delay-1000" />
      <div className="absolute bottom-40 right-1/4 w-40 h-40 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full blur-xl animate-pulse delay-2000" />
      
      {/* Hamburger Menu */}
      <FullscreenMenu isOpen={isFullMenuOpen} setIsOpen={setFullMenuOpen} />

      {/* Back Button */}
      <BackButton variant="glass" />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Elite Premium Navbar */}
        <TopNav active="services" />
        
        {/* Hero Section */}
        <section className="relative mt-8 px-8">
          <div className="max-w-6xl mx-auto text-center">
            {/* Home Button */}
            <div className="mb-8 mt-24 flex justify-center">
              <Link to="/">
                <button className="group flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-2xl hover:shadow-emerald-500/25 hover:scale-105">
                  <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  {t.homeButton}
                </button>
              </Link>
            </div>  

            {/* Main Title */}
            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-emerald-200 via-teal-300 to-amber-400 bg-clip-text text-transparent drop-shadow-2xl">
              {t.mainTitle}
            </h1>
            
            <div className="w-32 h-1 bg-gradient-to-r from-emerald-400 to-teal-500 mx-auto mb-8 rounded-full" />
            
            <h2 className="text-2xl md:text-3xl font-light mb-8 text-white/90 tracking-wide">
              {t.subtitle}
            </h2>
            
            <p className="text-xl text-white/80 leading-relaxed mb-12 max-w-4xl mx-auto font-light">
              {t.description}
            </p>

            {/* Service Promise 
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 mb-12 max-w-4xl mx-auto">
              <h3 className="text-2xl font-semibold mb-4 text-amber-300">The Personal Touch</h3>
              <p className="text-white/80  leading-relaxed">
                Enjoy the ease of having someone by your side to help with everything — even ordering meals — before stepping back to give you the space and privacy you deserve."  ​
               </p>
            </div> */}
          </div>
        </section>

        {/* Booking Options */}
        <section className=" px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                {t.chooseExperience}
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-teal-500 mx-auto mb-6 rounded-full" />
              <p className="text-xl text-white/70 max-w-3xl mx-auto">
                {t.selectPreferred}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Without Car Card */}
              <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Full Width Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src="./Walki.jpeg"
                    alt="Walking Tour"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-2xl font-bold text-white mb-1">{t.withoutCar}</h3>
                    <p className="text-white/90 text-sm">{t.walkingTours}</p>
                  </div>
                </div>
                
                <div className="relative p-6">

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                      <span className="text-white/80">{t.day1}</span>
                      <span className="text-emerald-400 font-bold">€200</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                      <span className="text-white/80">{t.day2}</span>
                      <span className="text-emerald-400 font-bold">€400</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                      <span className="text-white/80">{t.day3}</span>
                      <span className="text-emerald-400 font-bold">€500</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                      <span className="text-white/80">{t.day5}</span>
                      <span className="text-emerald-400 font-bold">€750</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsBookingModalOpen({ isOpen: true, carOption: 'withoutCar' })}
                    className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 hover:scale-105"
                  >
                    {t.bookWithoutCar}
                  </button>
                </div>
              </div>

              {/* With Car Card */}
              <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Full Width Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src="./Fiat.jpg"
                    alt="Car Service"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-2xl font-bold text-white mb-1">{t.withCar}</h3>
                    <p className="text-white/90 text-sm">{t.privateCarDriver}</p>
                  </div>
                </div>
                
                <div className="relative p-6">

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                      <span className="text-white/80">{t.day1}</span>
                      <span className="text-blue-400 font-bold">€250</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                      <span className="text-white/80">{t.day2}</span>
                      <span className="text-blue-400 font-bold">€500</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                      <span className="text-white/80">{t.day3}</span>
                      <span className="text-blue-400 font-bold">€600</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                      <span className="text-white/80">{t.day5}</span>
                      <span className="text-blue-400 font-bold">€900</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsBookingModalOpen({ isOpen: true, carOption: 'withCar' })}
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 hover:scale-105"
                  >
                    {t.bookWithCar}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              {t.discoverRome}
            </h2>
            <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">
              {t.experienceRome}
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/personal">
                <button className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-full hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-2xl hover:shadow-emerald-500/25 hover:scale-105">
                  {t.personalCurator}
                </button>
              </Link>
            </div>
          </div>
        </section>
      </div>
      
      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen.isOpen}
        onClose={() => setIsBookingModalOpen({ isOpen: false, carOption: null })}
        carOption={isBookingModalOpen.carOption}
      />
      
      <style>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <Footer />
    </div>
  );
}