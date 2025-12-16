import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FullscreenMenu from "../FullscreenMenu";
import TopNav from "../../components/TopNav";
import Footer from "../../components/Footer";
import BackButton from "../../components/BackButton";
import paymentService from "../../services/paymentService";
import { ModernDatePicker } from "../../components/ModernDatePicker";
import { ModernTimePicker } from "../../components/ModernTimePicker";
import { carServicesTranslations } from "../../locales/carServicesTranslations";
import { LanguageContext } from "../../context/LanguageContext";
import FloatingSocial from "../../components/FloatingSocial";

function SectionCard({ image, title, description, price, place, onClick, gradient, t }) {
  return (
    <button
      type="button"
      className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/10 to-white/5 
                 backdrop-blur-md border border-white/20 hover:border-white/40 transition-all duration-500 
                 hover:scale-105 hover:shadow-2xl focus:outline-none flex flex-col h-full"
      onClick={onClick}
      aria-label={`Open details for ${title}`}
    >
      {/* Gradient Background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 
                    group-hover:opacity-20 transition-opacity duration-500`}
      />

      {/* Image Section */}
      <div className="relative h-56 overflow-hidden flex-shrink-0">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors duration-300 line-clamp-2 min-h-[3.5rem]">
          {title}
        </h3>

        <p className="text-white/70 text-sm leading-relaxed mb-4 flex-grow">
          {description}
        </p>

        {/* Bottom Section */}
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-white/10">
          <span className="text-xl font-bold text-amber-400">{price}</span>

          <div className="flex items-center text-amber-400 font-medium group-hover:text-amber-300 transition-colors duration-300 text-sm cursor-pointer">
            {t.bookARide} 
            <svg
              className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </div>
        </div>
      </div>
    </button>
  );
}




 function BookingModal({ onClose, t }) {
  const tr = t || carServicesTranslations.en;
  const [step, setStep] = useState(1);
  const [animateIn, setAnimateIn] = useState(false);

  // Step 1
  const [selectedDateObj, setSelectedDateObj] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const timeSlots = ["08:00", "10:00", "12:00", "14:00", "16:00"];

  // Step 2
  const [airport, setAirport] = useState("");
  const [terminal, setTerminal] = useState("");
  const [airlineName, setAirlineName] = useState("");
  const [flightNumber, setFlightNumber] = useState("");
  const [scheduledArrivalTime, setScheduledArrivalTime] = useState("");

  // Step 3
  const [mobileNumber, setMobileNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  useEffect(() => {
    setAnimateIn(true);
  }, []);

  const step1Valid = selectedDateObj && selectedTime;
  const step2Valid =
    airport && terminal && airlineName && flightNumber && scheduledArrivalTime;
  const step3Valid = mobileNumber && fullName && contactNumber && acceptTerms;

  const goToStep = (s) => setStep(s);

  const handleBookingSubmit = async () => {
    try {
      const totalPrice = 80;
      const orderResponse = await paymentService.createOrder({
        amount: totalPrice,
        currency: 'EUR',
        description: 'Seamless Transport Service',
        serviceType: 'seamless_transport',
        customerName: fullName,
        customerEmail: 'guest@example.com',
        customerPhone: mobileNumber,
        bookingDetails: {
          date: selectedDateObj ? selectedDateObj.toLocaleDateString() : '',
          time: selectedTime,
          airport: airport,
          terminal: terminal,
          airline: airlineName,
          flightNumber: flightNumber,
          scheduledArrival: scheduledArrivalTime
        }
      });

      if (orderResponse.success) {
        const approvalUrl = orderResponse.links?.find(link => link.rel === 'approve')?.href;
        if (approvalUrl) {
          window.location.href = approvalUrl;
        } else {
          alert(tr.paypalRedirectError || 'Unable to redirect to PayPal. Please try again.');
        }
      } else {
        alert(tr.orderCreateFailed || 'Failed to create order. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert(tr.paymentFailed || 'Payment failed. Please try again.');
    }
  };

  return (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 hide-scrollbar">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-40 h-40 bg-emerald-400/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/3 w-32 h-32 bg-teal-400/20 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-cyan-400/20 rounded-full blur-xl animate-pulse delay-500" />
      </div>

      <div
        className={`relative max-w-xl w-full max-h-[90vh] overflow-y-auto hide-scrollbar transform transition-all duration-500 ease-out ${
          animateIn ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Glassmorphism Container */}
        <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
          {/* Gradient Border */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 via-teal-400/20 to-cyan-400/20 rounded-3xl blur-sm" />
          <div className="relative bg-black/30 backdrop-blur-xl rounded-3xl p-8">
            
            {/* Close Button */}
            <button
              aria-label={tr.close || 'Close'}
              title={tr.close || 'Close'}
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all duration-300 group z-50"
            >
              <span className="text-white text-lg">×</span>
              <span className="pointer-events-none absolute top-0 left-[-60%] h-full w-8 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-[-20deg] opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out group-hover:left-[160%]" />
            </button>

            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-300 to-teal-400 bg-clip-text text-transparent mb-2">
                {tr.bookYourRide || 'Book Your Ride'}
              </h2>
              <div className="w-20 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 mx-auto rounded-full" />
            </div>

            {/* Step 1: Date + Time */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-white mb-2 font-medium">{tr.arrivalDate || 'Arrival Date'}</label>
                  <ModernDatePicker
                    selected={selectedDateObj}
                    onSelect={(date) => {
                      setSelectedDateObj(date);
                      setSelectedTime("");
                    }}
                    placeholder={tr.selectDate || 'Select a date'}
                  />
                </div>
                {selectedDateObj && (
                  <div>
                    <label className="block text-white mb-2 font-medium">{tr.arrivalTime || 'Arrival Time'}</label>
                    <ModernTimePicker
                      selected={selectedTime}
                      onSelect={setSelectedTime}
                      placeholder={tr.selectTime || 'Select a time'}
                      interval={60}
                      startHour={8}
                      endHour={18}
                    />
                  </div>
                )}
                <button
                  onClick={() => step1Valid && goToStep(2)}
                  disabled={!step1Valid}
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    step1Valid
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:scale-105 hover:shadow-lg"
                      : "bg-white/10 text-white/60 border border-white/20 cursor-not-allowed"
                  }`}
                >
                  {tr.continue || 'Continue'}
                </button>
              </div>
            )}

            {/* Step 2: Flight Details */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-cyan-300 text-center">{tr.flightDetails || 'Flight Details'}</h3>
                <select
                  value={airport}
                  onChange={(e) => setAirport(e.target.value)}
                  className="w-full border border-white/20 rounded-lg py-2 px-3 bg-white/10 text-black focus:border-emerald-400"
                >
                  <option value="">{tr.selectAirport || 'Select Airport'}</option>
                  <option value="FCO">FCO</option>
                  <option value="CIA">CIA</option>
                </select>
                <input
                  type="text"
                  placeholder={tr.terminal || 'Terminal'}
                  value={terminal}
                  onChange={(e) => setTerminal(e.target.value)}
                  className="w-full border border-white/20 rounded-lg py-2 px-3 bg-white/10 text-white"
                />
                <input
                  type="text"
                  placeholder={tr.airlineName || 'Airline Name'}
                  value={airlineName}
                  onChange={(e) => setAirlineName(e.target.value)}
                  className="w-full border border-white/20 rounded-lg py-2 px-3 bg-white/10 text-white"
                />
                <input
                  type="text"
                  placeholder={tr.flightNumber || 'Flight Number'}
                  value={flightNumber}
                  onChange={(e) => setFlightNumber(e.target.value)}
                  className="w-full border border-white/20 rounded-lg py-2 px-3 bg-white/10 text-white"
                />
                <input
                  type="time"
                  value={scheduledArrivalTime}
                  onChange={(e) => setScheduledArrivalTime(e.target.value)}
                  className="w-full border border-white/20 rounded-lg py-2 px-3 bg-white/10 text-white"
                />
                <div className="flex justify-between mt-4">
                  <button onClick={() => goToStep(1)} className="px-4 py-2 text-white border border-white/20 rounded-lg hover:bg-white/10">{tr.back || 'Back'}</button>
                  <button
                    onClick={() => step2Valid && goToStep(3)}
                    disabled={!step2Valid}
                    className={`px-6 py-2 rounded-lg font-semibold ${
                      step2Valid
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:scale-105"
                        : "bg-white/10 text-white/60 border border-white/20 cursor-not-allowed"
                    }`}
                  >
                    {tr.next || 'Next'}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Client Details */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-cyan-300 text-center">{tr.customerDetails || 'Customer Details'}</h3>
                <input
                  type="tel"
                  placeholder={tr.mobileNumber || 'Mobile Number'}
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full border border-white/20 rounded-lg py-2 px-3 bg-white/10 text-white"
                />
                <input
                  type="text"
                  placeholder={tr.fullName || 'Full Name'}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full border border-white/20 rounded-lg py-2 px-3 bg-white/10 text-white"
                />
                <textarea
                  placeholder={tr.specialInstructionsOptional || 'Special Instructions (optional)'}
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value.slice(0, 600))}
                  className="w-full border border-white/20 rounded-lg py-2 px-3 bg-white/10 text-white"
                />
                <input
                  type="tel"
                  placeholder={tr.contactNumber || 'Contact Number'}
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="w-full border border-white/20 rounded-lg py-2 px-3 bg-white/10 text-white"
                />

                {/* Terms & Conditions Checkbox */}
                <div className="flex items-start gap-3 text-white/80 text-sm pt-2 bg-white/5 p-4 rounded-lg border border-white/10 hover:border-white/20 transition-colors">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="accent-cyan-400 flex-shrink-0 w-4 h-4 mt-0.5 cursor-pointer"
                  />
                  <label className="cursor-pointer">
                    {tr.iAcceptThe || 'I accept the'}{" "}
                    <Link to="/terms-and-conditions" className="text-cyan-300 hover:text-cyan-200 underline font-medium">
                      {tr.termsAndConditions || 'Terms and Conditions'}
                    </Link>
                  </label>
                </div>

                <div className="flex justify-between mt-4">
                  <button onClick={() => goToStep(2)} className="px-4 py-2 text-white border border-white/20 rounded-lg hover:bg-white/10">{tr.back || 'Back'}</button>
                  <button
                    onClick={() => step3Valid && handleBookingSubmit()}
                    disabled={!step3Valid}
                    className={`px-6 py-2 rounded-lg font-semibold flex items-center gap-2 ${
                      step3Valid
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:scale-105"
                        : "bg-white/10 text-white/60 border border-white/20 cursor-not-allowed"
                    }`}
                  >
                    {step3Valid && (
                        null
                    )}
                    {step3Valid ? `${tr.payWithPayPal || 'Pay with PayPal'} - €80` : (tr.completeAllRequiredFields || 'Complete all required fields')}
                  </button>
                  
                  {step3Valid && (
                    <div className="text-center mt-2">
                      <p className="text-white/50 text-xs">
                        {tr.securePaymentPoweredByPayPal || "Secure payment powered by PayPal"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

// Private Chauffeur Modal Component
function PrivateChauffeurModal({ onClose, t }) {
  const [animateIn, setAnimateIn] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    startPoint: '',
    days: 1,
    selectedDates: [],
    pickupTime: '',
    specialRequests: '',
    acceptTerms: false
  });

  const timeSlots = [
    "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
    "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
    "18:00", "19:00", "20:00", "21:00", "22:00"
  ];

  useEffect(() => {
    setAnimateIn(true);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isFormValid = () => {
    return formData.name && 
           formData.email && 
           formData.contactNumber && 
           formData.startPoint && 
           formData.days > 0 &&
           formData.selectedDates.length === formData.days &&
           formData.pickupTime &&
           formData.acceptTerms;
  };

  // Helper functions for date management
  const handleDaysChange = (increment) => {
    const newDays = Math.max(1, formData.days + increment);
    setFormData(prev => ({
      ...prev,
      days: newDays,
      selectedDates: prev.selectedDates.slice(0, newDays) // Trim dates if reducing days
    }));
  };

  const handleDateSelect = (date) => {
    const dateString = date.toLocaleDateString('en-GB');
    setFormData(prev => {
      const newDates = [...prev.selectedDates];
      const existingIndex = newDates.findIndex(d => d === dateString);
      
      if (existingIndex > -1) {
        // Remove date if already selected
        newDates.splice(existingIndex, 1);
      } else if (newDates.length < prev.days) {
        // Add date if under limit
        newDates.push(dateString);
      }
      
      return { ...prev, selectedDates: newDates.sort() };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;

    try {
      const totalPrice = formData.days * 500;
      const orderResponse = await paymentService.createOrder({
        amount: totalPrice,
        currency: 'EUR',
        description: `Private Chauffeur Service - ${formData.days} day(s)`,
        serviceType: 'private_chauffeur',
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.contactNumber,
        bookingDetails: {
          startPoint: formData.startPoint,
          days: formData.days,
          dates: formData.selectedDates,
          pickupTime: formData.pickupTime,
          specialRequests: formData.specialRequests
        }
      });

      if (orderResponse.success) {
        const approvalUrl = orderResponse.links?.find(link => link.rel === 'approve')?.href;
        if (approvalUrl) {
          window.location.href = approvalUrl;
        } else {
          alert(t.paypalRedirectError || 'Unable to redirect to PayPal. Please try again.');
        }
      } else {
        alert(t.orderCreateFailed || 'Failed to create order. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert(t.paymentFailed || 'Payment failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/5 w-48 h-48 bg-gradient-to-r from-slate-400/20 to-gray-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-36 h-36 bg-gradient-to-r from-gray-400/20 to-stone-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-1/6 w-32 h-32 bg-gradient-to-r from-stone-400/20 to-slate-500/20 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className={`relative max-w-lg w-full max-h-[90vh] overflow-y-auto hide-scrollbar transform transition-all duration-500 ease-out ${
        animateIn ? "scale-100 opacity-100" : "scale-95 opacity-0"
      }`}>
        {/* Glassmorphism Container */}
        <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
          {/* Gradient Border Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-400/20 via-gray-400/20 to-stone-500/20 rounded-3xl blur-sm" />
          
          {/* Close Button */}
          <button
            aria-label={t?.close || 'Close'}
            title={t?.close || 'Close'}
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all duration-300 group z-50"
          >
            <span className="text-white text-lg">×</span>
            <span className="pointer-events-none absolute top-0 left-[-60%] h-full w-8 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-[-20deg] opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out group-hover:left-[160%]" />
          </button>
          
          <div className="relative bg-black/30 backdrop-blur-xl rounded-3xl p-6">
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-300 to-gray-400 bg-clip-text text-transparent mb-2">
                {t?.bookPrivateChauffeour || "Book Private Chauffeur"}
              </h2>
              <div className="w-20 h-0.5 bg-gradient-to-r from-slate-500 to-gray-600 mx-auto rounded-full mb-2" />
              <p className="text-white/70 text-sm">
                {t?.premiumChauffeourService || "Premium chauffeur service - €500 per day"}
              </p>
              <div className="text-slate-300 font-bold text-lg mt-2">
                {t?.total500OneDay || "Total"}: €{formData.days * 500} ({formData.days} day{formData.days > 1 ? 's' : ''})
              </div>
            </div>

            {/* Booking Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* CONTACT DETAILS SECTION */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h3 className="text-white font-semibold text-sm mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {t?.contactDetails || "Contact Details"}
                </h3>
                
                {/* Name Field */}
                <div className="mb-3">
                  <label className="block text-white/90 text-xs font-medium mb-1.5">
                    {t?.fullName || "Full Name"} *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all duration-300"
                    placeholder={t?.enterYourFullName || "Enter your full name"}
                  />
                </div>

                {/* Email Field */}
                <div className="mb-3">
                  <label className="block text-white/90 text-xs font-medium mb-1.5">
                    {t?.emailAddress || "Email Address"} *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all duration-300"
                    placeholder={t?.emailExample || "your.email@example.com"}
                  />
                </div>

                {/* Contact Number */}
                <div>
                  <label className="block text-white/90 text-xs font-medium mb-1.5">
                    {t?.contactNumber || "Contact Number"} *
                  </label>
                  <input
                    type="tel"
                    value={formData.contactNumber}
                    onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all duration-300"
                    placeholder={t?.contactNumberExample || "+39 123 456 7890"}
                  />
                </div>
              </div>

              {/* START POINT */}
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {t?.startPickupLocation || "Start Point (Pickup Location)"} *
                </label>
                <input
                  type="text"
                  value={formData.startPoint}
                  onChange={(e) => handleInputChange('startPoint', e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all duration-300"
                  placeholder={t?.hotelNameAddressOrLandmark || "Hotel name, address, or landmark"}
                />
              </div>

              {/* START TIME */}
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {t?.startTime || "Start Time"} *
                </label>
                <ModernTimePicker
                  selected={formData.pickupTime}
                  onSelect={(time) => handleInputChange('pickupTime', time)}
                  placeholder={t?.selectStartTime || "Select start time"}
                  interval={15}
                  startHour={6}
                  endHour={23}
                />
              </div>

              {/* DURATION */}
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  {t?.durationDays || "Duration (Days)"} *
                </label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => handleDaysChange(-1)}
                    disabled={formData.days <= 1}
                    className="w-10 h-10 bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:text-white/30 border border-white/20 rounded-lg flex items-center justify-center text-white font-bold transition-all duration-300"
                  >
                    −
                  </button>
                  <span className="text-white font-semibold text-lg min-w-[3rem] text-center">
                    {formData.days}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDaysChange(1)}
                    className="w-10 h-10 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg flex items-center justify-center text-white font-bold transition-all duration-300"
                  >
                    +
                  </button>
                  <span className="text-white/70 text-sm ml-2">
                    {formData.days} {formData.days > 1 ? (t.daysSelected || 'days selected') : (t.daySelected || 'day selected')}
                  </span>
                </div>
              </div>

              {/* DATE SELECTION */}
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {(t.serviceDates || 'Service Dates')} * ({formData.selectedDates.length}/{formData.days} {(t.selected || 'selected')})
                </label>
                <ModernDatePicker
                  selected={formData.selectedDates.map(dateStr => {
                    const [day, month, year] = dateStr.split('/');
                    return new Date(year, month - 1, day);
                  })}
                  onSelect={handleDateSelect}
                  placeholder={t.clickToSelectDates || 'Click to select dates'}
                  mode="multiple"
                />
                
                {/* Selected Dates Display */}
                {formData.selectedDates.length > 0 && (
                  <div className="mt-3 p-3 bg-white/5 rounded-lg border border-white/10">
                    <h4 className="text-white/90 text-sm font-medium mb-2">{t.selectedDates || 'Selected Dates:'}</h4>
                    <div className="flex flex-wrap gap-2">
                      {formData.selectedDates.map((date, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-slate-500 text-white text-sm rounded-full"
                        >
                          {date}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  {t?.specialRequestsOptional || "Special Requests (Optional)"}
                </label>
                <textarea
                  value={formData.specialRequests}
                  onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all duration-300 resize-none"
                  placeholder={t.anySpecialRequirementsOrDestinations || "Any special requirements or destinations you'd like to visit..."}
                />
              </div>

              {/* Terms & Conditions Checkbox */}
              <div className="flex items-start gap-3 text-white/80 text-sm pt-2 bg-white/5 p-4 rounded-lg border border-white/10 hover:border-white/20 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                  className="accent-slate-400 flex-shrink-0 w-4 h-4 mt-0.5 cursor-pointer"
                />
                <label className="cursor-pointer">
                  {t.iAcceptThe}{" "}
                  <Link to="/terms-and-conditions" className="text-slate-300 hover:text-slate-200 underline font-medium">
                    {t.termsAndConditions}
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isFormValid()}
                className={`w-full mt-6 px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 ${
                  isFormValid()
                    ? "bg-gradient-to-r from-slate-600 to-gray-700 text-white hover:from-slate-700 hover:to-gray-800 hover:scale-105 shadow-lg hover:shadow-slate-500/25"
                    : "bg-white/10 text-white/50 border border-white/20 cursor-not-allowed"
                }`}
              >
                {isFormValid() ? (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    {t.payWithPayPal || 'Pay with PayPal'} - €{formData.days * 500}
                  </>
                ) : (
                  t.completeAllRequiredFields || "Complete all required fields"
                )}
              </button>
              
              {isFormValid() && (
                <div className="text-center mt-3">
                  <p className="text-white/60 text-xs">
                    {t.securePaymentPoweredByPayPal || "Secure payment powered by PayPal"}
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Custom Styles for DatePicker */}
      <style>{`
        .react-datepicker {
          background-color: rgba(31, 41, 55, 0.95) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          border-radius: 12px !important;
          backdrop-filter: blur(20px) !important;
        }
        .react-datepicker__header {
          background-color: rgba(51, 65, 85, 0.8) !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 12px 12px 0 0 !important;
        }
        .react-datepicker__current-month {
          color: white !important;
          font-weight: 600 !important;
        }
        .react-datepicker__day-name {
          color: rgba(156, 163, 175, 1) !important;
          font-weight: 500 !important;
        }
        .react-datepicker__day {
          color: white !important;
          border-radius: 8px !important;
          transition: all 0.2s ease !important;
        }
        .react-datepicker__day:hover {
          background-color: rgba(100, 116, 139, 0.6) !important;
          color: white !important;
        }
        .react-datepicker__day--selected {
          background-color: rgba(100, 116, 139, 1) !important;
          color: white !important;
        }
        .react-datepicker__day--keyboard-selected {
          background-color: rgba(100, 116, 139, 0.8) !important;
          color: white !important;
        }
        .react-datepicker__navigation {
          border: none !important;
        }
        .react-datepicker__navigation-icon::before {
          border-color: white !important;
        }
        .react-datepicker__triangle {
          display: none !important;
        }
      `}</style>
    </div>
  );
}

// Airport Transfer Modal Component
function AirportTransferModal({ onClose, onSelectOption, t }) {
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    setAnimateIn(true);
  }, []);

  const transferOptions = [
    { 
      name: t.upTo2People || "Up to 2 People", 
      price: t.from90OneWay || "From €90 (one way)",
      capacity: "2",
      image: "/AT2.jpeg",
      gradient: "from-amber-400/30 to-orange-500/30",
      hoverColor: "hover:from-amber-400/50 hover:to-orange-500/50"
    },
    { 
      name: t.upTo7People || "Up to 7 People", 
      price: t.from150OneWay || "From €150 (one way)",
      capacity: "7",
      image: "/AT7.jpeg",
      gradient: "from-blue-400/30 to-purple-500/30",
      hoverColor: "hover:from-blue-400/50 hover:to-purple-500/50"
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className={`relative max-w-lg w-full transform transition-all duration-500 ease-out ${
          animateIn ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Glassmorphism Container */}
        <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-yellow-500/10 pointer-events-none" />
          
          {/* Close Button */}
          <button
            aria-label={t.close || 'Close'}
            title={t.close || 'Close'}
            onClick={onClose}
            className="absolute top-3 right-3 w-9 h-9 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all duration-300 group z-50"
          >
            <span className="text-white text-sm">×</span>
            <span className="pointer-events-none absolute top-0 left-[-60%] h-full w-6 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-[-20deg] opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out group-hover:left-[160%]" />
          </button>

          {/* Airport Transfer Image */}
          <div className="relative h-40 overflow-hidden">
            <img
              src="./AT2.jpeg"
              alt="Airport Transfer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>

          <div className="relative p-6">
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-white mb-2">
                {t.airportTransfer}
              </h2>
              <h3 className="text-xl font-semibold text-amber-400 mb-3">
                {t.chooseYourRide}
              </h3>
              <p className="text-white/90 text-sm">
                {t.comfortableReliable}
              </p>
            </div>

            {/* Transfer Options */}
            <div className="flex flex-col gap-4">
              {transferOptions.map((option) => (
                <button
                  key={option.capacity}
                  onClick={() => onSelectOption(option)}
                  className="relative overflow-hidden rounded-xl border border-white/30 hover:border-white/50 transition-all duration-300 shadow-lg group hover:scale-105"
                >
                  <div className="flex gap-4 p-4 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md">
                    {/* Image Section */}
                    <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden rounded-lg">
                      <img
                        src={option.image}
                        alt={option.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>
                    
                    {/* Content Section */}
                    <div className="flex flex-col justify-between flex-1">
                      <div className="text-left">
                        <h4 className="font-bold text-lg text-white">{option.name}</h4>
                        <p className="text-white/90 text-sm mt-1">{option.price}</p>
                      </div>
                      <div className="flex items-center text-amber-400 font-medium text-sm">
                        {t.selectOption || "Select Option"}
                        <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Airport Transfer Booking Modal
function AirportTransferBookingModal({ option, onClose, onBack, t }) {
  const [animateIn, setAnimateIn] = useState(false);
  const [hasReturn, setHasReturn] = useState(false);
  const [formData, setFormData] = useState({
    // Arrival Details
    arrivalAirport: '',
    arrivalDate: '',
    arrivalTime: '',
    arrivalTerminal: '',
    arrivalAirline: '',
    arrivalFlightNumber: '',
    arrivalPickupTime: '',
    
    // Return Details (if selected)
    returnAirport: '',
    returnDate: '',
    returnTime: '',
    returnTerminal: '',
    returnAirline: '',
    returnFlightNumber: '',
    returnPickupTime: '',
    returnPickupAddress: '',
    
    // Customer Details
    customerName: '',
    customerPhone: ''
  });

  useEffect(() => {
    setAnimateIn(true);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isFormValid = () => {
    const arrivalValid = formData.arrivalAirport && 
                        formData.arrivalDate && 
                        formData.arrivalTime && 
                        formData.arrivalTerminal && 
                        formData.arrivalAirline && 
                        formData.arrivalFlightNumber && 
                        formData.arrivalPickupTime &&
                        formData.customerName &&
                        formData.customerPhone;
    
    if (!hasReturn) return arrivalValid;
    
    const returnValid = formData.returnAirport && 
                       formData.returnDate && 
                       formData.returnTime && 
                       formData.returnTerminal && 
                       formData.returnAirline && 
                       formData.returnFlightNumber && 
                       formData.returnPickupTime &&
                       formData.returnPickupAddress;
    
    return arrivalValid && returnValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;

    try {
      const basePrice = option.capacity === "2" ? 90 : 150;
      const totalPrice = hasReturn ? basePrice * 2 : basePrice;
      
      const orderResponse = await paymentService.createOrder({
        amount: totalPrice,
        currency: 'EUR',
        description: `Airport Transfer - ${option.name} ${hasReturn ? '(Round Trip)' : '(One Way)'}`,
        serviceType: 'airport_transfer',
        customerName: formData.customerName,
        customerEmail: 'guest@example.com',
        customerPhone: formData.customerPhone,
        bookingDetails: {
          vehicleType: option.name,
          capacity: option.capacity,
          tripType: hasReturn ? 'Round Trip' : 'One Way',
          arrivalAirport: formData.arrivalAirport,
          arrivalDate: formData.arrivalDate,
          arrivalTime: formData.arrivalTime,
          returnAirport: formData.returnAirport,
          returnDate: formData.returnDate,
          returnTime: formData.returnTime
        }
      });

      if (orderResponse.success) {
        const approvalUrl = orderResponse.links?.find(link => link.rel === 'approve')?.href;
        if (approvalUrl) {
          window.location.href = approvalUrl;
        } else {
          alert(t.paypalRedirectError || 'Unable to redirect to PayPal. Please try again.');
        }
      } else {
        alert(t.orderCreateFailed || 'Failed to create order. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert(t.paymentFailed || 'Payment failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className={`relative max-w-2xl w-full max-h-[90vh] overflow-y-auto hide-scrollbar transform transition-all duration-500 ease-out ${
          animateIn ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Glassmorphism Container */}
        <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-yellow-500/10 pointer-events-none" />
          
          {/* Close Button */}
          <button
            aria-label={t.close || 'Close'}
            title={t.close || 'Close'}
            onClick={onClose}
            className="absolute top-3 right-3 w-9 h-9 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all duration-300 group z-50"
          >
            <span className="text-white text-sm">×</span>
          </button>

          {/* Back Button */}
          <button
            aria-label={t.back || 'Back'}
            title={t.back || 'Back'}
            onClick={onBack}
            className="absolute top-3 left-3 w-9 h-9 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all duration-300 group z-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="relative p-6 pt-14">
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                {t.bookAirportTransfer}
              </h2>
              <h3 className="text-lg font-semibold text-amber-400 mb-2">
                {option.name} - {option.price}
              </h3>
            </div>

            {/* Booking Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Return Booking Checkbox */}
              <div className="flex items-center space-x-3 mb-6">
                <input
                  type="checkbox"
                  id="returnBooking"
                  checked={hasReturn}
                  onChange={(e) => setHasReturn(e.target.checked)}
                  className="w-4 h-4 text-amber-600 bg-white/10 border-white/20 rounded focus:ring-amber-500"
                />
                <label htmlFor="returnBooking" className="text-white font-medium">
                  {t.returnBooking || "Return Booking"}
                </label>
              </div>

              {/* Arrival Details */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h4 className="text-white font-semibold mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  {t.arrivalDetails || "Arrival Details"}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Airport Selection */}
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">{t.selectAirport || "Select Airport"} *</label>
                    <select
                      value={formData.arrivalAirport}
                      onChange={(e) => handleInputChange('arrivalAirport', e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all duration-300"
                    >
                      <option value="" className="bg-gray-800">{t.selectAirport || "Select Airport"}</option>
                      <option value="Fiumicino Airport" className="bg-gray-800">{t.fiumicinoAirport || "Fiumicino Airport"}</option>
                      <option value="Ciampino Airport" className="bg-gray-800">{t.ciampinoAirport || "Ciampino Airport"}</option>
                    </select>
                  </div>

                  {/* Arrival Date */}
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">{t.arrivalDate || "Arrival Date"} *</label>
                    <input
                      type="date"
                      value={formData.arrivalDate}
                      onChange={(e) => handleInputChange('arrivalDate', e.target.value)}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all duration-300"
                    />
                  </div>

                  {/* Arrival Time */}
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">{t.arrivalTime || "Arrival Time"} *</label>
                    <input
                      type="time"
                      value={formData.arrivalTime}
                      onChange={(e) => handleInputChange('arrivalTime', e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all duration-300"
                    />
                  </div>

                  {/* Terminal */}
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">{t.terminal || "Terminal"} *</label>
                    <input
                      type="text"
                      value={formData.arrivalTerminal}
                      onChange={(e) => handleInputChange('arrivalTerminal', e.target.value)}
                      required
                      placeholder={t.terminalExample || "e.g., Terminal 1"}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all duration-300"
                    />
                  </div>

                  {/* Airline Name */}
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">{t.airlineName || "Airline Name"} *</label>
                    <input
                      type="text"
                      value={formData.arrivalAirline}
                      onChange={(e) => handleInputChange('arrivalAirline', e.target.value)}
                      required
                      placeholder={t.airlineExample || "e.g., Lufthansa"}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all duration-300"
                    />
                  </div>

                  {/* Flight Number */}
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">{t.flightNumber || "Flight Number"} *</label>
                    <input
                      type="text"
                      value={formData.arrivalFlightNumber}
                      onChange={(e) => handleInputChange('arrivalFlightNumber', e.target.value)}
                      required
                      placeholder={t.flightNumberExample || "e.g., LH1234"}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Pick-up Time 
                <div className="mt-4">
                  <label className="block text-white/90 text-sm font-medium mb-2">Pick-up Time *</label>
                  <input
                    type="text"
                    value={formData.arrivalPickupTime}
                    onChange={(e) => handleInputChange('arrivalPickupTime', e.target.value)}
                    required
                    placeholder="Please add Rome's Local Time"
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all duration-300"
                  />
                </div> */}
              </div>

              {/* Return Details (if selected) */}
              {hasReturn && (
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h4 className="text-white font-semibold mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14l-4-4m4 4l4-4" />
                    </svg>
                    {t.returnDetails || "Return Details"}
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Return Airport */}
                    <div>
                      <label className="block text-white/90 text-sm font-medium mb-2">{t.selectAirport || "Select Airport"} *</label>
                      <select
                        value={formData.returnAirport}
                        onChange={(e) => handleInputChange('returnAirport', e.target.value)}
                        required={hasReturn}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all duration-300"
                      >
                        <option value="" className="bg-gray-800">{t.selectAirport || "Select Airport"}</option>
                        <option value="Fiumicino Airport" className="bg-gray-800">{t.fiumicinoAirport || "Fiumicino Airport"}</option>
                        <option value="Ciampino Airport" className="bg-gray-800">{t.ciampinoAirport || "Ciampino Airport"}</option>
                      </select>
                    </div>

                    {/* Return Date */}
                    <div>
                      <label className="block text-white/90 text-sm font-medium mb-2">{t.returnDate || "Return Date"} *</label>
                      <input
                        type="date"
                        value={formData.returnDate}
                        onChange={(e) => handleInputChange('returnDate', e.target.value)}
                        required={hasReturn}
                        min={formData.arrivalDate || new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all duration-300"
                      />
                    </div>

                    {/* Return Time */}
                    <div>
                      <label className="block text-white/90 text-sm font-medium mb-2">{t.returnTime || "Return Time"} *</label>
                      <input
                        type="time"
                        value={formData.returnTime}
                        onChange={(e) => handleInputChange('returnTime', e.target.value)}
                        required={hasReturn}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all duration-300"
                      />
                    </div>

                    {/* Return Terminal */}
                    <div>
                      <label className="block text-white/90 text-sm font-medium mb-2">{t.returnTerminal || "Return Terminal"} *</label>
                      <input
                        type="text"
                        value={formData.returnTerminal}
                        onChange={(e) => handleInputChange('returnTerminal', e.target.value)}
                        required={hasReturn}
                        placeholder={t.terminalExample || "e.g., Terminal 1"}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all duration-300"
                      />
                    </div>

                    {/* Return Airline */}
                    <div>
                      <label className="block text-white/90 text-sm font-medium mb-2">{t.returnAirline || "Return Airline"} *</label>
                      <input
                        type="text"
                        value={formData.returnAirline}
                        onChange={(e) => handleInputChange('returnAirline', e.target.value)}
                        required={hasReturn}
                        placeholder={t.airlineExample || "e.g., Lufthansa"}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all duration-300"
                      />
                    </div>

                    {/* Return Flight Number */}
                    <div>
                      <label className="block text-white/90 text-sm font-medium mb-2">{t.returnFlightNumber || "Return Flight Number"} *</label>
                      <input
                        type="text"
                        value={formData.returnFlightNumber}
                        onChange={(e) => handleInputChange('returnFlightNumber', e.target.value)}
                        required={hasReturn}
                        placeholder={t.flightNumberExample || "e.g., LH1234"}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* Return Pick-up Time and Address */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-white/90 text-sm font-medium mb-2">{t.pickupTime || "Pick-up Time"} *</label>
                      <input
                        type="text"
                        value={formData.returnPickupTime}
                        onChange={(e) => handleInputChange('returnPickupTime', e.target.value)}
                        required={hasReturn}
                        placeholder={t.pleaseAddRomesLocalTime || "Please add Rome's Local Time"}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all duration-300"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-white/90 text-sm font-medium mb-2">{t.returnPickupAddress || "Return Pick-up Address"} *</label>
                      <input
                        type="text"
                        value={formData.returnPickupAddress}
                        onChange={(e) => handleInputChange('returnPickupAddress', e.target.value)}
                        required={hasReturn}
                        placeholder={t.pleaseProvideCompleteAddress || "Please provide complete address"}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all duration-300"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Customer Details */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h4 className="text-white font-semibold mb-4">{t.customerDetails || "Customer Details"}</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">{t.fullName || "Full Name"} *</label>
                    <input
                      type="text"
                      value={formData.customerName}
                      onChange={(e) => handleInputChange('customerName', e.target.value)}
                      required
                      placeholder={t.enterYourFullName || "Enter your full name"}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all duration-300"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">{t.phoneNumber || "Phone Number"} *</label>
                    <input
                      type="tel"
                      value={formData.customerPhone}
                      onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                      required
                      placeholder={t.phoneNumberExample || "+39 123 456 7890"}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all duration-300"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isFormValid()}
                className={`w-full mt-6 px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 ${
                  isFormValid()
                    ? "bg-gradient-to-r from-amber-600 to-orange-700 text-white hover:from-amber-700 hover:to-orange-800 hover:scale-105 shadow-lg hover:shadow-amber-500/25"
                    : "bg-white/10 text-white/50 border border-white/20 cursor-not-allowed"
                }`}
              >
                {isFormValid() ? (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    {t.payWithPayPal || "Pay with PayPal"} - €{hasReturn ? (option.capacity === "2" ? 180 : 300) : (option.capacity === "2" ? 90 : 150)}
                  </>
                ) : (
                  t.completeAllRequiredFields || "Complete all required fields"
                )}
              </button>
              
              {isFormValid() && (
                <div className="text-center mt-3">
                  <p className="text-white/60 text-xs">
                    {t.securePaymentPoweredByPayPal || "Secure payment powered by PayPal"}
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// Car Rental Details Modal - Collect Dates and User Info
function CarRentalDetailsModal({ car, category, onClose, onConfirm, t }) {
  const [animateIn, setAnimateIn] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    fromDate: null,
    toDate: null,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setAnimateIn(true);
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = t.fullNameRequired || "Full name is required";
    }
    
    if (!formData.age || formData.age < 18 || formData.age > 120) {
      newErrors.age = t.ageMustBeBetween || "Age must be between 18 and 120";
    }
    
    if (!formData.fromDate) {
      newErrors.fromDate = t.fromDateRequired || "From date is required";
    }
    
    if (!formData.toDate) {
      newErrors.toDate = t.toDateRequired || "To date is required";
    }
    
    if (formData.fromDate && formData.toDate && formData.fromDate >= formData.toDate) {
      newErrors.toDate = t.toDateMustBeAfterFromDate || "To date must be after from date";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleDateChange = (date, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: date
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleConfirm = () => {
    if (validateForm()) {
      const priceMatch = car.price.match(/€(\d+)/);
      const dailyPrice = priceMatch ? parseInt(priceMatch[1]) : 150;
      
      // Calculate rental days
      const timeDiff = formData.toDate - formData.fromDate;
      const rentalDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      const totalPrice = dailyPrice * rentalDays;

      onConfirm({
        ...formData,
        car: car.name,
        carType: car.type,
        category: category,
        dailyPrice: dailyPrice,
        rentalDays: rentalDays,
        totalPrice: totalPrice
      });
    }
  };

  const calculateDays = () => {
    if (formData.fromDate && formData.toDate) {
      const timeDiff = formData.toDate - formData.fromDate;
      return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    }
    return 0;
  };

  const priceMatch = car.price.match(/€(\d+)/);
  const dailyPrice = priceMatch ? parseInt(priceMatch[1]) : 150;
  const rentalDays = calculateDays();
  const totalPrice = dailyPrice * rentalDays;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className={`relative max-w-lg w-full transform transition-all duration-500 ease-out ${
          animateIn ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Glassmorphism Container */}
        <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10 pointer-events-none" />
          
          {/* Close Button */}
          <button
            aria-label={t.close || 'Close'}
            title={t.close || 'Close'}
            onClick={onClose}
            className="absolute top-3 right-3 w-9 h-9 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all duration-300 group z-50"
          >
            <span className="text-white text-sm">×</span>
            <span className="pointer-events-none absolute top-0 left-[-60%] h-full w-6 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-[-20deg] opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out group-hover:left-[160%]" />
          </button>

          <div className="relative p-6">
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                {t.carRentalDetailsTitle}
              </h2>
              <p className="text-emerald-300 font-semibold mb-1">
                {car.name}
              </p>
              <p className="text-white/70 text-sm">
                {car.type} • {category}
              </p>
            </div>

            {/* Form */}
            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-white font-semibold text-sm mb-2">
                  {t.fullName} *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder={t.enterYourFullName}
                  className={`w-full px-4 py-2.5 bg-white/10 border ${
                    errors.fullName ? "border-red-400" : "border-white/30"
                  } rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-emerald-400 focus:bg-white/20 transition-all duration-300`}
                />
                {errors.fullName && (
                  <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>
                )}
              </div>

              {/* Age */}
              <div>
                <label className="block text-white font-semibold text-sm mb-2">
                  {t.age} *
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder={t.enterYourAge}
                  min="18"
                  max="120"
                  className={`w-full px-4 py-2.5 bg-white/10 border ${
                    errors.age ? "border-red-400" : "border-white/30"
                  } rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-emerald-400 focus:bg-white/20 transition-all duration-300`}
                />
                {errors.age && (
                  <p className="text-red-400 text-xs mt-1">{errors.age}</p>
                )}
              </div>

              {/* From Date */}
              <div>
                <label className="block text-white font-semibold text-sm mb-2">
                  {t.fromDate} *
                </label>
                <DatePicker
                  selected={formData.fromDate}
                  onChange={(date) => handleDateChange(date, "fromDate")}
                  minDate={new Date()}
                  placeholderText={t.selectFromDate}
                  className={`w-full px-4 py-2.5 bg-white/10 border ${
                    errors.fromDate ? "border-red-400" : "border-white/30"
                  } rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-emerald-400 focus:bg-white/20 transition-all duration-300`}
                  wrapperClassName="w-full"
                  dateFormat="dd/MM/yyyy"
                />
                {errors.fromDate && (
                  <p className="text-red-400 text-xs mt-1">{errors.fromDate}</p>
                )}
              </div>

              {/* To Date */}
              <div>
                <label className="block text-white font-semibold text-sm mb-2">
                  {t.toDate} *
                </label>
                <DatePicker
                  selected={formData.toDate}
                  onChange={(date) => handleDateChange(date, "toDate")}
                  minDate={formData.fromDate || new Date()}
                  placeholderText={t.selectToDate}
                  className={`w-full px-4 py-2.5 bg-white/10 border ${
                    errors.toDate ? "border-red-400" : "border-white/30"
                  } rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-emerald-400 focus:bg-white/20 transition-all duration-300`}
                  wrapperClassName="w-full"
                  dateFormat="dd/MM/yyyy"
                />
                {errors.toDate && (
                  <p className="text-red-400 text-xs mt-1">{errors.toDate}</p>
                )}
              </div>

              {/* Price Summary */}
              {rentalDays > 0 && (
                <div className="relative bg-emerald-500/20 backdrop-blur-md border border-emerald-300/30 rounded-xl p-4 mt-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-teal-500/20 rounded-xl" />
                  <div className="relative space-y-2">
                    <div className="flex justify-between text-white/90 text-sm">
                      <span>{t.dailyRate || 'Daily Rate:'}</span>
                      <span>€{dailyPrice}</span>
                    </div>
                    <div className="flex justify-between text-white/90 text-sm">
                      <span>{t.rentalDaysLabel || 'Rental Days:'}</span>
                      <span>{rentalDays}</span>
                    </div>
                    <div className="border-t border-emerald-300/30 pt-2 mt-2 flex justify-between text-white font-bold">
                      <span>{t.totalPriceLabel || 'Total Price:'}</span>
                      <span className="text-emerald-300">€{totalPrice}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 bg-white/10 border border-white/30 text-white font-semibold rounded-lg hover:bg-white/20 hover:border-white/50 transition-all duration-300"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 hover:scale-105"
                >
                  {t.proceedToPayment}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Car Rental Booking Modal - Collect Customer Details
function CarRentalBookingModal({ car, category, onClose, onConfirm, t }) {
  const tr = t || carServicesTranslations.en;
  const [animateIn, setAnimateIn] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    fromDate: null,
    toDate: null,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setAnimateIn(true);
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = tr.fullNameRequired || "Full name is required";
    }
    
    if (!formData.age || formData.age < 18 || formData.age > 120) {
      newErrors.age = tr.ageMustBeBetween || "Age must be between 18 and 120";
    }
    
    if (!formData.fromDate) {
      newErrors.fromDate = tr.fromDateRequired || "From date is required";
    }
    
    if (!formData.toDate) {
      newErrors.toDate = tr.toDateRequired || "To date is required";
    }
    
    if (formData.fromDate && formData.toDate && formData.fromDate >= formData.toDate) {
      newErrors.toDate = tr.toDateMustBeAfterFromDate || "To date must be after from date";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleDateChange = (date, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: date
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleConfirm = () => {
    if (validateForm()) {
      const priceMatch = car.price.match(/€(\d+)/);
      const dailyPrice = priceMatch ? parseInt(priceMatch[1]) : 150;
      
      // Calculate rental days
      const timeDiff = formData.toDate - formData.fromDate;
      const rentalDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      const totalPrice = dailyPrice * rentalDays;

      onConfirm({
        ...formData,
        car: car.name,
        carType: car.type,
        category: category,
        dailyPrice: dailyPrice,
        rentalDays: rentalDays,
        totalPrice: totalPrice
      });
    }
  };

  const calculateDays = () => {
    if (formData.fromDate && formData.toDate) {
      const timeDiff = formData.toDate - formData.fromDate;
      return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    }
    return 0;
  };

  const priceMatch = car.price.match(/€(\d+)/);
  const dailyPrice = priceMatch ? parseInt(priceMatch[1]) : 150;
  const rentalDays = calculateDays();
  const totalPrice = dailyPrice * rentalDays;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className={`relative max-w-lg w-full transform transition-all duration-500 ease-out ${
          animateIn ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Glassmorphism Container */}
        <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10 pointer-events-none" />
          
          {/* Close Button */}
          <button
            aria-label={tr.close || 'Close'}
            title={tr.close || 'Close'}
            onClick={onClose}
            className="absolute top-3 right-3 w-9 h-9 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all duration-300 group z-50"
          >
            <span className="text-white text-sm">×</span>
            <span className="pointer-events-none absolute top-0 left-[-60%] h-full w-6 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-[-20deg] opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out group-hover:left-[160%]" />
          </button>

          <div className="relative p-6">
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                {tr.carRentalDetailsTitle || 'Complete Your Booking'}
              </h2>
              <p className="text-emerald-300 font-semibold mb-1">
                {car.name}
              </p>
              <p className="text-white/70 text-sm">
                {car.type} • {category}
              </p>
            </div>

            {/* Form */}
            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-white font-semibold text-sm mb-2">
                  {tr.fullName || 'Full Name'} *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder={tr.enterYourFullName || 'Enter your full name'}
                  className={`w-full px-4 py-2.5 bg-white/10 border ${
                    errors.fullName ? "border-red-400" : "border-white/30"
                  } rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-emerald-400 focus:bg-white/20 transition-all duration-300`}
                />
                {errors.fullName && (
                  <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>
                )}
              </div>

              {/* Age */}
              <div>
                <label className="block text-white font-semibold text-sm mb-2">
                  {tr.age || 'Age'} *
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder={tr.enterYourAge || 'Enter your age'}
                  min="18"
                  max="120"
                  className={`w-full px-4 py-2.5 bg-white/10 border ${
                    errors.age ? "border-red-400" : "border-white/30"
                  } rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-emerald-400 focus:bg-white/20 transition-all duration-300`}
                />
                {errors.age && (
                  <p className="text-red-400 text-xs mt-1">{errors.age}</p>
                )}
              </div>

              {/* From Date */}
              <div>
                <label className="block text-white font-semibold text-sm mb-2">
                  {tr.fromDate || 'From Date'} *
                </label>
                <DatePicker
                  selected={formData.fromDate}
                  onChange={(date) => handleDateChange(date, "fromDate")}
                  minDate={new Date()}
                  placeholderText={tr.selectFromDate || 'Select from date'}
                  className={`w-full px-4 py-2.5 bg-white/10 border ${
                    errors.fromDate ? "border-red-400" : "border-white/30"
                  } rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-emerald-400 focus:bg-white/20 transition-all duration-300`}
                  wrapperClassName="w-full"
                  dateFormat="dd/MM/yyyy"
                />
                {errors.fromDate && (
                  <p className="text-red-400 text-xs mt-1">{errors.fromDate}</p>
                )}
              </div>

              {/* To Date */}
              <div>
                <label className="block text-white font-semibold text-sm mb-2">
                  {tr.toDate || 'To Date'} *
                </label>
                <DatePicker
                  selected={formData.toDate}
                  onChange={(date) => handleDateChange(date, "toDate")}
                  minDate={formData.fromDate || new Date()}
                  placeholderText={tr.selectToDate || 'Select to date'}
                  className={`w-full px-4 py-2.5 bg-white/10 border ${
                    errors.toDate ? "border-red-400" : "border-white/30"
                  } rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-emerald-400 focus:bg-white/20 transition-all duration-300`}
                  wrapperClassName="w-full"
                  dateFormat="dd/MM/yyyy"
                />
                {errors.toDate && (
                  <p className="text-red-400 text-xs mt-1">{errors.toDate}</p>
                )}
              </div>

              {/* Price Summary */}
              {rentalDays > 0 && (
                <div className="relative bg-emerald-500/20 backdrop-blur-md border border-emerald-300/30 rounded-xl p-4 mt-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-teal-500/20 rounded-xl" />
                  <div className="relative space-y-2">
                    <div className="flex justify-between text-white/90 text-sm">
                      <span>{tr.dailyRate || 'Daily Rate:'}</span>
                      <span>€{dailyPrice}</span>
                    </div>
                    <div className="flex justify-between text-white/90 text-sm">
                      <span>{tr.rentalDaysLabel || 'Rental Days:'}</span>
                      <span>{rentalDays}</span>
                    </div>
                    <div className="border-t border-emerald-300/30 pt-2 mt-2 flex justify-between text-white font-bold">
                      <span>{tr.totalPriceLabel || 'Total Price:'}</span>
                      <span className="text-emerald-300">€{totalPrice}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 bg-white/10 border border-white/30 text-white font-semibold rounded-lg hover:bg-white/20 hover:border-white/50 transition-all duration-300"
                >
                  {tr.cancel || 'Cancel'}
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 hover:scale-105"
                >
                  {tr.proceedToPayment || 'Proceed to Payment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Car Rental Modal - First Level (Category Selection)
function CarRentalModal({ onClose, onSelectCategory, t }) {
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    setAnimateIn(true);
  }, []);

  const categories = [
    { name: t.premiumCars, color: "from-amber-400/30 to-orange-500/30", hoverColor: "hover:from-amber-400/50 hover:to-orange-500/50" },
    { name: t.luxuryCars, color: "from-purple-400/30 to-pink-500/30", hoverColor: "hover:from-purple-400/50 hover:to-pink-500/50" },
    { name: t.supercars, color: "from-red-400/30 to-rose-500/30", hoverColor: "hover:from-red-400/50 hover:to-rose-500/50" }
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className={`relative max-w-lg w-full transform transition-all duration-500 ease-out ${
          animateIn ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Glassmorphism Container */}
        <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 pointer-events-none" />
          
          {/* Close Button */}
          <button
            aria-label={t.close || 'Close'}
            title={t.close || 'Close'}
            onClick={onClose}
            className="absolute top-3 right-3 w-9 h-9 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all duration-300 group z-50"
          >
            <span className="text-white text-sm">×</span>
            <span className="pointer-events-none absolute top-0 left-[-60%] h-full w-6 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-[-20deg] opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out group-hover:left-[160%]" />
          </button>

          {/* Car Image */}
          <div className="relative h-40 overflow-hidden">
            <img
              src="./bluelam.webp"
              alt="Car Rental"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>

          <div className="relative p-6">
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-white mb-2">
                {t.carRentalTitle}
              </h2>
              <h3 className="text-xl font-semibold text-amber-400 mb-3">
                {t.carRentalSubtitle}
              </h3>
              <p className="text-white/90 text-sm">
                {t.allOurCarsComeWithFullCasco}
              </p>
            </div>

            {/* Note Section - Glass Card */}
            <div className="relative bg-amber-500/20 backdrop-blur-md border border-amber-300/30 rounded-xl p-4 mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-xl" />
              <div className="relative">
                <h4 className="text-white font-bold text-sm mb-2">{t.note}</h4>
                <ul className="text-white/90 text-xs space-y-1.5">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{t.theseOptionsAreAvailableOnlyOnRequest}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{t.theCarTypeDependsOnAvailability}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Category Buttons - Glass Effect */}
            <div className="flex flex-col gap-3">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => onSelectCategory(category.name)}
                  className={`relative px-6 py-3 bg-gradient-to-r ${category.color} backdrop-blur-md border border-white/30 text-white font-semibold rounded-xl ${category.hoverColor} hover:scale-105 hover:border-white/50 transition-all duration-300 shadow-lg`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Car Category Modal - Second Level (Specific Cars)
function CarCategoryModal({ category, onClose, onBack, onSelectCar, t }) {
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    setAnimateIn(true);
  }, []);

  const handleCarBooking = (car) => {
    // Open the details modal instead of directly booking
    onSelectCar(car, category);
  };

  const carData = {
    [t.premiumCars]: [
      {
        name: t.fiat500OrSimilar,
        type: t.small,
        price: t.startingFrom80PerDay,
        image: "./Fiat.jpg",
        gradient: "from-amber-500/30 to-orange-500/30"
      },
      {
        name: t.alfaRomeoGiuliaOrSimilar,
        type: t.saloon,
        price: t.startingFrom150PerDay,
        image: "./alpharomero.webp",
        gradient: "from-amber-400/30 to-yellow-500/30"
      },
      {
        name: t.alfaRomeoStelviolOrSimilar,
        type: t.suv,
        price: t.startingFrom150ADay,
        image: "./black.jpg",
        gradient: "from-orange-500/30 to-red-500/30"
      }
    ],
    [t.luxuryCars]: [
      {
        name: t.fiatAbarthOrSimilar,
        type: t.small,
        price: t.startingFrom200PerDay,
        image: "./abark.webp",
        gradient: "from-purple-500/30 to-pink-500/30"
      },
      {
        name: t.mercedesEOrSimilar,
        type: t.saloon,
        price: t.startingFrom250PerDay,
        image: "./mercedes.webp",
        gradient: "from-indigo-500/30 to-purple-500/30"
      },
      {
        name: t.rangeRoverSportOrSimilar,
        type: t.suv,
        price: t.startingFrom250PerDay,
        image: "./rr.webp",
        gradient: "from-pink-500/30 to-rose-500/30"
      }
    ],
    [t.supercars]: [
      {
        name: t.lamborghiniFerrariEtc,
        type: t.supercars,
        price: t.startingFrom400PerDay,
        image: "./lamborgini.webp",
        gradient: "from-red-500/30 to-rose-600/30"
      }
    ]
  };

  const cars = carData[category] || [];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className={`relative max-w-lg w-full max-h-[85vh] overflow-y-auto hide-scrollbar transform transition-all duration-500 ease-out ${
          animateIn ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Glassmorphism Container */}
        <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 pointer-events-none" />
          
          {/* Close Button */}
          <button
            aria-label={t.close || 'Close'}
            title={t.close || 'Close'}
            onClick={onClose}
            className="absolute top-3 right-3 w-9 h-9 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all duration-300 group z-50"
          >
            <span className="text-white text-sm">×</span>
            <span className="pointer-events-none absolute top-0 left-[-60%] h-full w-6 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-[-20deg] opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out group-hover:left-[160%]" />
          </button>

          {/* Back Button */}
          <button
            aria-label={t.back || 'Back'}
            title={t.back || 'Back'}
            onClick={onBack}
            className="absolute top-3 left-3 w-9 h-9 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all duration-300 group z-50"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="pointer-events-none absolute top-0 left-[-60%] h-full w-6 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-[-20deg] opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out group-hover:left-[160%]" />
          </button>

          <div className="relative p-6 pt-14">
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-white mb-2">
                {t.carRentalTitle}
              </h2>
              <h3 className="text-xl font-semibold text-purple-400 mb-3">
                {category}
              </h3>
              <p className="text-white/90 text-sm">
                {t.allOurCarsComeWithFullCasco}
              </p>
            </div>

            {/* Car Options - Glass Cards */}
            <div className="space-y-3">
              {cars.map((car, index) => (
                <div
                  key={index}
                  className={`relative group flex items-center gap-3 bg-gradient-to-r ${car.gradient} backdrop-blur-md border border-white/30 rounded-xl p-3 hover:scale-[1.02] hover:border-white/50 transition-all duration-300 cursor-pointer shadow-lg`}
                >
                  {/* Glass Effect Overlay */}
                  <div className="absolute inset-0 bg-white/5 rounded-xl pointer-events-none" />
                  
                  {/* Car Image */}
                  <div className="relative w-24 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-white/20">
                    <img
                      src={car.image}
                      alt={car.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  {/* Car Details */}
                  <div className="relative flex-grow text-white">
                    <h4 className="text-base font-bold mb-0.5">{car.type}</h4>
                    <p className="text-sm font-semibold mb-1">{car.name}</p>
                    <p className="text-xs opacity-90 mb-2">{car.price}</p>
                    
                    {/* PayPal Book Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCarBooking(car);
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:scale-105"
                    >
                      {t.continue}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default function Seamless() {
  const { language } = useContext(LanguageContext);
  const langMap = { 'EN': 'en', 'ES': 'es', 'RU': 'ru' };
  const currentLang = langMap[language] || 'en';
  const t = carServicesTranslations[currentLang];

  const [isOpen, setIsOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [paymentModal, setPaymentModal] = useState({
    isOpen: false,
    packageType: "",
    price: 0,
  });
  const [isFullMenuOpen, setFullMenuOpen] = useState(false);
  
  // Car Rental Modal State
  const [carRentalModal, setCarRentalModal] = useState({
    isOpen: false,
    selectedCategory: null
  });

  // Car Rental Booking Modal State
  const [carRentalBookingModal, setCarRentalBookingModal] = useState({
    isOpen: false,
    selectedCar: null,
    selectedCategory: null
  });

  // Car Rental Details Modal State
  const [carRentalDetailsModal, setCarRentalDetailsModal] = useState({
    isOpen: false,
    selectedCar: null,
    selectedCategory: null
  });

  // Private Chauffeur Modal State
  const [privateChauffeurModal, setPrivateChauffeurModal] = useState(false);

  // Airport Transfer Modal State
  const [airportTransferModal, setAirportTransferModal] = useState({
    isOpen: false,
    selectedOption: null
  });

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const sectionCards = [
    {
      image: "./AT2.jpeg",
      title: t.airportTransfer,
      description: t.mainSubtitle,
      packageType: t.airportTransfer,
      price: t.airportTransferPrice,
      serviceType: "airport_transfer",
      gradient: "from-yellow-400 via-amber-500 to-orange-600",
    },
    {
      image: "./AT7.jpeg",
      title: t.privateChauffeour,
      description: t.mainDescription,
      packageType: t.privateChauffeour,
      price: t.privateChauffeurPrice,
      serviceType: "private_chauffeur",
      gradient: "from-slate-400 via-gray-500 to-stone-600",
    },
    {
      image: "./bluelam.webp",
      title: t.carRental,
      description: t.mainDescription,
      packageType: t.carRental,
      price: t.carRentalPrice,
      serviceType: "car_rental",
      gradient: "from-slate-400 via-gray-500 to-stone-600",
    },
  ];


  const closePaymentModal = () => {
    setPaymentModal({ isOpen: false, packageType: "", price: 0 });
  };

  const handleSelectCategory = (category) => {
    setCarRentalModal({ isOpen: true, selectedCategory: category });
  };

  const handleBackToCategories = () => {
    setCarRentalModal({ isOpen: true, selectedCategory: null });
  };

  const closeCarRentalModal = () => {
    setCarRentalModal({ isOpen: false, selectedCategory: null });
  };

  const handleSelectCar = (car, category) => {
    setCarRentalDetailsModal({ isOpen: true, selectedCar: car, selectedCategory: category });
  };

  const closeCarRentalDetailsModal = () => {
    setCarRentalDetailsModal({ isOpen: false, selectedCar: null, selectedCategory: null });
  };

  const handleCarRentalConfirm = async (bookingData) => {
    try {
      const orderResponse = await paymentService.createOrder({
        amount: bookingData.totalPrice,
        currency: 'EUR',
        description: `Car Rental - ${bookingData.car} (${bookingData.carType})`,
        serviceType: 'car_rental',
        customerName: bookingData.fullName,
        customerEmail: 'guest@example.com',
        customerPhone: '0000000000',
        bookingDetails: {
          car: bookingData.car,
          carType: bookingData.carType,
          category: bookingData.category,
          age: bookingData.age,
          fromDate: bookingData.fromDate.toLocaleDateString(),
          toDate: bookingData.toDate.toLocaleDateString(),
          rentalDays: bookingData.rentalDays,
          dailyPrice: bookingData.dailyPrice
        }
      });

      if (orderResponse.success) {
        const approvalUrl = orderResponse.links?.find(link => link.rel === 'approve')?.href;
        if (approvalUrl) {
          window.location.href = approvalUrl;
        } else {
          alert(t.paypalRedirectError || 'Unable to redirect to PayPal. Please try again.');
        }
      } else {
        alert(t.orderCreateFailed || 'Failed to create order. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert(t.paymentFailed || 'Payment failed. Please try again.');
    }
    closeCarRentalDetailsModal();
    closeCarRentalModal();
  };

  const closePrivateChauffeurModal = () => {
    setPrivateChauffeurModal(false);
  };

  const handleSelectAirportOption = (option) => {
    setAirportTransferModal({ isOpen: true, selectedOption: option });
  };

  const handleBackToAirportOptions = () => {
    setAirportTransferModal({ isOpen: true, selectedOption: null });
  };

  const closeAirportTransferModal = () => {
    setAirportTransferModal({ isOpen: false, selectedOption: null });
  };


  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Fixed Background */}
      <div 
        className="fixed inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('/seamless.webp')"
        }}
      />
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-transparent z-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40 z-0" />

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute top-60 right-20 w-24 h-24 bg-gradient-to-r from-amber-400/20 to-orange-500/20 rounded-full blur-xl animate-pulse delay-1000" />
      <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-gradient-to-r from-emerald-400/20 to-teal-500/20 rounded-full blur-xl animate-pulse delay-2000" />
              <FullscreenMenu isOpen={isFullMenuOpen} setIsOpen={setFullMenuOpen} />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Elite Premium Navbar */}
        <TopNav active="services" />

        {/* Hero Section */}
        <section className="relative mt-12 py-20 px-8">
          <div className="max-w-6xl mx-auto text-center">
            {/* Home Button */}
            <div className="mb-8 flex justify-center">
              <Link to="/">
                <button className="group flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 shadow-2xl hover:shadow-cyan-500/25 hover:scale-105">
                  <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  {t.home || "Home"}
                </button>
              </Link>
            </div>

            <BackButton variant="glass" />
            

            {/* Main Title */}
            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-cyan-200 via-blue-300 to-amber-400 bg-clip-text text-transparent drop-shadow-2xl font-futura">
              {t.carServicesTitle}
            </h1>
            
            <div className="w-32 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto mb-8 rounded-full" />
            
            <h2 className="text-2xl md:text-3xl font-light mb-8 text-white/90 tracking-wide">
              {t.mainTitle}
            </h2>
            
            <p className="text-xl text-white/80 leading-relaxed mb-12 max-w-4xl mx-auto font-light">
              {t.mainSubtitle}
            </p>
            <p className="text-xl text-white/80 leading-relaxed mb-12 max-w-4xl mx-auto font-light">
              {t.mainDescription}
            </p>

            {/* Service Promise 
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 mb-12 max-w-4xl mx-auto">
              <h3 className="text-2xl font-semibold mb-4 text-amber-300">Our Promise</h3>
              <p className="text-white/80 leading-relaxed">
                Enjoy punctual pickups, professional drivers,and the peace of mind that comes with having your transportation arranged in advance. Book your airport transfer now and step into the Eternal City with ease and style! ​              </p>
            </div>*/}
          </div>
        </section>

        {/* Transfer Options */}
        <section className=" px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-futura">
                {t.chooseYourRide}              
                </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto mb-6 rounded-full" />
               {/*<p className="text-xl text-white/70 max-w-3xl mx-auto">
                Select from our premium fleet of vehicles, each offering a unique way to begin your Roman experience
              </p>*/}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {sectionCards.map(({ image, title, description, packageType, price, serviceType, gradient }) => (
                <SectionCard
                  key={title}
                  image={image}
                  title={title}
                  price={price}
                  gradient={gradient}
                  t={t}
                  onClick={() => {
                    if (serviceType === 'seamless_transport') {
                      setIsOpen(true);
                    } else if (serviceType === 'private_chauffeur') {
                      setPrivateChauffeurModal(true);
                    } else if (serviceType === 'airport_transfer') {
                      setAirportTransferModal({ isOpen: true, selectedOption: null });
                    } else if (serviceType === 'car_rental') {
                      setCarRentalModal({ isOpen: true, selectedCategory: null });
                    }
                  }}
                />
              ))}
            </div>
          </div>
        </section>

         {/* Call to Action */}
                <section className="py-20 px-8">
                  <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 font-futura">
                      {t.discoverRoman || "Discover Rome like a local"}
                    </h2>
                    <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">
                      {t.experienceRome || "Experience Rome effortlessly, with a personalised journey designed just for you"}
                    </p>
        
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                      <Link to="/personal">
                        <button className="px-8 py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-semibold rounded-full hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-2xl hover:shadow-emerald-500/25 hover:scale-105">
                          {t.personalCurator}
                        </button>
                      </Link>
                      
                    </div>
                  </div>
                </section>
        {isOpen && (
          <BookingModal
            onClose={() => setIsOpen(false)}
            t={t}
          />
        )}

        {paymentModal.isOpen && (
          <BookingModal
            packageType={paymentModal.packageType}
            price={paymentModal.price}
            onClose={closePaymentModal}
            t={t}
          />
        )}

        {/* Car Rental Modals */}
        {carRentalModal.isOpen && !carRentalModal.selectedCategory && (
          <CarRentalModal
            onClose={closeCarRentalModal}
            onSelectCategory={handleSelectCategory}
            t={t}
          />
        )}
        
        {carRentalModal.isOpen && carRentalModal.selectedCategory && (
          <CarCategoryModal
            category={carRentalModal.selectedCategory}
            onClose={closeCarRentalModal}
            onBack={handleBackToCategories}
            onSelectCar={handleSelectCar}
            t={t}
          />
        )}

        {/* Car Rental Details Modal */}
        {carRentalDetailsModal.isOpen && carRentalDetailsModal.selectedCar && (
          <CarRentalDetailsModal
            car={carRentalDetailsModal.selectedCar}
            category={carRentalDetailsModal.selectedCategory}
            onClose={closeCarRentalDetailsModal}
            onConfirm={handleCarRentalConfirm}
            t={t}
          />
        )}

        {/* Private Chauffeur Modal */}
        {privateChauffeurModal && (
          <PrivateChauffeurModal
            onClose={closePrivateChauffeurModal}
            t={t}
          />
        )}

        {/* Airport Transfer Modals */}
        {airportTransferModal.isOpen && !airportTransferModal.selectedOption && (
          <AirportTransferModal
            onClose={closeAirportTransferModal}
            onSelectOption={handleSelectAirportOption}
            t={t}
          />
        )}
        
        {airportTransferModal.isOpen && airportTransferModal.selectedOption && (
          <AirportTransferBookingModal
            option={airportTransferModal.selectedOption}
            onClose={closeAirportTransferModal}
            onBack={handleBackToAirportOptions}
            t={t}
          />
        )}
      </div>
      <Footer />
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