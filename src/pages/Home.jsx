import React, { useState } from "react";
import VideoModal from "./VideoModal";
import Footer from "./Footer";
import FloatingSocial from "../components/FloatingSocial";
import { translations } from "../data/translations";
import { LanguageContext } from "../context/LanguageContext";
import { useContext } from "react";

export default function Home() {
  const [isModalOpen, setModalOpen] = useState(false);
  const { language } = useContext(LanguageContext);
  const t = translations[language];

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden overflow-y-auto">
      
      {/* Background Video */}
      <div className="fixed inset-0 -z-10 w-full h-full">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Login/Signup Button */}
      <div className="fixed top-4 sm:top-6 md:top-8 right-4 sm:right-6 md:right-8 z-20">
        <button
          className="px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold text-xs sm:text-sm md:text-base rounded-full hover:from-amber-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
        >
          Login / Sign Up
        </button>
      </div>

      {/* Page Content */}
      <div className="relative z-10 w-full pt-28 pb-20 flex flex-col items-center text-center text-white px-4 sm:px-6 md:px-8">

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl max-w-sm sm:max-w-md md:max-w-lg mx-auto w-full">

          {/* Logo */}
          <div className="flex justify-center mb-4 sm:mb-5 md:mb-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-400 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
              <img
                src="/logo.png"
                alt="My Guide in Rome"
                className="h-12 sm:h-16 md:h-20 w-auto relative z-10 transform group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Personal Curator to Rome</h1>

          <p className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 md:mb-10 leading-relaxed">
            Discover timeless traditions and exquisite wines.
          </p>

          {/* Play Button */}
          <button
            onClick={() => setModalOpen(true)}
            className="
              start-btn
              px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 text-lg sm:text-xl md:text-2xl font-bold rounded-lg sm:rounded-xl
              bg-gradient-to-t from-[#fcc266] to-[#dfa70d] text-black shadow-lg
              transition-transform duration-300
              hover:scale-105 hover:-translate-y-1
              hover:shadow-[0_12px_32px_0_rgba(255,198,102,0.4)]
              w-full sm:w-auto
            "
          >
            {t.getStarted}
          </button>

        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Video Modal */}
      <VideoModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
      
      <FloatingSocial />
    </div>
  );
}
