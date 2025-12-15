import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import FullscreenMenu from "../FullscreenMenu";
import TopNav from "../../components/TopNav";
import BackButton from "../../components/BackButton";
import WishlistButton from "../../components/WishlistButton";
import { useWishlist } from '../../hooks/useWishlist';
import paymentService from '../../services/paymentService';
import Footer from "../../components/Footer";
import { ModernDatePicker } from "../../components/ModernDatePicker";
import { ModernTimePicker } from "../../components/ModernTimePicker";
import { beautyServicesTranslations } from "../../locales/beautyServicesTranslations";
import { LanguageContext } from "../../context/LanguageContext";


// Premium SectionCard Component
function SectionCard({ image, title, description, price, place, onClick, gradient, t }) {
  const serviceItem = {
    title,
    description: description || "Professional beauty service in Rome",
    price,
    category: "beauty",
    image
  };

  return (
    <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl flex flex-col h-full">
      {/* Wishlist Button */}
      <div className="absolute top-3 right-3 z-30 pointer-events-auto">
        <WishlistButton 
          item={serviceItem}
          size="sm"
          variant="card"
          showText={false}
        />
      </div>
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

      {/* Content Section - Clickable */}
      <button
        type="button"
        className="p-5 flex flex-col flex-grow w-full text-left focus:outline-none relative z-10"
        onClick={(e) => {
          console.log('Beauty card clicked:', title);
          onClick && onClick();
        }}
        aria-label={`Open details for ${title}`}
      >
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
            {t?.bookAService || "Book a Service"}
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
      </button>
    </div>
  );
}

