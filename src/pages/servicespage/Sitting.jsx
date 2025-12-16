import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import FullscreenMenu from "../FullscreenMenu";
import TopNav from "../../components/TopNav";
import BackButton from "../../components/BackButton";
import Footer from "../../components/Footer";
import paymentService from "../../services/paymentService";
import { ModernDatePicker } from "../../components/ModernDatePicker";
import { ModernTimePicker } from "../../components/ModernTimePicker";
import { sittingServicesTranslations } from "../../locales/sittingServicesTranslations";
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
            {t.bookAService}
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
function BabysittingFormModal({ isOpen, onClose, onPaymentClick, t }) {
  const [animateIn, setAnimateIn] = useState(false);

  const [numDays, setNumDays] = useState("");
  const [numHours, setNumHours] = useState("");
  const [pricingType, setPricingType] = useState("daily"); // "daily" or "hourly"
  const [numChildren, setNumChildren] = useState("");
  const [childAges, setChildAges] = useState([]);
  const [childNames, setChildNames] = useState([]);
  const [healthDeclarationConfirmed, setHealthDeclarationConfirmed] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  useEffect(() => {
    if (isOpen) setAnimateIn(true);
    else setAnimateIn(false);
  }, [isOpen]);

  // Update child arrays when number of children changes
  useEffect(() => {
    const count = parseInt(numChildren) || 0;
    setChildAges(Array(count).fill(""));
    setChildNames(Array(count).fill(""));
  }, [numChildren]);

  // Calculate end time based on start time and hours
  useEffect(() => {
    if (pricingType === "hourly" && startTime && numHours) {
      const [startHour, startMinute] = startTime.split(':').map(Number);
      const totalMinutes = startHour * 60 + startMinute + (parseInt(numHours) * 60);
      const endHour = Math.floor(totalMinutes / 60) % 24;
      const endMinute = totalMinutes % 60;
      const formattedEndTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
      setEndTime(formattedEndTime);
      
      // If same day service, set end date to start date
      if (startDate) {
        setEndDate(startDate);
      }
    }
  }, [pricingType, startTime, numHours, startDate]);

  const handleAgeChange = (index, value) => {
    const newAges = [...childAges];
    newAges[index] = value;
    setChildAges(newAges);
  };

  const handleNameChange = (index, value) => {
    const newNames = [...childNames];
    newNames[index] = value;
    setChildNames(newNames);
  };


  if (!isOpen) return null;

  const allAgesSelected = childAges.length > 0 && childAges.every(age => age !== "");
  const allNamesEntered = childNames.length > 0 && childNames.every(name => name.trim() !== "");
  const formValid =
    (pricingType === "daily" ? numDays : numHours) && 
    numChildren && allAgesSelected && allNamesEntered && healthDeclarationConfirmed && 
    startDate && startTime && endDate && endTime && acceptTerms;

  return (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 hide-scrollbar">
      {/* Background Glow Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-40 h-40 bg-pink-400/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/3 w-32 h-32 bg-purple-400/20 rounded-full blur-xl animate-pulse delay-700" />
      </div>

      <div
        className={`relative max-w-xl w-full max-h-[90vh] overflow-y-auto hide-scrollbar transform transition-all duration-500 ease-out ${
          animateIn ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Glassmorphism Container */}
        <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
          {/* Gradient Border */}
          <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 via-purple-400/20 to-fuchsia-400/20 rounded-3xl blur-sm" />
          <div className="relative bg-black/30 backdrop-blur-xl rounded-3xl p-8">
            
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

            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-300 to-purple-400 bg-clip-text text-transparent mb-2">
                {t?.babysittingRequest || "Babysitting Request"}
              </h2>
              <div className="w-20 h-0.5 bg-gradient-to-r from-pink-500 to-purple-600 mx-auto rounded-full" />
            </div>

            {/* Form */}
            <form className="space-y-4 text-white">
              <div>
                <label className="block mb-1 text-sm font-medium">{t?.numberOfDays || "Number of Days"}</label>
                <input
                  type="number"
                  min="1"
                  value={numDays}
                  onChange={(e) => setNumDays(e.target.value)}
                  className="w-full border border-white/20 rounded-lg py-2 px-3 bg-white/10 text-white placeholder-white/50 focus:border-pink-400"
                  placeholder={t?.enterTheNumberOfDays || "Enter the number of days"}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">{t?.numberOfChildren || "Number of Children"}</label>
                <input
                  type="number"
                  min="1"
                  value={numChildren}
                  onChange={(e) => setNumChildren(e.target.value)}
                  className="w-full border border-white/20 rounded-lg py-2 px-3 bg-white/10 text-white placeholder-white/50 focus:border-pink-400"
                  placeholder={t?.enterTheNumberOfChildren || "Enter the number of children"}
                />
              </div>

              {/* Pricing Type Selection */}
              <div>
                <label className="block mb-1 text-sm font-medium">{t?.selectPricingType || "Select Pricing Type"}</label>
                <div className="flex gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="pricingType"
                      value="daily"
                      checked={pricingType === "daily"}
                      onChange={(e) => setPricingType(e.target.value)}
                      className="mr-2 accent-pink-400"
                    />
                    <span className="text-white/90">{t?.daily || "Daily"} (€150/day)</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="pricingType"
                      value="hourly"
                      checked={pricingType === "hourly"}
                      onChange={(e) => setPricingType(e.target.value)}
                      className="mr-2 accent-pink-400"
                    />
                    <span className="text-white/90">{t?.hourly || "Hourly"}</span>
                  </label>
                </div>
              </div>

              {/* Days or Hours Input */}
              {pricingType === "daily" ? (
                <div>
                  <label className="block mb-1 text-sm font-medium">{t?.numberOfDays || "Number of Days"}</label>
                  <input
                    type="number"
                    min="1"
                    value={numDays}
                    onChange={(e) => setNumDays(e.target.value)}
                    className="w-full border border-white/20 rounded-lg py-2 px-3 bg-white/10 text-white placeholder-white/50 focus:border-pink-400"
                    placeholder={t?.enterTheNumberOfDays || "Enter the number of days"}
                  />
                </div>
              ) : (
                <div>
                  <label className="block mb-1 text-sm font-medium">{t?.numberOfHours || "Number of Hours"}</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={numHours}
                    onChange={(e) => setNumHours(e.target.value)}
                    className="w-full border border-white/20 rounded-lg py-2 px-3 bg-white/10 text-white placeholder-white/50 focus:border-pink-400"
                    placeholder={t?.enterTheNumberOfHours || "Enter the number of hours"}
                  />
                </div>
              )}
              
              {/* Children Details */}
              {numChildren && parseInt(numChildren) > 0 && (
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-pink-300">Children Details</label>
                  {childAges.map((age, index) => (
                    <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10 space-y-3">
                      <h4 className="text-sm font-semibold text-white/90 mb-2">Child {index + 1}</h4>
                      
                      {/* Name */}
                      <div>
                        <label className="block mb-1 text-xs text-white/70">Name</label>
                        <input
                          type="text"
                          value={childNames[index]}
                          onChange={(e) => handleNameChange(index, e.target.value)}
                          className="w-full border border-white/20 rounded-lg py-2 px-3 bg-white/10 text-white placeholder-white/50 focus:border-pink-400"
                          placeholder="Enter child's name"
                        />
                      </div>
                      
                      {/* Age */}
                      <div>
                        <label className="block mb-1 text-xs text-white/70">Age of Child</label>
                        <input
                          type="number"
                          min="0"
                          max="18"
                          value={age}
                          onChange={(e) => handleAgeChange(index, e.target.value)}
                          className="w-full border border-white/20 rounded-lg py-2 px-3 bg-white/10 text-white placeholder-white/50 focus:border-pink-400"
                          placeholder="Enter child's age"
                        />
                      </div>
                      
                    </div>
                  ))}
                </div>
              )}
              
              <div>
                <label className="block mb-1 text-sm font-medium">{t?.serviceStartDateAndTime || "Service start date & time"}</label>
                <div className="flex gap-2">
                  <div className="w-1/2">
                    <ModernDatePicker
                      selected={startDate ? new Date(startDate) : null}
                      onSelect={(date) => setStartDate(date.toISOString().slice(0, 10))}
                      placeholder={t?.ddMmYyyy || "dd/mm/yyyy"}
                    />
                  </div>
                  <div className="w-1/2">
                    <ModernTimePicker
                      selected={startTime}
                      onSelect={setStartTime}
                      placeholder={t?.startTime || "Start time"}
                      interval={30}
                    />
                  </div>
                </div>
              </div>

              {/* Health Declaration Checkbox */}
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={healthDeclarationConfirmed}
                    onChange={(e) => setHealthDeclarationConfirmed(e.target.checked)}
                    className="w-5 h-5 mt-1 rounded border-white/20 bg-white/10 text-pink-500 focus:ring-pink-400 cursor-pointer"
                  />
                  <span className="text-sm text-white/90 leading-relaxed">
                    {t?.healthDeclaration || "I hereby declare that my children are in good health, free from any contagious diseases, and up to date on all required vaccinations. I understand that providing false or incomplete health information may affect the safety and wellbeing of my children and others."}
                  </span>
                </label>
              </div>
              
              {/* Terms & Conditions Checkbox */}
              <div className="flex items-start gap-3 text-white/80 text-sm pt-2 bg-white/5 p-4 rounded-lg border border-white/10 hover:border-white/20 transition-colors">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="accent-pink-400 flex-shrink-0 w-4 h-4 mt-0.5 cursor-pointer"
                />
                <label className="cursor-pointer">
                  I accept the{" "}
                  <Link to="/terms-and-conditions" className="text-pink-300 hover:text-pink-200 underline font-medium">
                    {t.termsAndConditions}
                  </Link>
                </label>
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium">{t?.serviceEndDateAndTime || "Service end date & time"}</label>
                <div className="flex gap-2">
                  <div className="w-1/2">
                    <ModernDatePicker
                      selected={endDate ? new Date(endDate) : null}
                      onSelect={(date) => setEndDate(date.toISOString().slice(0, 10))}
                      minDate={startDate ? new Date(startDate) : new Date()}
                      disabled={!startDate}
                      placeholder={t?.ddMmYyyy || "dd/mm/yyyy"}
                    />
                  </div>
                  <div className="w-1/2">
                    <ModernTimePicker
                      selected={endTime}
                      onSelect={setEndTime}
                      disabled={!startDate}
                      placeholder={t?.endTime || "End time"}
                      interval={30}
                    />
                  </div>
                </div>
              </div>

              {/* PayPal Payment Button */}
              <div className="flex flex-col gap-3 mt-6">
                <button
                  type="button"
                  disabled={!formValid}
                  className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                    formValid
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:scale-105 hover:shadow-lg"
                      : "bg-white/10 text-white/60 border border-white/20 cursor-not-allowed"
                  }`}
                  onClick={async () => {
                    if (formValid) {
                      try {
                        const totalPrice = pricingType === "daily" ? numDays * 150 : numHours * 25; // €150/day or €25/hour
                        const orderResponse = await paymentService.createOrder({
                          amount: totalPrice,
                          currency: 'EUR',
                          description: `Babysitting Service - ${pricingType === "daily" ? numDays + " day(s)" : numHours + " hour(s)"}, ${numChildren} child(ren)`,
                          serviceType: 'babysitting',
                          customerName: 'Guest',
                          customerEmail: 'guest@example.com',
                          customerPhone: '0000000000',
                          bookingDetails: {
                            pricingType,
                            [pricingType === "daily" ? "days" : "hours"]: pricingType === "daily" ? numDays : numHours,
                            children: numChildren,
                            childDetails: childAges.map((age, index) => ({
                              name: childNames[index],
                              age: age
                            })),
                            startDate,
                            startTime,
                            endDate,
                            endTime
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
                    }
                  }}
                >
                  {formValid && (
                      null
                  )}
                  {formValid ? `Pay with PayPal - €${pricingType === "daily" ? numDays * 150 : numHours * 25}` : t?.completeFormToContinue || 'Complete form to continue'}
                </button>
                
                {formValid && (
                  <div className="text-center">
                    <p className="text-white/50 text-xs">
                      {t?.securePaymentPoweredByPayPal || "Secure payment powered by PayPal"}
                    </p>
                  </div>
                )}
                <button
                  type="button"
                  disabled={!formValid}
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    formValid
                      ? "bg-white/10 text-white border border-pink-400 hover:bg-pink-500/20"
                      : "bg-white/10 text-white/60 border border-white/20 cursor-not-allowed"
                  }`}
                  onClick={() => {
                    alert("Added to Wishlist");
                    onClose();
                  }}
                >
                  {t?.addToWishlist || "Add to Wishlist"}
                </button>
              </div>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}
