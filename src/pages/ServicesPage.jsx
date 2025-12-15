import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import FullscreenMenu from "./FullscreenMenu";
import TopNav from "../components/TopNav";
import BackButton from "../components/BackButton";
import Footer from "../components/Footer";
import FloatingSocial from "../components/FloatingSocial";
import { servicesPageTranslations } from "../locales/servicesPageTranslations";
import { LanguageContext } from "../context/LanguageContext";

export default function Services() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullMenuOpen, setFullMenuOpen] = useState(false);
  const { language } = useContext(LanguageContext);
  
  // Map global language codes to translation keys
  const langMap = { 'EN': 'en', 'ES': 'es', 'RU': 'ru' };
  const currentLang = langMap[language] || 'en';
  const t = servicesPageTranslations[currentLang];

  // Service icons and gradients (static)
  const serviceIcons = ["💎", "✨", "🏛️", "⚡", "🤗", "💎"];
  const serviceGradients = [
    "",
    "from-amber-400 via-orange-500 to-red-500",
    "from-blue-400 via-purple-500 to-indigo-600",
    "from-emerald-400 via-teal-500 to-cyan-600",
    "from-pink-400 via-rose-500 to-red-500",
    "from-violet-400 via-purple-500 to-fuchsia-600"
  ];
  const servicePaths = ["/personal", "/personalized", "/tour", "/seamless", "/sitting", "/beauty"];

  // Enhanced service data with translations
  const services = t.services.map((service, index) => ({
    ...service,
    path: servicePaths[index],
    icon: serviceIcons[index],
    gradient: serviceGradients[index]
  }));

  const stats = t.stats;
  const testimonials = t.testimonials.map((testimonial, index) => ({
    ...testimonial,
    rating: [5, 5, 4][index]
  }));

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Fixed Background */}
      <div 
        className="fixed inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('/Rome-about.jpg')"
        }}
      />
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-transparent z-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40 z-0" />

      {/* Floating Elements */}
      <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-20 sm:w-32 h-20 sm:h-32 bg-gradient-to-r from-amber-400/20 to-orange-500/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute top-40 right-5 sm:right-20 w-16 sm:w-24 h-16 sm:h-24 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full blur-xl animate-pulse delay-1000" />
      <div className="absolute bottom-40 left-1/4 w-24 sm:w-40 h-24 sm:h-40 bg-gradient-to-r from-emerald-400/20 to-teal-500/20 rounded-full blur-xl animate-pulse delay-2000" />

      {/* Hamburger Menu */}
      <FullscreenMenu isOpen={isFullMenuOpen} setIsOpen={setFullMenuOpen} />

      {/* Back Button */}
      <BackButton variant="glass" />

      {/* Page content */}
      <div className="relative z-10 min-h-screen">
        {/* Elite Premium Navbar */}
        <TopNav active="services" />

        {/* Hero Section */}
        <section className="flex-1 flex items-center justify-center mt-4 sm:mt-6 md:mt-8 px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20">
          <div className="max-w-6xl mx-auto text-center w-full">
            {/* Home Button */}
            <div className="mb-6 sm:mb-8 mt-2 sm:mt-4 flex justify-center">
              <Link to="/">
                <button className="group flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 text-white font-medium text-sm sm:text-base hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 shadow-2xl hover:shadow-cyan-500/25 hover:scale-105">
                  <svg className="w-4 sm:w-5 h-4 sm:h-5 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  {t.home}
                </button>
              </Link>
            </div>
            {/* Main Title */}
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent drop-shadow-2xl">
              {t.ourServices}
            </h1>
            
            <div className="w-20 sm:w-32 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto mb-6 sm:mb-8 rounded-full" />
            
            <h2 className="text-lg sm:text-2xl md:text-4xl font-light mb-6 sm:mb-8 text-white/90 tracking-wide px-2">
              {t.experienceRomeLocal}
            </h2>
            
            <p className="text-sm sm:text-base md:text-xl text-white/80 leading-relaxed mb-8 sm:mb-12 max-w-4xl mx-auto font-light px-2">
              {t.tagline}
            </p>
            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-amber-400 group-hover:scale-110 transition-transform duration-300">
                    {stat.number}
                  </div>
                  <div className="text-white/70 text-xs sm:text-sm tracking-wide uppercase">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="px-4 sm:px-6 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 sm:mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
                {t.servicesHeading}
              </h2>
              <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto mb-4 sm:mb-6 rounded-full" />
              
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
              {services.map((service, index) => (
                <Link
                  key={service.name}
                  to={service.path}
                  className="group relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl flex flex-col"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                  
                  <div className="relative p-4 sm:p-6 md:p-8 flex flex-col flex-grow">
                    
                    {/* Title */}
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4 group-hover:text-amber-300 transition-colors duration-300">
                      {service.name}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-sm sm:text-base text-white/70 mb-4 sm:mb-6 leading-relaxed">
                      {service.description}
                    </p>
                    
                    {/* Features */}
                    <div className="space-y-1 sm:space-y-2 mb-4 sm:mb-6 flex-grow">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-xs sm:text-sm text-white/60">
                          <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-amber-400 rounded-full mr-2 sm:mr-3" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    
                    {/* CTA - Fixed at bottom */}
                    <div className="flex items-center text-amber-400 font-medium group-hover:text-amber-300 transition-colors duration-300 mt-auto text-sm sm:text-base">
                      {t.exploreService}
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-2 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
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
                                <button className="px-8 py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-semibold rounded-full hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-2xl hover:shadow-emerald-500/25 hover:scale-105">
                                  {t.services[0].name}
                                </button>
                              </Link>
                              
                            </div>
                          </div>
                        </section>
      </div>
      <Footer />
    </div>
  );
}