function BookingFormModal({ isOpen, onClose, serviceName, servicePrice, onPaymentClick, t }) {
  const { addToWishlist, isInWishlist } = useWishlist();
  const [animateIn, setAnimateIn] = useState(false);
  const [serviceDate, setServiceDate] = useState("");
  const [serviceTime, setServiceTime] = useState("");
  const [locationType, setLocationType] = useState(""); // "hotel", "airbnb", "others"
  const [hotelName, setHotelName] = useState("");
  const [roomNo, setRoomNo] = useState("");
  const [address, setAddress] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [toast, setToast] = useState(null);

  // Reset form when modal opens or service changes
  useEffect(() => {
    if (isOpen) {
      setAnimateIn(true);
      // Reset all form fields when opening modal for a new service
      setServiceDate("");
      setServiceTime("");
      setLocationType("");
      setHotelName("");
      setRoomNo("");
      setAddress("");
      setCustomerName("");
      setCustomerEmail("");
      setCustomerPhone("");
      setAcceptTerms(false);
      setToast(null);
    } else {
      setAnimateIn(false);
    }
  }, [isOpen, serviceName]);

  if (!isOpen) return null;

  const formValid = customerName && serviceDate && serviceTime && locationType && address && acceptTerms &&
    (locationType === "others" || (hotelName && roomNo));

  // Toast helper for glassy alert messages
  const showToast = (message, timeout = 3500) => {
    setToast({ message });
    if (timeout > 0) {
      setTimeout(() => setToast(null), timeout);
    }
  };

  const handleAddToWishlist = async () => {
    const beautyItem = {
      title: serviceName,
      description: "Professional beauty service in Rome",
      price: servicePrice,
      category: "beauty"
    };

    const result = await addToWishlist(beautyItem);
    if (result.success) {
      showToast(`✅ ${result.message}`);
    } else {
      showToast(`❌ ${result.message}`);
    }
  };

  const isServiceInWishlist = isInWishlist(serviceName);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 hide-scrollbar">
      {/* Background Glow Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-40 h-40 bg-pink-400/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/3 w-32 h-32 bg-rose-500/20 rounded-full blur-xl animate-pulse delay-700" />
      </div>

      <div
        className={`relative max-w-xl w-full max-h-[90vh] overflow-y-auto hide-scrollbar transform transition-all duration-500 ease-out ${
          animateIn ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Glassmorphism Container */}
        <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
          {/* Gradient Border */}
          <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-rose-500/20 rounded-3xl blur-sm" />
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
              <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-300 to-rose-400 bg-clip-text text-transparent mb-2">
                {serviceName} {t?.bookAService || "Booking"}
              </h2>
              <p className="text-white/70">Price: {servicePrice}</p>
              {serviceName === t.hairColourAndStyle && (
                <>
                  <p className="text-amber-400 text-sm font-semibold mt-2">
                    Min. Deposit €150
                  </p>
                  <p className="text-amber-300 text-xs mt-1">
                    {t?.hairColourWarning || "(Final price depends on hair lenght & Technique.)"}
                  </p>
                </>
              )}
              {serviceName === t.hairExtension && (
                <>
                  <p className="text-amber-400 text-sm font-semibold mt-2">
                    Min. Deposit €300
                  </p>
                  <p className="text-amber-300 text-xs mt-1">
                    {t?.hairExtensionWarning || "(Final price depends on technique utilized, hair lenght & weight.)"}
                  </p>
                </>
              )}
              <div className="w-20 h-0.5 bg-gradient-to-r from-pink-400 to-rose-500 mx-auto rounded-full" />
            </div>

            {/* Form */}
            <form className="space-y-4 text-white">
              <div>
                <label className="block mb-1 text-sm font-medium">{t?.yourName || "Your Name"}</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder={t?.fullName || "Full name"}
                  className="w-full border border-white/20 rounded-lg py-2 px-3 bg-white/10 text-white placeholder-white/50 focus:border-pink-400 focus:ring-rose-500/50 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">{t.emailAddress}</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full border border-white/20 rounded-lg py-2 px-3 bg-white/10 text-white placeholder-white/50 focus:border-pink-400 focus:ring-rose-500/50 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">{t.phoneNumber}</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+1234567890"
                  className="w-full border border-white/20 rounded-lg py-2 px-3 bg-white/10 text-white placeholder-white/50 focus:border-pink-400 focus:ring-rose-500/50 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">{t?.selectDate || "Select Date"}</label>
                <ModernDatePicker
                  selected={serviceDate ? new Date(serviceDate) : null}
                  onSelect={(date) => setServiceDate(date.toISOString().slice(0, 10))}
                  placeholder={t?.ddMmYyyy || "Select a date"}
                />
              </div>

              {/* Location Type Selection */}
              <div>
                <label className="block mb-2 text-sm font-medium">{t?.locationType || "Location Type"}</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="locationType"
                      value="hotel"
                      checked={locationType === "hotel"}
                      onChange={(e) => setLocationType(e.target.value)}
                      className="text-pink-400 focus:ring-pink-400"
                    />
                    <span className="text-white">{t?.hotel || "Hotel"}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="locationType"
                      value="airbnb"
                      checked={locationType === "airbnb"}
                      onChange={(e) => setLocationType(e.target.value)}
                      className="text-pink-400 focus:ring-pink-400"
                    />
                    <span className="text-white">Airbnb</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="locationType"
                      value="others"
                      checked={locationType === "others"}
                      onChange={(e) => setLocationType(e.target.value)}
                      className="text-pink-400 focus:ring-pink-400"
                    />
                    <span className="text-white">{t?.others || "Others"}</span>
                  </label>
                </div>
              </div>

              {/* Conditional Fields */}
              {(locationType === "hotel" || locationType === "airbnb") && (
                <>
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      {locationType === "hotel" ? "Hotel Name" : "Airbnb Name"}
                    </label>
                    <input
                      type="text"
                      value={hotelName}
                      onChange={(e) => setHotelName(e.target.value)}
                      placeholder={`Enter your ${locationType} name`}
                      className="w-full border border-white/20 rounded-lg py-2 px-3 bg-white/10 text-white placeholder-white/50 focus:border-pink-400 focus:ring-rose-500/50 outline-none transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">Room No.</label>
                    <input
                      type="text"
                      value={roomNo}
                      onChange={(e) => setRoomNo(e.target.value)}
                      placeholder="Enter room number"
                      className="w-full border border-white/20 rounded-lg py-2 px-3 bg-white/10 text-white placeholder-white/50 focus:border-pink-400 focus:ring-rose-500/50 outline-none transition-all"
                      required
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block mb-1 text-sm font-medium">{t?.address || "Address"}</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={t?.enterCompleteAddress || "Enter complete address"}
                  className="w-full border border-white/20 rounded-lg py-2 px-3 bg-white/10 text-white placeholder-white/50 focus:border-pink-400 focus:ring-rose-500/50 outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">{t?.selectTime || "Select Time"}</label>
                <ModernTimePicker
                  selected={serviceTime}
                  onSelect={setServiceTime}
                  placeholder={t?.selectTime || "Select a time"}
                  interval={30}
                  startHour={9}
                  endHour={20}
                />
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
                  {t.iAcceptThe}{" "}
                  <a href="/terms-and-conditions" className="text-purple-300 hover:text-purple-200 underline font-medium">
                    {t.termsAndConditions}
                  </a>
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
                        const orderResponse = await paymentService.createOrder({
                          amount: parseFloat(servicePrice.replace('€', '')),
                          currency: 'EUR',
                          description: serviceName,
                          serviceType: 'beauty_service',
                          customerName: customerName,
                          customerEmail: customerEmail,
                          customerPhone: customerPhone,
                          bookingDetails: {
                            service: serviceName,
                            date: serviceDate,
                            time: serviceTime,
                            locationType: locationType,
                            hotelName: hotelName,
                            roomNo: roomNo,
                            address: address,
                            price: servicePrice
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
                  {formValid ? `Pay with PayPal - ${servicePrice}` : t?.completeFormAndSelectServices || 'Complete form to continue'}
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
                  onClick={handleAddToWishlist}
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    isServiceInWishlist 
                      ? 'bg-red-500/20 border border-red-400 text-red-300 hover:bg-red-500/30' 
                      : 'bg-white/10 text-white border border-pink-400 hover:bg-pink-500/20'
                  }`}
                >
                  {isServiceInWishlist ? '❤️ In Wishlist' : t?.addToWishlist || 'Add to Wishlist'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* Glass Toast */}
      {toast && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-60 pointer-events-none">
          <div className="pointer-events-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-3 flex items-center gap-4 shadow-2xl max-w-xl w-full transition-opacity duration-300">
            <div className="text-2xl">✨</div>
            <div className="text-sm text-white whitespace-pre-line">{toast.message}</div>
            <button
              onClick={() => setToast(null)}
              className="ml-auto text-white/80 hover:text-white"
              aria-label="Close message"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function CustomizeServiceModal({ isOpen, onClose, availableServices, t }) {
  const [animateIn, setAnimateIn] = useState(false);
  const [serviceDate, setServiceDate] = useState("");
  const [serviceTime, setServiceTime] = useState("");
  const [locationType, setLocationType] = useState(""); // "hotel", "airbnb", "others"
  const [hotelName, setHotelName] = useState("");
  const [roomNo, setRoomNo] = useState("");
  const [address, setAddress] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setAnimateIn(true);
    } else {
      setAnimateIn(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleService = (serviceTitle) => {
    setSelectedServices((prev) => {
      if (prev.includes(serviceTitle)) {
        return prev.filter((t) => t !== serviceTitle);
      }
      return [...prev, serviceTitle];
    });
  };

  const selectedServiceData = availableServices.filter((s) => selectedServices.includes(s.title));
  const originalTotal = selectedServiceData.reduce((sum, s) => sum + (s.numericPrice || 0), 0);
  const discountAmount = originalTotal * 0.1;
  const finalTotal = originalTotal - discountAmount;
  
  // Check if Hair Extension or Hair Colour and Style is selected
  const hasHairExtension = selectedServices.includes("Hair Extension");
  const hasHairColourStyle = selectedServices.includes("Hair colour and style ");

  const formValid =
    customerName && serviceDate && serviceTime && locationType && address && 
    (locationType === "others" || (hotelName && roomNo)) && selectedServices.length > 0 && originalTotal > 0;

  const handleConfirm = () => {
    if (!formValid) return;
    const summaryLines = selectedServiceData
      .map((s) => `${s.title}: €${s.numericPrice?.toFixed(2) || "0.00"}`)
      .join("\n");
    alert(
      `Booking Summary (Choose Your Package)\n\n` +
        `Name: ${customerName}\n` +
        `Date: ${serviceDate}\n` +
        `Time: ${serviceTime}\n` +
        `Location Type: ${locationType}\n` +
        `Location: ${locationType === "others" ? address : `${hotelName}, Room ${roomNo}, ${address}`}\n\n` +
        `Selected Services:\n${summaryLines}\n\n` +
        `Actual Price: €${originalTotal.toFixed(2)}\n` +
        `10% Discount: -€${discountAmount.toFixed(2)}\n` +
        `Final Price: €${finalTotal.toFixed(2)}`
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 hide-scrollbar">
      <div
        className={`relative max-w-3xl w-full max-h-[90vh] overflow-y-auto hide-scrollbar transform transition-all duration-500 ease-out ${
          animateIn ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-rose-500/20 rounded-3xl blur-sm" />
          <div className="relative bg-black/30 backdrop-blur-xl rounded-3xl p-8">
            <button
              aria-label="Close"
              title="Close"
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all duration-300 group z-50"
            >
              <span className="text-white text-lg">
                ×
              </span>
              <span className="pointer-events-none absolute top-0 left-[-60%] h-full w-8 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-[-20deg] opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out group-hover:left-[160%]" />
            </button>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-300 to-rose-400 bg-clip-text text-transparent mb-2">
                {t?.chooseYourPackage || "Choose Your Package"}
              </h2>
              <p className="text-white/70">
                {t?.selectYourPreferredServices || "Select your preferred beauty services and enjoy an exclusive 10% discount of the Actual price."}
              </p>
              <div className="w-20 h-0.5 bg-gradient-to-r from-pink-400 to-rose-500 mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-white">
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm font-medium">{t?.yourName || "Your Name"}</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={t?.fullName || "Full name"}
                    className="w-full border border-white/20 rounded-lg py-2 px-3 bg-white/10 text-white placeholder-white/50 focus:border-pink-400 focus:ring-rose-500/50 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium">{t?.selectDate || "Select Date"}</label>
                  <input
                    type="date"
                    value={serviceDate}
                    onChange={(e) => setServiceDate(e.target.value)}
                    min={new Date().toISOString().slice(0, 10)}
                    className="w-full border border-white/20 rounded-lg py-2 px-3 bg-white/10 text-white placeholder-white/50 focus:border-pink-400 focus:ring-rose-500/50 outline-none transition-all"
                  />
                </div>

                {/* Location Type Selection */}
                <div>
                  <label className="block mb-2 text-sm font-medium">{t?.locationType || "Location Type"}</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="locationType"
                        value="hotel"
                        checked={locationType === "hotel"}
                        onChange={(e) => setLocationType(e.target.value)}
                        className="text-pink-400 focus:ring-pink-400"
                      />
                      <span className="text-white">{t?.hotel || "Hotel"}</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="locationType"
                        value="airbnb"
                        checked={locationType === "airbnb"}
                        onChange={(e) => setLocationType(e.target.value)}
                        className="text-pink-400 focus:ring-pink-400"
                      />
                      <span className="text-white">Airbnb</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="locationType"
                        value="others"
                        checked={locationType === "others"}
                        onChange={(e) => setLocationType(e.target.value)}
                        className="text-pink-400 focus:ring-pink-400"
                      />
                      <span className="text-white">{t?.others || "Others"}</span>
                    </label>
                  </div>
                </div>

                {/* Conditional Fields */}
                {(locationType === "hotel" || locationType === "airbnb") && (
                  <>
                    <div>
                      <label className="block mb-1 text-sm font-medium">
                        {locationType === "hotel" ? "Hotel Name" : "Airbnb Name"}
                      </label>
                      <input
                        type="text"
                        value={hotelName}
                        onChange={(e) => setHotelName(e.target.value)}
                        placeholder={`Enter your ${locationType} name`}
                        className="w-full border border-white/20 rounded-lg py-2 px-3 bg-white/10 text-white placeholder-white/50 focus:border-pink-400 focus:ring-rose-500/50 outline-none transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium">Room No.</label>
                      <input
                        type="text"
                        value={roomNo}
                        onChange={(e) => setRoomNo(e.target.value)}
                        placeholder="Enter room number"
                        className="w-full border border-white/20 rounded-lg py-2 px-3 bg-white/10 text-white placeholder-white/50 focus:border-pink-400 focus:ring-rose-500/50 outline-none transition-all"
                        required
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block mb-1 text-sm font-medium">{t?.address || "Address"}</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={t?.enterCompleteAddress || "Enter complete address"}
                    className="w-full border border-white/20 rounded-lg py-2 px-3 bg-white/10 text-white placeholder-white/50 focus:border-pink-400 focus:ring-rose-500/50 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium">{t?.selectTime || "Select Time"}</label>
                  <input
                    type="time"
                    value={serviceTime}
                    onChange={(e) => setServiceTime(e.target.value)}
                    className="w-full border border-white/20 rounded-lg py-2 px-3 bg-white/10 text-white placeholder-white/50 focus:border-pink-400 focus:ring-rose-500/50 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    {t?.selectYourServices || "Select Your Services"}
                  </h3>
                  <div className="max-h-64 overflow-y-auto hide-scrollbar space-y-2">
                    {availableServices.map((service) => (
                      <div key={service.title}>
                        <button
                          type="button"
                          onClick={() => toggleService(service.title)}
                          className={`w-full flex items-center justify-between rounded-xl border px-3 py-2 text-sm transition-all ${
                            selectedServices.includes(service.title)
                              ? "bg-pink-500/20 border-pink-400 text-white"
                              : "bg-white/5 border-white/20 text-white/80 hover:bg-white/10"
                          }`}
                        >
                          <span>{service.title}</span>
                          <span className="font-semibold">
                            {service.title === "Hair Extension" || service.title === "Hair colour and style "
                              ? `Min. €${(service.numericPrice || 0).toFixed(2)}`
                              : `€${(service.numericPrice || 0).toFixed(2)}`}
                          </span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Conditional Warning Messages */}
                {selectedServices.length === 1 && (
                  <div className="mt-3 p-3 bg-amber-500/20 border border-amber-400/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-amber-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <p className="text-amber-300 text-sm font-medium">
                        {t?.selectTwoOrMoreServices || "Select 2 or more services to get 10% discount on Customized beauty Service Package"}
                      </p>
                    </div>
                  </div>
                )}

                {/* Caution Alert for Hair Extension */}
                {hasHairExtension && (
                  <div className="mt-3 p-3 bg-amber-500/20 border border-amber-400/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-amber-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <p className="text-amber-300 text-sm font-medium">
                        {t?.hairExtensionWarning || "Hair Extension: €300 is a minimum deposit. (Final price depends on technique utilized, hair lenght & weight.)"}
                      </p>
                    </div>
                  </div>
                )}

                {/* Caution Alert for Hair Colour and Style */}
                {hasHairColourStyle && (
                  <div className="mt-3 p-3 bg-amber-500/20 border border-amber-400/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-amber-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <p className="text-amber-300 text-sm font-medium">
                        {t?.hairColourWarning || "Hair Colour and Style: €150 is a minimum deposit. (Final price depends on hair lenght & Technique.)"}
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/70">{t?.actualPrice || "Actual Price"}</span>
                    <span className="font-semibold text-white">€{originalTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">{t?.tenPercentDiscountLabel || "10% Discount"}</span>
                    <span className="font-semibold text-emerald-400">-€{discountAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-white/20 pt-2 mt-1">
                    <span className="text-white">{t?.finalPrice || "Final Price"}</span>
                    <span className="font-bold text-amber-400">€{finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <button
                type="button"
                disabled={!formValid}
                onClick={handleConfirm}
                className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                  formValid
                    ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:scale-105 hover:shadow-lg"
                    : "bg-white/10 text-white/60 border border-white/20 cursor-not-allowed"
                }`}
              >
                {formValid ? t?.confirmCustomizedBooking || "Confirm Customized Booking" : t?.completeFormAndSelectServices || "Complete form and select services"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Beauty() {
  const { language } = useContext(LanguageContext);
  const langMap = { 'EN': 'en', 'ES': 'es', 'RU': 'ru' };
  const currentLang = langMap[language] || 'en';
  const t = beautyServicesTranslations[currentLang] || beautyServicesTranslations['en'];
  
  const [isOpen, setIsOpen] = useState(false);
  const [modalInfo, setModalInfo] = useState({ open: false, title: "", price: "" });
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isFullMenuOpen, setFullMenuOpen] = useState(false);

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getServices = () => [
    {
      image: "/beauty/custom.jpeg",
      titleKey: "chooseYourPackage",
      title: t.chooseYourPackage,
      description: t.selectYourPreferredBeauty,
      priceKey: "tenPercentDiscount",
      price: t.tenPercentDiscount,
      gradient: "from-pink-400 via-rose-500 to-red-500",
    },
    {
      image: "/beauty/facemas.jpeg",
      titleKey: "sculptingFaceMassage",
      title: t.sculptingFaceMassage,
      description: "Experience the finest hairstyles from our expert stylists",
      price: "350€/pp",
      numericPrice: 350,
      gradient: "from-pink-400 via-rose-500 to-red-500",
    },
    {
      image: "/beauty/mackup.jpeg",
      titleKey: "makeup",
      title: t.makeup,
      description: "Complete luxury beauty package with brow & lash lamination plus premium gel manicure & pedicure",
      price: "350€/pp",
      numericPrice: 350,
      gradient: "from-pink-400 via-rose-500 to-red-500",
    },
    {
      image: "/beauty/bodymas.jpeg",
      titleKey: "fullBodyMassage",
      title: t.fullBodyMassage,
      description: "Complete transformation with gorgeous lashes and elegant nail styling",
      price: "350€/pp",
      numericPrice: 350,
      gradient: "from-emerald-400 via-teal-500 to-cyan-600",
    },
    {
      image: "/beauty/hair.jpeg",
      titleKey: "hairExtension",
      title: t.hairExtension,
      description: "Experience the finest hairstyles from our expert stylists (Final price depends on technique utilized, hair lenght & weight.)",
      price: "Min. Deposit €300",
      numericPrice: 300,
      depositMessage: "(Final price depends on technique utilized, hair lenght & weight.)",
      gradient: "from-pink-400 via-rose-500 to-red-500",
    },
    
    {
      image: "/beauty/lash.jpeg",
      titleKey: "lashExtension",
      title: t.lashExtension,
      description: "Stunning lash extensions paired with professional hairstyling",
      price: "300€/pp",
      numericPrice: 300,
      gradient: "from-amber-400 via-orange-500 to-red-500",
    },
    
    {
      image: "/mani.jpeg",
      titleKey: "nailsGelOrSemiGel",
      title: t.nailsGelOrSemiGel,
      description: "Stand out with elegant manicure and expertly crafted hairstyle",
      price: "200€/pp",
      numericPrice: 200,
      gradient: "from-blue-400 via-purple-500 to-indigo-600",
    },
    {
      image: "/mas.jpeg",
      titleKey: "pedicureSemiGelOrPolish",
      title: t.pedicureSemiGelOrPolish,
      description: "Professional manicure & pedicure with premium gel or semi-gel finish",
      price: "150€/pp",
      numericPrice: 150,
      gradient: "from-purple-400 via-violet-500 to-indigo-600",
    },
    {
      image: "/beauty/color.jpeg",
      titleKey: "hairColourAndStyle",
      title: t.hairColourAndStyle,
      description: "Premium lash extensions for everyday elegance and natural beauty (Final price depends on hair lenght & Technique.)",
      price: "Min. Deposit €150",
      numericPrice: 150,
      depositMessage: "(Final price depends on hair lenght & Technique.)",
      gradient: "from-violet-400 via-purple-500 to-fuchsia-600",
    },
    {
      image: "/hair.jpeg",
      titleKey: "hairstyle",
      title: t.hairstyle,
      description: "Experience the finest hairstyles from our expert stylists",
      price: "150€/pp",
      numericPrice: 150,
      gradient: "from-pink-400 via-rose-500 to-red-500",
    },
    {
      image: "/beauty/brow.jpeg",
      titleKey: "browLamination",
      title: t.browLamination,
      description: "Experience the finest hairstyles from our expert stylists",
      price: "120 €/pp",
      numericPrice: 120,
      gradient: "from-pink-400 via-rose-500 to-red-500",
    },
    {
      image: "/beauty/lashlam.jpeg",
      titleKey: "lashLamination",
      title: t.lashLamination,
      description: "Experience the finest hairstyles from our expert stylists",
      price: "100€/pp",
      numericPrice: 100,
      gradient: "from-pink-400 via-rose-500 to-red-500",
    },
  ];
  
  const services = getServices();

  const openModal = (title, price) => {
    console.log('Opening modal for:', title, price);
    setModalInfo({ open: true, title, price });
  };
  const closeModal = () => setModalInfo({ open: false, title: "", price: "" });

  const openCustomizeModal = () => {
    setIsCustomizeOpen(true);
  };

  const closeCustomizeModal = () => {
    setIsCustomizeOpen(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Fixed Background */}
      <div 
        className="fixed inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('/beauty/bg.jpeg')",
        }}
      />
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-transparent z-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40 z-0" />

      {/* Floating Elements */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-r from-pink-400/20 to-rose-500/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute top-60 left-20 w-24 h-24 bg-gradient-to-r from-purple-400/20 to-violet-500/20 rounded-full blur-xl animate-pulse delay-1000" />
      <div className="absolute bottom-40 right-1/4 w-40 h-40 bg-gradient-to-r from-amber-400/20 to-orange-500/20 rounded-full blur-xl animate-pulse delay-2000" />
              <FullscreenMenu isOpen={isFullMenuOpen} setIsOpen={setFullMenuOpen} />

      {/* Back Button */}
      <BackButton variant="glass" />

      {/* Content container */}
      <div className="relative z-10 min-h-screen text-white flex flex-col">
        {/* Elite Premium Navbar */}
        <TopNav active="services" />

        {/* Hero Section */}
        <section className="relative mt-8 py-20 px-8">
          <div className="max-w-6xl mx-auto text-center">
            {/* Home Button */}
            <div className="mb-8 mt-4 flex justify-center">
              <Link to="/">
                <button className="group flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-pink-400 to-rose-500 text-white font-medium hover:from-pink-500 hover:to-rose-600 transition-all duration-300 shadow-2xl hover:shadow-pink-500/25 hover:scale-105">
                  <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  {t.home || "Home"}
                </button>
              </Link>
            </div> 

            {/* Main Title */}
            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-pink-200 via-rose-300 to-amber-400 bg-clip-text text-transparent drop-shadow-2xl">
              {t.beautyServicesTitle}
            </h1>
            
            <div className="w-32 h-1 bg-gradient-to-r from-pink-400 to-rose-500 mx-auto mb-8 rounded-full" />
            
            <h2 className="text-2xl md:text-3xl font-light mb-8 text-white/90 tracking-wide">
              {t.luxuryBeautyWellness}
            </h2>
            
            <p className="text-xl text-white/80 leading-relaxed mb-12 max-w-4xl mx-auto font-light">
            {t.beautyServicesDescription}
            </p>

            {/* Service Promise 
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 mb-12 max-w-3xl mx-auto">
              <h3 className="text-2xl font-semibold mb-4 text-amber-300">Our Promise</h3>
              <p className="text-white/80 leading-relaxed">
                Our beauty services are usually arranged as part of your complete itinerary package. 
                However, as a standalone service, we provide full outcall packages where our professional team 
                comes to your hotel and ensures you're completely satisfied with the results.
              </p>
            </div>*/}
          </div>
        </section>

        {/* Services Grid */}
        <section className=" px-8">
          <div className="max-w-7xl mx-auto">
            {/* Video Section */}
            <div className="mb-16 rounded-3xl overflow-hidden shadow-2xl border border-white/20 max-w-md mx-auto h-[28rem]">
  <video
    className="w-full h-full object-cover"
    autoPlay
    loop
    muted
    playsInline
  >
    <source src="/beauty2.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>
</div>


            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                {t.chooseYourBeautyExperience}
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-pink-400 to-rose-500 mx-auto mb-6 rounded-full" />
              <p className="text-xl text-white/70 max-w-3xl mx-auto">
                {t.eachServicePerformed}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.slice(0, 12).map((service, index) => (
                <SectionCard
                  key={service.title}
                  image={service.image}
                  title={service.title}
                  //description={service.description}
                  price={service.price}
                  gradient={service.gradient}
                  t={t}
                  onClick={() =>
                    service.title === t.chooseYourPackage
                      ? openCustomizeModal()
                      : openModal(service.title, service.price)
                  }
                />
              ))}
            </div>

            {/* Center any remaining services (e.g. last two) 
            {services.length > 6 && (
              <div className="flex justify-center mt-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl w-full">
                  {services.slice(6).map((service, index) => (
                    <SectionCard
                      key={service.title}
                      image={service.image}
                      title={service.title}
                      //description={service.description}
                      price={service.price}
                      gradient={service.gradient}
                      onClick={() => openModal(service.title, service.price)}
                    />
                  ))}
                </div>
              </div>
            )}*/}
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
                        <button className="px-8 py-4 bg-gradient-to-r from-pink-400 to-rose-500 text-white font-semibold rounded-full hover:from-pink-500 hover:to-rose-600 transition-all duration-300 shadow-2xl hover:shadow-emerald-500/25 hover:scale-105">
                          {t.personalCurator}
                        </button>
                      </Link>
                      
                    </div>
                  </div>
                </section>
      </div>
      
      <BookingFormModal
        isOpen={modalInfo.open}
        onClose={closeModal}
        serviceName={modalInfo.title}
        servicePrice={modalInfo.price}
        t={t}
      />

      <CustomizeServiceModal
        isOpen={isCustomizeOpen}
        onClose={closeCustomizeModal}
        availableServices={services.filter((s) => s.title !== "Choose Your Package")}
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
