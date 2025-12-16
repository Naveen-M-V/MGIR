import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../hooks/useWishlist";
import { useTranslation } from "../hooks/useTranslation";
import FullscreenMenu from "./FullscreenMenu";
import TopNav from "../components/TopNav";
import BackButton from "../components/BackButton";
import { FaHeart, FaTrash, FaEye, FaArrowLeft, FaShoppingCart } from "react-icons/fa";
import Footer from "../components/Footer";
import FloatingSocial from "../components/FloatingSocial";

export default function WishlistPage() {
  const { isAuthenticated, user } = useAuth();
  const { wishlist, loading, removeFromWishlist, clearWishlist, getWishlistCount } = useWishlist();
  const { t } = useTranslation();
  const [isFullMenuOpen, setFullMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleRemoveItem = async (itemTitle) => {
    console.log('WishlistPage: Attempting to remove item:', itemTitle);
    try {
      const result = await removeFromWishlist(itemTitle);
      console.log('WishlistPage: Remove result:', result);
      if (result.success) {
        alert(`✅ ${result.message}`);
      } else {
        alert(`❌ ${result.message}`);
      }
    } catch (error) {
      console.error('WishlistPage: Error removing item:', error);
      alert(`❌ Error removing item: ${error.message}`);
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
      const result = await clearWishlist();
      if (result.success) {
        alert(`✅ ${result.message}`);
      } else {
        alert(`❌ ${result.message}`);
      }
    }
  };

  // Convert backend wishlist strings to objects for display
  const getWishlistItems = () => {
    console.log('WishlistPage: Current wishlist data:', wishlist);
    console.log('WishlistPage: isAuthenticated:', isAuthenticated);
    
    if (isAuthenticated) {
      // For authenticated users, wishlist is array of strings
      // Remove duplicates by using Set with trimmed and normalized titles
      const normalizedTitles = wishlist.map(title => title.trim());
      const uniqueTitles = [...new Set(normalizedTitles)];
      console.log('WishlistPage: Unique titles after deduplication:', uniqueTitles);
      
      return uniqueTitles.map(title => ({
        title,
        description: "Saved service from My Guide In Rome",
        category: "service",
        addedAt: new Date().toISOString()
      }));
    } else {
      // For guest users, wishlist is array of objects
      // Remove duplicates by title with trimming
      const uniqueItems = wishlist.filter((item, index, self) => {
        const normalizedTitle = item.title.trim();
        return index === self.findIndex((i) => i.title.trim() === normalizedTitle);
      });
      console.log('WishlistPage: Unique items after deduplication:', uniqueItems);
      return uniqueItems;
    }
  };

  const wishlistItems = getWishlistItems();
  console.log('WishlistPage: Processed wishlist items:', wishlistItems);

  return (
    <div className="relative min-h-screen">
      {/* Fixed Background */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat bg-attachment-fixed"
        style={{ 
          backgroundImage: "url('/wishbg.jpeg')"
        }}
      />
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-transparent z-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40 z-0" />

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-red-400/20 to-pink-500/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-rose-400/20 to-red-500/20 rounded-full blur-xl animate-pulse delay-1000" />
      <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-gradient-to-r from-pink-400/20 to-rose-500/20 rounded-full blur-xl animate-pulse delay-2000" />

      {/* Hamburger Menu */}
      <FullscreenMenu isOpen={isFullMenuOpen} setIsOpen={setFullMenuOpen} />

      {/* Back Button */}
      <BackButton variant="floating" />

      {/* Page content */}
      <div className="relative z-10 min-h-screen">
        {/* Elite Premium Navbar */}
        <TopNav active="wishlist" />

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center mt-2">
          <div className="max-w-6xl mx-auto text-center">
                      {/* Home Button */}
                              <div className="mb-6 sm:mb-8 flex justify-center mt-20 sm:mt-32">
                                <Link to="/">
                                  <button className="group flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-r from-pink-500  to-rose-400 text-white font-medium hover:from-pink-600 hover:to-rose-700 transition-all duration-300 shadow-2xl hover:shadow-cyan-500/25 hover:scale-105 text-sm sm:text-base">
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    {t.homeScreen}
                                  </button>
                                </Link>
                              </div>

            {/* Main Title */}
            <div className="flex items-center justify-center gap-2 sm:gap-4 mb-6 sm:mb-8">
              <FaHeart className="text-4xl sm:text-5xl md:text-6xl text-red-400 animate-pulse" />
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold bg-gradient-to-r from-red-200 via-pink-300 to-rose-400 bg-clip-text text-transparent drop-shadow-2xl">
                {t.wishlist}
              </h1>
            </div>
            
            <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-red-400 to-pink-500 mx-auto mb-6 sm:mb-8 rounded-full" />
            
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light mb-6 sm:mb-8 text-white/90 tracking-wide">
              {isAuthenticated ? `${user?.fullName}'s ${t.wishlist}` : `${t.wishlist}`}
            </h2>
            
            <p className="text-base sm:text-lg md:text-xl text-white/80 leading-relaxed mb-8 sm:mb-12 max-w-4xl mx-auto font-light px-4 sm:px-0">
              {t.wishlistDescription || "Keep track of your favorite tours, services, and experiences. Your wishlist helps you plan the perfect Roman adventure."}
            </p>

            {/* Wishlist Stats */}
            <div className="flex justify-center gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-red-400 mb-1 sm:mb-2">
                  {getWishlistCount()}
                </div>
                <div className="text-white/70 text-xs sm:text-sm uppercase tracking-wide">
                  {t.totalItems || "Total Items"}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-pink-400 mb-1 sm:mb-2">
                  {wishlist.filter(item => item.type === 'tour').length}
                </div>
                <div className="text-white/70 text-xs sm:text-sm uppercase tracking-wide">
                  {t.tours || "Tours"}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-rose-400 mb-1 sm:mb-2">
                  {wishlist.filter(item => item.type === 'service').length}
                </div>
                <div className="text-white/70 text-xs sm:text-sm uppercase tracking-wide">
                  {t.services || "Services"}
                </div>
              </div>
            </div>

            {/* Wishlist Content */}
            <section className="px-8 pb-20">
              <div className="max-w-7xl mx-auto">
                {/* Action Buttons */}
                {wishlistItems.length > 0 && (
                  <div className="flex justify-center gap-4 mb-12">
                    <button
                      onClick={handleClearAll}
                      className="flex items-center gap-2 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-red-300 rounded-full transition-all duration-300 hover:scale-105"
                    >
                      <FaTrash className="w-4 h-4" />
                      {t.clearAll || "Clear All"}
                    </button>
                  </div>
                )}

                {/* Wishlist Items */}
                {loading ? (
                  <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-400 mx-auto mb-4"></div>
                    <p className="text-white/70">{t.loadingWishlist || "Loading your wishlist..."}</p>
                  </div>
                ) : wishlistItems.length === 0 ? (
                  /* Empty State */
                  <div className="text-center py-20">
                    <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8">
                      <FaHeart className="w-16 h-16 text-white/30" />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-4">{t.wishlistEmpty || "Your wishlist is empty"}</h3>
                    <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
                      {t.wishlistEmptyDesc || "Start exploring our amazing tours and services. Click the heart icon on any item to add it to your wishlist!"}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link to="/services">
                        <button className="px-8 py-4 bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold rounded-full hover:from-red-600 hover:to-pink-700 transition-all duration-300 shadow-2xl hover:shadow-red-500/25 hover:scale-105">
                          {t.exploreServices || "Explore Services"}
                        </button>
                      </Link>
                      <Link to="/gallery">
                        <button className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 hover:border-white/50 transition-all duration-300">
                          {t.browseGallery || "Browse Gallery"}
                        </button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  /* Wishlist Grid */
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {wishlistItems.map((item, index) => (
                      <div
                        key={item.title}
                        className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 hover:border-white/40 transition-all duration-500 hover:shadow-2xl"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        {/* Content */}
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-300 transition-colors duration-300">
                                {item.title}
                              </h3>
                              <p className="text-white/70 text-sm leading-relaxed mb-3">
                                {item.description}
                              </p>
                              {item.addedAt && (
                                <p className="text-white/50 text-xs">
                                  Added: {new Date(item.addedAt).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <span className="px-3 py-1 bg-red-500/20 text-red-300 text-xs rounded-full">
                                {item.category || 'Service'}
                              </span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2 relative z-10">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveItem(item.title);
                              }}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors duration-300 relative z-20 cursor-pointer"
                            >
                              <FaTrash className="w-3 h-3" />
                              {t.remove || "Remove"}
                            </button>
                            <Link 
                              to="/services"
                              onClick={(e) => e.stopPropagation()}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors duration-300 relative z-20 cursor-pointer"
                            >
                              <FaEye className="w-3 h-3" />
                              {t.view || "View"}
                            </Link>
                          </div>
                        </div>

                        {/* Gradient Border Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 via-pink-400/20 to-rose-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Call to Action */}
            {wishlistItems.length > 0 ? (
              <section className="py-20 px-8 bg-gradient-to-r from-black/50 to-black/30 backdrop-blur-sm">
                <div className="max-w-4xl mx-auto text-center">
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                    Ready to Book Your Adventures?
                  </h2>
                  <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">
                    Turn your wishlist into unforgettable memories. Contact us to book your perfect Roman experience.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <Link to="/contact">
                      <button className="px-8 py-4 bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold rounded-full hover:from-red-600 hover:to-pink-700 transition-all duration-300 shadow-2xl hover:shadow-red-500/25 hover:scale-105">
                        Contact Us
                      </button>
                    </Link>
                    <Link to="/personal">
                      <button className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 hover:border-white/50 transition-all duration-300">
                        Personal Curator
                      </button>
                    </Link>
                  </div>
                </div>
              </section>
            ) : wishlistItems.length === 0 ? (
              /* Empty State */
              null
            ) : null
            }
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
