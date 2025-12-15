import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import FullscreenMenu from "./FullscreenMenu";
import TopNav from "../components/TopNav";
import BackButton from "../components/BackButton";
import Footer from "../components/Footer";
import { aboutPageTranslations } from "../locales/aboutPageTranslations";
import { LanguageContext } from "../context/LanguageContext";
import FloatingSocial from "../components/FloatingSocial";

export default function About() {
  const [isFullMenuOpen, setFullMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const { language } = useContext(LanguageContext);
  
  // Map global language codes to translation keys
  const langMap = { 'EN': 'en', 'ES': 'es', 'RU': 'ru' };
  const currentLang = langMap[language] || 'en';
  const t = aboutPageTranslations[currentLang];

  // Auto-rotate testimonials
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % t.testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [language]);

  const testimonials = t.testimonials.map((testimonial, index) => ({
    ...testimonial,
    rating: [5, 5, 4, 5, 5, 5][index] // Ratings for each testimonial
  }));

  const images = [
   "/aboutus1.jpg",
    "/fam1.jpg",
    "/aboutus3.jpg",
    "/fam2.jpg",,
    "/aboutus5.jpg",,
    "/aboutus8.jpg",,
    "/aboutus7.jpg",,
  ];

  return (
    <div
      className="relative min-h-screen"
      style={{
        backgroundImage: "url('/about.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "scroll",
      }}
    >
      {/* Floating Elements */}
      <div className="absolute top-10 sm:top-20 right-5 sm:right-10 w-20 sm:w-32 h-20 sm:h-32 bg-gradient-to-r from-amber-400/20 to-orange-500/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute top-40 sm:top-60 left-5 sm:left-20 w-16 sm:w-24 h-16 sm:h-24 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full blur-xl animate-pulse delay-1000" />
      <div className="absolute bottom-40 right-1/4 w-24 sm:w-40 h-24 sm:h-40 bg-gradient-to-r from-emerald-400/20 to-teal-500/20 rounded-full blur-xl animate-pulse delay-2000" />

      <FullscreenMenu isOpen={isFullMenuOpen} setIsOpen={setFullMenuOpen} />

      <BackButton variant="floating" />

      <div className="relative z-10 min-h-screen text-white flex flex-col">
        <TopNav active="about" />

        {/* Hero Section */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20 bg-black/30">
          <div className="max-w-6xl mt-2 mx-auto text-center w-full">
            {/* Home Button */}
            <div className="mb-6 sm:mb-8 mt-6 sm:mt-8 flex justify-center">
              <Link to="/">
                <button className="group flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white font-medium text-sm sm:text-base hover:from-amber-500 hover:to-orange-600 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 hover:scale-105">
                  <svg
                    className="w-4 sm:w-5 h-4 sm:h-5 group-hover:-translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  {t.home}
                </button>
              </Link>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-7xl mt-2 font-bold mb-6 sm:mb-8 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent drop-shadow-2xl">
              {t.aboutUs}
            </h1>

            <div className="w-20 sm:w-32 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto mb-6 sm:mb-8 rounded-full" />

            <p className="text-base sm:text-xl md:text-2xl text-amber-100 mb-8 sm:mb-12 font-light leading-relaxed max-w-4xl mx-auto px-2">
              {t.subtitle}
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-black/80 border-t border-amber-500/30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20">

            {/* Equal height columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-stretch">

              {/* LEFT SIDE CONTENT */}
              <div className="space-y-6 sm:space-y-8">
                <p className="text-sm sm:text-base md:text-lg text-gray-300 text-justify leading-relaxed">
                  {t.para1}
                </p>

                <p className="text-sm sm:text-base md:text-lg text-gray-300 text-justify leading-relaxed">
                  {t.para2}
                </p>

                <p className="text-sm sm:text-base md:text-lg text-gray-300 text-justify leading-relaxed">
                  {t.para3}
                </p>

                <p className="text-sm sm:text-base md:text-lg text-gray-300 text-justify leading-relaxed">
                  {t.para4}
                </p>

                <p className="text-sm sm:text-base md:text-lg text-gray-300 text-justify leading-relaxed">
                  {t.para5}
                </p>

                <p className="text-sm sm:text-base md:text-lg text-gray-300 text-justify leading-relaxed">
                  {t.para6}
                </p>

                <p className="text-sm sm:text-base md:text-lg text-gray-300 text-justify leading-relaxed">
                  {t.para7}
                </p>
              </div>

              {/* RIGHT SIDE FULL-HEIGHT COLLAGE */}
              <div className="flex h-full">
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 sm:gap-4 md:gap-6 lg:gap-8 auto-rows-[80px] sm:auto-rows-[100px] md:auto-rows-[120px] lg:auto-rows-[150px] flex-1 h-full">
                  {images.map((src, index) => (
                    <div
                      key={index}
                      className={`relative rounded-lg sm:rounded-xl overflow-hidden shadow-lg sm:shadow-xl hover:scale-105 transition-all duration-500 ${
                        index % 3 === 0 ? "row-span-2 sm:row-span-3" : "row-span-2"
                      }`}
                    >
                      <img
                        src={src}
                        alt={`Collage ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Testimonials Carousel */}
            <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 bg-gradient-to-r from-black/50 to-black/30 backdrop-blur-sm mt-12 sm:mt-16 md:mt-20">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-8 sm:mb-12 md:mb-16">
                  {t.testimonialTitle}
                </h2>

                <div className="relative">
                  <div className="overflow-hidden">
                    <div 
                      className="flex transition-transform duration-500 ease-in-out"
                      style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
                    >
                      {testimonials.map((testimonial, index) => (
                        <div key={index} className="w-full flex-shrink-0 px-4 sm:px-8">
                          <div className="bg-white/15 text-white backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-white/20"> 
                            {/* Stars */}
                            <div className="flex justify-center mb-4 sm:mb-6">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <svg key={i} className="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 text-amber-400 mx-0.5 sm:mx-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            
                            <p className="text-sm sm:text-base md:text-xl text-white/90 italic mb-4 sm:mb-6 md:mb-8 leading-relaxed">
                              "{testimonial.text}"
                            </p>
                            
                            {/* Trustpilot Logo */}
                            <div className="flex justify-center mb-3 sm:mb-4">
                              <img 
                                src="/tripadvisor.png" 
                                alt="Trustpilot" 
                                className="h-6 sm:h-8 md:h-10 object-contain"
                              />
                            </div>
                            
                            <div className="text-amber-400 font-semibold text-sm sm:text-base">
                              {testimonial.author}
                            </div>
                            <div className="text-white/60 text-xs sm:text-sm">
                              {testimonial.location}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Dots Indicator */}
                  <div className="flex justify-center mt-6 space-x-3">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentTestimonial(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentTestimonial 
                            ? 'bg-amber-400 scale-125' 
                            : 'bg-white/30 hover:bg-white/50'
                        }`}
                      />
                    ))}
                  </div>

                  {/* View More Reviews Button */}
                  <div className="flex justify-center mt-6 sm:mt-8">
                    <a 
                      href="https://www.tripadvisor.co.uk/Attraction_Review-g187791-d33993227-Reviews-Myguideinrome-Rome_Lazio.html" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-amber-400 to-orange-500 text-white font-semibold rounded-full hover:from-amber-500 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-amber-500/50 hover:scale-105"
                    >
                      {t.viewMoreReviews || "View More Reviews"}
                    </a>
                  </div>
                </div>
              </div>
            </section>

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
                      <button className="px-8 py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-semibold rounded-full hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-2xl hover:shadow-emerald-500/25 hover:scale-105">
                        {t.personalCurator}
                      </button>
                    </Link>
                    
                  </div>
                </div>
              </section>
          </div>
        </div>
      </div>
      

      <Footer />
    </div>
  );
}