// Pet Sitting Modal (same style as BabysittingFormModal but green theme)
function PetSittingFormModal({ isOpen, onClose, t }) {
  const [animateIn, setAnimateIn] = useState(false);

  const [numDays, setNumDays] = useState("");
  const [numHours, setNumHours] = useState("");
  const [pricingType, setPricingType] = useState("daily"); // "daily" or "hourly"
  const [numPets, setNumPets] = useState("");
  const [petNames, setPetNames] = useState([]);
  const [petTypes, setPetTypes] = useState([]);
  const [petBreeds, setPetBreeds] = useState([]);
  const [vaccinationConfirmed, setVaccinationConfirmed] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  useEffect(() => {
    if (isOpen) setAnimateIn(true);
    else setAnimateIn(false);
  }, [isOpen]);

  // Update pet arrays when number of pets changes
  useEffect(() => {
    const count = parseInt(numPets) || 0;
    setPetNames(Array(count).fill(""));
    setPetTypes(Array(count).fill(""));
    setPetBreeds(Array(count).fill(""));
  }, [numPets]);

  // Calculate end time based on start time and hours
  useEffect(() => {
    if (pricingType === "hourly" && startTime && numHours) {
      const [startHour, startMinute] = startTime.split(':').map(Number);
      const totalMinutes = startHour * 60 + startMinute + (parseInt(numHours) * 60);
      const endHour = Math.floor(totalMinutes / 60) % 24;
      const endMinute = totalMinutes % 60;
      const formattedEndTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
      setEndTime(formattedEndTime);
      
      // If same day service, set end date to start date
      if (startDate) {
        setEndDate(startDate);
      }
    }
  }, [pricingType, startTime, numHours, startDate]);

  const handlePetNameChange = (index, value) => {
    const newNames = [...petNames];
    newNames[index] = value;
    setPetNames(newNames);
  };

  const handlePetTypeChange = (index, value) => {
    const newTypes = [...petTypes];
    newTypes[index] = value;
    setPetTypes(newTypes);
  };

  const handlePetBreedChange = (index, value) => {
    const newBreeds = [...petBreeds];
    newBreeds[index] = value;
    setPetBreeds(newBreeds);
  };

  if (!isOpen) return null;

  const allPetNamesEntered = petNames.length > 0 && petNames.every(name => name.trim() !== "");
  const allPetTypesEntered = petTypes.length > 0 && petTypes.every(type => type.trim() !== "");
  const allPetBreedsEntered = petBreeds.length > 0 && petBreeds.every(breed => breed.trim() !== "");
  const formValid =
    (pricingType === "daily" ? numDays : numHours) && 
    numPets && allPetNamesEntered && allPetTypesEntered && allPetBreedsEntered && vaccinationConfirmed && 
    startDate && startTime && endDate && endTime && acceptTerms;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 hide-scrollbar">
      {/* Background Glow Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-40 h-40 bg-green-400/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/3 w-32 h-32 bg-emerald-400/20 rounded-full blur-xl animate-pulse delay-700" />
      </div>

      <div
        className={`relative max-w-xl w-full max-h-[90vh] overflow-y-auto hide-scrollbar transform transition-all duration-500 ease-out ${
          animateIn ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Glassmorphism Container */}
        <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
          {/* Gradient Border */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 via-emerald-400/20 to-teal-400/20 rounded-3xl blur-sm" />
          <div className="relative bg-black/30 backdrop-blur-xl rounded-3xl p-8">
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

            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent mb-2">
                {t?.petSittingRequest || "Pet Sitting Request"}
              </h2>
              <div className="w-20 h-0.5 bg-gradient-to-r from-green-500 to-emerald-600 mx-auto rounded-full" />
            </div>

            {/* Form */}
            <form className="space-y-4 text-white">
              <div>
                <label className="block mb-1 text-sm font-medium">{t?.numberOfPets || "Number of Pets"}</label>
                <input
                  type="number"
                  min="1"
                  value={numPets}
                  onChange={(e) => setNumPets(e.target.value)}
                  className="w-full border border-white/20 rounded-lg py-2 px-3 bg-white/10 text-white placeholder-white/50 focus:border-green-400"
                  placeholder={t?.enterTheNumberOfPets || "Enter the number of pets"}
                />
              </div>

              {/* Pricing Type Selection */}
              <div>
                <label className="block mb-1 text-sm font-medium">{t?.selectPricingType || "Select Pricing Type"}</label>
                <div className="flex gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="pricingType"
                      value="daily"
                      checked={pricingType === "daily"}
                      onChange={(e) => setPricingType(e.target.value)}
                      className="mr-2 accent-green-400"
                    />
                    <span className="text-white/90">{t?.daily || "Daily"} (€100/day)</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="pricingType"
                      value="hourly"
                      checked={pricingType === "hourly"}
                      onChange={(e) => setPricingType(e.target.value)}
                      className="mr-2 accent-green-400"
                    />
                    <span className="text-white/90">{t?.hourly || "Hourly"}</span>
                  </label>
                </div>
              </div>

              {/* Days or Hours Input */}
              {pricingType === "daily" ? (
                <div>
                  <label className="block mb-1 text-sm font-medium">{t?.numberOfDays || "Number of Days"}</label>
                  <input
                    type="number"
                    min="1"
                    value={numDays}
                    onChange={(e) => setNumDays(e.target.value)}
                    className="w-full border border-white/20 rounded-lg py-2 px-3 bg-white/10 text-white placeholder-white/50 focus:border-green-400"
                    placeholder={t?.enterTheNumberOfDays || "Enter the number of days"}
                  />
                </div>
              ) : (
                <div>
                  <label className="block mb-1 text-sm font-medium">{t?.numberOfHours || "Number of Hours"}</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={numHours}
                    onChange={(e) => setNumHours(e.target.value)}
                    className="w-full border border-white/20 rounded-lg py-2 px-3 bg-white/10 text-white placeholder-white/50 focus:border-green-400"
                    placeholder={t?.enterTheNumberOfHours || "Enter the number of hours"}
                  />
                </div>
              )}
              
              {/* Pet Details */}
              {numPets && parseInt(numPets) > 0 && (
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-green-300">Pet Details</label>
                  {petNames.map((name, index) => (
                    <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10 space-y-3">
                      <h4 className="text-sm font-semibold text-white/90 mb-2">Pet {index + 1}</h4>
                      
                      {/* Name */}
                      <div>
                        <label className="block mb-1 text-xs text-white/70">Pet Name</label>
                        <input
                          type="text"
                          value={petNames[index]}
                          onChange={(e) => handlePetNameChange(index, e.target.value)}
                          className="w-full border border-white/20 rounded-lg py-2 px-3 bg-white/10 text-white placeholder-white/50 focus:border-green-400"
                          placeholder="Enter pet's name"
                        />
                      </div>
                      
                      {/* Type */}
                      <div>
                        <label className="block mb-1 text-xs text-white/70">Pet Type</label>
                        <input
                          type="text"
                          value={petTypes[index]}
                          onChange={(e) => handlePetTypeChange(index, e.target.value)}
                          className="w-full border border-white/20 rounded-lg py-2 px-3 bg-white/10 text-white placeholder-white/50 focus:border-green-400"
                          placeholder="e.g., Dog, Cat, Bird, etc."
                        />
                      </div>
                      
                      {/* Breed */}
                      <div>
                        <label className="block mb-1 text-xs text-white/70">Breed</label>
                        <input
                          type="text"
                          value={petBreeds[index]}
                          onChange={(e) => handlePetBreedChange(index, e.target.value)}
                          className="w-full border border-white/20 rounded-lg py-2 px-3 bg-white/10 text-white placeholder-white/50 focus:border-green-400"
                          placeholder="Enter pet's breed"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div>
                <label className="block mb-1 text-sm font-medium">{t?.serviceStartDate || "Service start date & time"}</label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={new Date().toISOString().slice(0, 10)}
                    className="border border-white/20 rounded-lg px-3 py-2 bg-white/10 text-white w-1/2"
                  />
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="border border-white/20 rounded-lg px-3 py-2 bg-white/10 text-white w-1/2"
                  />
                </div>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">{t?.serviceEndDate || "Service end date & time"}</label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || new Date().toISOString().slice(0, 10)}
                    disabled={!startDate}
                    className="border border-white/20 rounded-lg px-3 py-2 bg-white/10 text-white w-1/2 disabled:opacity-50"
                  />
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    disabled={!startDate}
                    className="border border-white/20 rounded-lg px-3 py-2 bg-white/10 text-white w-1/2 disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Vaccination Confirmation */}
              <div className="p-4 bg-green-500/10 rounded-lg border border-green-400/30">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={vaccinationConfirmed}
                    onChange={(e) => setVaccinationConfirmed(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-2 border-green-400 bg-white/10 checked:bg-green-500 checked:border-green-500 focus:ring-2 focus:ring-green-400 focus:ring-offset-0 cursor-pointer transition-all"
                  />
                  <span className="text-sm text-white/90 leading-relaxed group-hover:text-white transition-colors">
                  {t?.petHealthDeclaration || "I hereby declare that my pet is in good health, free from any contagious diseases, and up to date on all required vaccinations and deworming treatments.I understand that providing false or incomplete health information may affect the safety and wellbeing of my pet and others."}
                  </span>
                
                </label>
              </div>
            
              {/* Terms & Conditions Checkbox */}
              <div className="flex items-start gap-3 text-white/80 text-sm pt-2 bg-white/5 p-4 rounded-lg border border-white/10 hover:border-white/20 transition-colors">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="accent-green-400 flex-shrink-0 w-4 h-4 mt-0.5 cursor-pointer"
                />
                <label className="cursor-pointer">
                  I accept the{" "}
                  <Link to="/terms-and-conditions" className="text-green-300 hover:text-green-200 underline font-medium">
                    {t.termsAndConditions}
                  </Link>
                </label>
              </div>

              {/* PayPal Payment Button */}
              <div className="flex flex-col gap-3 mt-6">
                <button
                  type="button"
                  disabled={!formValid}
                  className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                    formValid
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:scale-105 hover:shadow-lg"
                      : "bg-white/10 text-white/60 border border-white/20 cursor-not-allowed"
                  }`}
                  onClick={async () => {
                    if (formValid) {
                      try {
                        const totalPrice = pricingType === "daily" ? numDays * 100 : numHours * 20; // €100/day or €20/hour
                        const orderResponse = await paymentService.createOrder({
                          amount: totalPrice,
                          currency: 'EUR',
                          description: `Pet Sitting Service - ${pricingType === "daily" ? numDays + " day(s)" : numHours + " hour(s)"}, ${numPets} pet(s)`,
                          serviceType: 'pet_sitting',
                          customerName: 'Guest',
                          customerEmail: 'guest@example.com',
                          customerPhone: '0000000000',
                          bookingDetails: {
                            pricingType,
                            [pricingType === "daily" ? "days" : "hours"]: pricingType === "daily" ? numDays : numHours,
                            pets: numPets,
                            petDetails: petNames.map((name, index) => ({
                              name: name,
                              type: petTypes[index],
                              breed: petBreeds[index]
                            })),
                            startDate,
                            startTime,
                            endDate,
                            endTime
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
                    }
                  }}
                >
                  {formValid && (
                      null
                  )}
                  {formValid ? `Pay with PayPal - €${pricingType === "daily" ? numDays * 100 : numHours * 20}` : t?.completeFormToContinue || 'Complete form to continue'}
                </button>
                
                {formValid && (
                  <div className="text-center">
                    <p className="text-white/50 text-xs">
                      {t?.securePaymentPoweredByPayPal || "Secure payment powered by PayPal"}
                    </p>
                  </div>
                )}
                <button
                  type="button"
                  disabled={!formValid}
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    formValid
                      ? "bg-white/10 text-white border border-green-400 hover:bg-green-500/20"
                      : "bg-white/10 text-white/60 border border-white/20 cursor-not-allowed"
                  }`}
                  onClick={() => {
                    alert("Pet Sitting Added to Wishlist");
                    onClose();
                  }}
                >
                  {t?.addToWishlist || "Add to Wishlist"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}



export default function Sitting() {
  const { language } = useContext(LanguageContext);
  // Map global language codes to translation keys
  const langMap = { 'EN': 'en', 'ES': 'es', 'RU': 'ru' };
  const currentLang = langMap[language] || 'en';
  const t = sittingServicesTranslations[currentLang] || sittingServicesTranslations['en'];
  
  const [showBabysitModal, setShowBabysitModal] = useState(false);
  const [showPetSitModal, setShowPetSitModal] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isFullMenuOpen, setFullMenuOpen] = useState(false);

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const services = [
    {
      image: "/babysitting.jpeg",
      title: t.premiumChildcareServices,
      description: t.premiumChildcareDescription,
      price: `25€/${t.perHour || "per hour"}`,
      serviceType: "babysitting",
      gradient: "from-pink-400 via-rose-500 to-red-500",
      onClick: () => setShowBabysitModal(true),
    },
    {
      image: "/Pet-Sitting.jpg",
      title: t.luxuryPetCareServices,
      description: t.luxuryPetCareDescription,
      price: `20€/${t.perHour || "per hour"}`,
      serviceType: "pet_sitting",
      gradient: "from-green-400 via-emerald-500 to-teal-600",
      onClick: () => setShowPetSitModal(true),
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Fixed Background */}
      <div 
        className="fixed inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('/bg.jpeg')"
        }}
      />
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-transparent z-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40 z-0" />

      {/* Floating Elements */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-r from-pink-400/20 to-rose-500/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute top-60 left-20 w-24 h-24 bg-gradient-to-r from-green-400/20 to-emerald-500/20 rounded-full blur-xl animate-pulse delay-1000" />
      <div className="absolute bottom-40 right-1/4 w-40 h-40 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full blur-xl animate-pulse delay-2000" />

      {/* Hamburger Menu */}
      <FullscreenMenu isOpen={isFullMenuOpen} setIsOpen={setFullMenuOpen} />

      {/* Back Button */}
      <BackButton variant="glass" />

      <div className="relative z-10 min-h-screen text-white">
        {/* Elite Premium Navbar */}
        <TopNav active="services" />

        {/* Hero Section */}
        <section className="relative mt-8 py-20 px-8">
          <div className="max-w-6xl mx-auto text-center">
            {/* Home Button */}
            <div className="mb-8 mt-8 flex justify-center">
              <Link to="/">
                <button className="group flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-2xl hover:shadow-green-500/25 hover:scale-105">
                  <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  {t.home || "Home"}
                </button>
              </Link>
            </div>

            {/* Main Title */}
            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-green-200 via-emerald-300 to-amber-400 bg-clip-text text-transparent drop-shadow-2xl font-futura">
              {t.sittingServicesTitle}
            </h1>
            
            <div className="w-32 h-1 bg-gradient-to-r from-green-400 to-emerald-500 mx-auto mb-8 rounded-full" />
            
            <h2 className="text-2xl md:text-3xl font-light mb-8 text-white/90 tracking-wide">
              {t.mainHeroTitle}
            </h2>
            
            <p className="text-xl text-white/80 leading-relaxed mb-12 max-w-4xl mx-auto font-light">
              {t.mainHeroDescription}
            </p>

            {/* Service Promise 
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 mb-12 max-w-4xl mx-auto">
              <h3 className="text-2xl font-semibold mb-4 text-amber-300">Our Commitment</h3>
              <p className="text-white/80 leading-relaxed">
                Our experienced caregivers are thoroughly vetted, certified, and passionate about providing exceptional care. 
                Whether it's engaging activities for children or loving attention for pets, we ensure your loved ones receive the highest standard of care while you create unforgettable memories in Rome.
              </p>
            </div>*/}
          </div>
        </section>

        {/* Services Grid */}
        <section className=" px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-futura">
                {t.chooseYourCareService}
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-emerald-500 mx-auto mb-6 rounded-full" />
             {/* <p className="text-xl text-white/70 max-w-3xl mx-auto">
                Professional, reliable care services designed to give you complete peace of mind during your Roman holiday
              </p>*/}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {services.map((service, idx) => (
                <SectionCard
                  key={idx}
                  image={service.image}
                  title={service.title}
                  description={service.description}
                  price={service.price}
                  gradient={service.gradient}
                  t={t}
                  onClick={service.onClick}
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
                        <button className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-full hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-2xl hover:shadow-emerald-500/25 hover:scale-105">
                          {t.personalCurator}
                        </button>
                      </Link>
                      
                    </div>
                  </div>
                </section>
      </div>

      {/* Modals */}
      <BabysittingFormModal 
        isOpen={showBabysitModal} 
        onClose={() => setShowBabysitModal(false)}
        t={t}
      />
      <PetSittingFormModal 
        isOpen={showPetSitModal} 
        onClose={() => setShowPetSitModal(false)}
        t={t}
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
