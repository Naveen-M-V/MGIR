import React, { useState, useEffect, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import FullscreenMenu from "./FullscreenMenu";
import TopNav from "../components/TopNav";
import WishlistButton from "../components/WishlistButton";
import AuthModal from "../components/AuthModal";
import BackButton from "../components/BackButton";
import Footer from "../components/Footer";
import { galleryPageTranslations } from "../locales/galleryPageTranslations";
import { LanguageContext } from "../context/LanguageContext";
import FloatingSocial from "../components/FloatingSocial";

export default function GalleryPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);
  
  // Map global language codes to translation keys
  const langMap = { 'EN': 'en', 'ES': 'es', 'RU': 'ru' };
  const currentLang = langMap[language] || 'en';
  const t = galleryPageTranslations[currentLang];
  const [isFullMenuOpen, setFullMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  // Set category based on URL parameter
  useEffect(() => {
    if (category) {
      setSelectedCategory(category);
    } else {
      setSelectedCategory("all");
    }
  }, [category]);

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Gallery data
  const galleryItems = [
    { id: 1, type: "image", src: "/tour/tour1.jpg", title: "Colosseum Experience", category: "tour", description: "Ancient Roman amphitheater in all its glory" },
    { id: 2, type: "image", src: "/tour/tour2.jpg", title: "Trevi Fountain", category: "tour", description: "Make a wish at Rome's most famous fountain" },
    { id: 3, type: "image", src: "/tour/tour3.jpg", title: "Colosseum underground & arena tour", category: "tour", description: "The heart of the Catholic Church" },
    { id: 4, type: "image", src: "/tour/tour4.jpg", title: "Tivoli Fountains", category: "tour", description: "Ancient Roman temple with a perfect dome" },
    { id: 5, type: "image", src: "/tour/tour5.jpg", title: " Vatican Museum", category: "tour", description: "Iconic steps with a beautiful view" },
    { id: 6, type: "image", src: "/tour/tour6.jpg", title: "Roman Forum", category: "tour", description: "The center of ancient Roman public life" },
    { id: 7, type: "image", src: "/tour/tour7.jpg", title: "Piazza Navona", category: "tour", description: "Beautiful square with stunning fountains" },
    { id: 8, type: "image", src: "/tour/tour8.jpg", title: "St. Peter's Basilica", category: "tour", description: "Ancient Roman public baths" },
    { id: 9, type: "image", src: "/general/tour9.jpg", title: "Personalized Tours", category: "general", description: "Customized Roman experiences" },
    { id: 10, type: "image", src: "/tour/tour13.jpg", title: "Ancient Rome", category: "tour", description: "Discover Rome's ancient wonders" },
    { id: 11, type: "image", src: "/tour/tour12.jpg", title: "Roman Cuisine", category: "general", description: "Authentic Italian dining experiences" },
    { id: 12, type: "image", src: "/general/tour14.jpg", title: "Luxury Transport", category: "general", description: "Premium transportation services" },
    { id: 13, type: "image", src: "/beauty/hair1.jpeg", title: "Hair Extension", category: "beauty", description: "Authentic Italian dining experiences" },
    { id: 14, type: "image", src: "/beauty/hair2.jpeg", title: "brow Lamination", category: "beauty", description: "Premium transportation services" },
    { id: 15, type: "image", src: "/beauty/hair3.jpeg", title: "Full Body Massage", category: "beauty", description: "Authentic Italian dining experiences" },
    { id: 16, type: "image", src: "/beauty/hair.jpeg", title: "Sculpting Face Massage", category: "beauty", description: "Premium transportation services" },
    { id: 17, type: "image", src: "/beauty/lash.jpeg", title: "Hair Extension", category: "beauty", description: "Authentic Italian dining experiences" },
    { id: 18, type: "image", src: "/beauty/lash2.jpeg", title: "Nail Lamination", category: "beauty", description: "Premium transportation services" },
    { id: 19, type: "image", src: "/beauty/lash3.jpeg", title: "Makeup", category: "beauty", description: "Authentic Italian dining experiences" },
    { id: 20, type: "image", src: "/beauty/lash4.jpeg", title: "Lash Lamination", category: "beauty", description: "Premium transportation services" },
    { id: 21, type: "image", src: "/general/baby1.jpeg", title: "Baby Sitting", category: "general", description: "Premium transportation services" },
    { id: 22, type: "image", src: "/general/baby2.jpeg", title: "baby Sitting", category: "general", description: "Premium transportation services" },
    { id: 23, type: "image", src: "/general/pet1.jpeg", title: "Pet Siting ", category: "general", description: "Premium transportation services" },
    { id: 24, type: "image", src: "/general/pet2.jpeg", title: "Pet Sitting ", category: "general", description: "Premium transportation services" },
    { id: 25, type: "image", src: "/beauty/lash5.jpeg", title: "Full Body Massage", category: "beauty", description: "Authentic Italian dining experiences" },
    { id: 27, type: "image", src: "/beauty/lam2.jpeg", title: "Hair Extension", category: "beauty", description: "Authentic Italian dining experiences" },
    { id: 28, type: "image", src: "/beauty/lam3.jpeg", title: "Nail Lamination", category: "beauty", description: "Premium transportation services" },
    { id: 29, type: "image", src: "/beauty/lam4.jpeg", title: "Makeup", category: "beauty", description: "Authentic Italian dining experiences" },
    { id: 30, type: "image", src: "/beauty/lam5.jpeg", title: "Lash Lamination", category: "beauty", description: "Premium transportation services" },
    { id: 31, type: "image", src: "/beauty/mas1.jpeg", title: "Baby Sitting", category: "beauty", description: "Premium transportation services" },
    { id: 32, type: "image", src: "/beauty/mas2.jpeg", title: "baby Sitting", category: "beauty", description: "Premium transportation services" },
    { id: 33, type: "image", src: "/beauty/mas3.jpeg", title: "Pet Siting ", category: "beauty", description: "Premium transportation services" },
    { id: 34, type: "image", src: "/beauty/mas4.jpeg", title: "Pet Sitting ", category: "beauty", description: "Premium transportation services" },
    { id: 35, type: "image", src: "/beauty/mas5.jpeg", title: "Full Body Massage", category: "beauty", description: "Authentic Italian dining experiences" },
    { id: 36, type: "image", src: "/beauty/nail1.jpeg", title: "Sculpting Face Massage", category: "beauty", description: "Premium transportation services" },
    { id: 37, type: "image", src: "/beauty/nail2.jpeg", title: "Hair Extension", category: "beauty", description: "Authentic Italian dining experiences" },
    { id: 38, type: "image", src: "/beauty/nail3.jpeg", title: "Nail Lamination", category: "beauty", description: "Premium transportation services" },
    { id: 39, type: "image", src: "/beauty/nail4.jpeg", title: "Makeup", category: "beauty", description: "Authentic Italian dining experiences" },
    { id: 40, type: "image", src: "/beauty/nail5.jpeg", title: "Lash Lamination", category: "beauty", description: "Premium transportation services" },
    { id: 41, type: "image", src: "/beauty/style1.jpeg", title: "Baby Sitting", category: "beauty", description: "Premium transportation services" },
    { id: 42, type: "image", src: "/beauty/style2.jpeg", title: "baby Sitting", category: "beauty", description: "Premium transportation services" },
    { id: 43, type: "image", src: "/beauty/style3.jpeg", title: "Pet Siting ", category: "beauty", description: "Premium transportation services" },
    { id: 44, type: "image", src: "/beauty/style4.jpeg", title: "Pet Sitting ", category: "beauty", description: "Premium transportation services" },
    { id: 45, type: "image", src: "/beauty/style5.jpeg", title: "Full Body Massage", category: "beauty", description: "Authentic Italian dining experiences" },

  ];

  const categories = [
    { id: "all", label: t.filterAll },
    { id: "tour", label: t.filterTour },
    { id: "beauty", label: t.filterBeauty },
    { id: "general", label: t.filterGeneral }
  ];

  const filteredItems =
    selectedCategory === "all"
      ? galleryItems
      : galleryItems.filter((item) => item.category === selectedCategory);

  const openModal = (item) => {
    setSelectedMedia(item);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedMedia(null);
    document.body.style.overflow = "unset";
  };

  const handleLoginRequired = () => {
    setAuthMode("login");
    setAuthModalOpen(true);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/gallerybg.jpeg')" }}
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-transparent z-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent z-0" />

      {/* Floating glows */}
      <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-20 sm:w-32 h-20 sm:h-32 bg-amber-400/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-40 right-5 sm:right-20 w-16 sm:w-24 h-16 sm:h-24 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute bottom-40 left-1/4 w-24 sm:w-40 h-24 sm:h-40 bg-teal-500/20 rounded-full blur-3xl animate-pulse delay-2000" />

      {/* Menu */}
      <FullscreenMenu isOpen={isFullMenuOpen} setIsOpen={setFullMenuOpen} />

      <BackButton variant="glass" />

      <div className="relative z-10 min-h-screen">
        <TopNav active="gallery" />

        {/* HERO */}
<section className="relative py-12 sm:py-16 md:py-24 lg:py-32 px-4 sm:px-6 md:px-8">
  <div className="max-w-5xl mx-auto text-center">
    <div className="mb-6 sm:mb-8 mt-2 sm:mt-4 flex justify-center">
      <Link to="/">
        <button className="group flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-medium text-sm sm:text-base hover:from-amber-600 hover:to-yellow-700 transition-all duration-300 shadow-2xl hover:shadow-emerald-500/25 hover:scale-105">
          <svg className="w-4 sm:w-5 h-4 sm:h-5 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          {t.home}
        </button>
      </Link>
    </div>  
    {/* Title */}
    <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 sm:mb-6 
      bg-gradient-to-r from-amber-200 via-yellow-300 to-orange-400 
      bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(255,180,70,0.35)]">
      {t.gallery.toUpperCase()}
    </h1>

    {/* Divider Line */}
    <div className="w-20 sm:w-28 h-[3px] bg-gradient-to-r from-amber-400 to-orange-500 mx-auto mb-4 sm:mb-6 rounded-full shadow-md shadow-amber-500/40" />

    {/* Subtitle */}
    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/85 leading-relaxed max-w-3xl mx-auto font-light tracking-wide px-2">
      {t.heroSubtitle}
    </p>
  </div>

  {/* Soft Glow Background Accents */}
  <div className="absolute inset-0 -z-10">
    <div className="absolute left-1/2 top-1/3 w-72 h-72 bg-amber-500/10 rounded-full blur-[120px] -translate-x-1/2" />
    <div className="absolute right-10 bottom-10 w-64 h-64 bg-orange-500/10 rounded-full blur-[100px]" />
  </div>
</section>


        {/* CATEGORY FILTER */}
        <section className="px-4 sm:px-6 md:px-8 py-8 sm:py-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mb-8 sm:mb-10">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() =>
                    navigate(cat.id === "all" ? "/gallery" : `/gallery/${cat.id}`)
                  }
                  className={`px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm rounded-full transition-all duration-300 backdrop-blur-md border ${
                    selectedCategory === cat.id
                      ? "bg-gradient-to-r from-amber-500 to-orange-600 border-transparent text-white shadow-lg shadow-amber-500/40 scale-105"
                      : "bg-white/10 border-white/20 text-orange-400 hover:bg-white/20"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* GRID */}
        <section className="px-4 sm:px-6 md:px-8 pb-16 sm:pb-20 md:pb-28">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => openModal(item)}
                  className="group relative rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer bg-white/10 backdrop-blur-xl border border-white/10 hover:border-amber-400/50 transition-all duration-500 hover:shadow-xl hover:shadow-amber-500/10"
                >
                  {/* Image */}
                  <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-48 sm:h-56 md:h-64 lg:h-80 object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-all duration-500" />

                  {/* Text */}
                  <div className="absolute bottom-0 w-full p-4">
                    {/*<h3 className="text-white font-semibold text-lg group-hover:text-amber-300 transition-all duration-300">
                      {item.title}
                    </h3> */}
                    

                    <span className="px-3 py-1 text-xs bg-white/10 border border-white/20 rounded-full text-white/80 backdrop-blur-md">
                      {categories.find((c) => c.id === item.category)?.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* MODAL */}
      {selectedMedia && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-3xl z-50 flex items-center justify-center p-4">
          <button
            onClick={closeModal}
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full text-white flex items-center justify-center transition-all duration-300"
          >
            ✕
          </button>

          <div className="relative max-w-4xl max-h-[90vh] w-full overflow-hidden rounded-3xl shadow-2xl">
            <img
              src={selectedMedia.src}
              alt={selectedMedia.title}
              className="w-full h-full object-contain"
            />

            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="text-white text-2xl font-bold mb-2">
                {selectedMedia.title}
              </h3>
            </div>
          </div>
        </div>
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
      <Footer />
    </div>
  );
}
