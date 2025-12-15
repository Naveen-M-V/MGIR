import React, { useState } from 'react';
import { FaHeart, FaHeartBroken } from 'react-icons/fa';
import { useWishlist } from '../hooks/useWishlist';
import { useAuth } from '../context/AuthContext';

export default function WishlistButton({ 
  item, 
  className = "", 
  size = "md",
  showText = true,
  variant = "default",
  onLoginRequired 
}) {
  const { isAuthenticated } = useAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist, loading } = useWishlist();
  const [isProcessing, setIsProcessing] = useState(false);

  const isItemInWishlist = isInWishlist(item.title);

  const handleWishlistToggle = async (e) => {
    e.stopPropagation(); // Prevent parent click events
    
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      let result;
      if (isItemInWishlist) {
        result = await removeFromWishlist(item.title, onLoginRequired);
      } else {
        result = await addToWishlist(item, onLoginRequired);
      }
      
      if (result.success) {
        // Show success message
        const toast = document.createElement('div');
        toast.className = `fixed top-20 right-5 z-50 px-4 py-2 rounded-lg text-white font-medium transition-all duration-300 ${
          isItemInWishlist ? 'bg-red-500' : 'bg-green-500'
        }`;
        toast.textContent = result.message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
          toast.style.opacity = '0';
          setTimeout(() => document.body.removeChild(toast), 300);
        }, 2000);
      } else if (result.requiresLogin) {
        // Login required - the callback should have been triggered
        // Don't show error message as login modal should be opening
      } else {
        alert(`❌ ${result.message}`);
      }
    } catch (error) {
      console.error('Wishlist error:', error);
      alert('❌ Failed to update wishlist');
    } finally {
      setIsProcessing(false);
    }
  };

  // Size variants
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base", 
    lg: "w-12 h-12 text-lg"
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  };

  // Variant styles
  const variantClasses = {
    default: `bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white`,
    solid: `${isItemInWishlist ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-500 hover:bg-gray-600'} text-white`,
    minimal: `bg-transparent hover:bg-white/10 text-white`,
    card: `bg-white/5 hover:bg-white/15 border border-white/10 hover:border-red-400/50 text-white`
  };

  return (
    <button
      onClick={handleWishlistToggle}
      disabled={isProcessing || loading}
      className={`
        group relative flex items-center justify-center gap-2 rounded-full
        backdrop-blur-md transition-all duration-300 hover:scale-105 z-20
        ${sizeClasses[size]} ${variantClasses[variant]} ${className}
        ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
        ${isItemInWishlist ? 'shadow-lg shadow-red-500/25' : ''}
      `}
      title={isItemInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      {/* Heart Icon with Animation */}
      <div className="relative">
        {isProcessing ? (
          <div className="animate-spin rounded-full border-2 border-white border-t-transparent w-4 h-4" />
        ) : (
          <>
            <FaHeart 
              className={`
                ${iconSizes[size]} transition-all duration-300
                ${isItemInWishlist 
                  ? 'text-red-400 scale-110 drop-shadow-lg' 
                  : 'text-white/60 group-hover:text-red-400 group-hover:scale-110'
                }
              `}
            />
            
            {/* Pulse effect when in wishlist */}
            {isItemInWishlist && (
              <div className="absolute inset-0 animate-ping">
                <FaHeart className={`${iconSizes[size]} text-red-400 opacity-75`} />
              </div>
            )}
          </>
        )}
      </div>

      {/* Optional Text */}
      {showText && (
        <span className="text-xs font-medium">
          {isItemInWishlist ? 'Saved' : 'Save'}
        </span>
      )} 

      {/* Glow effect when in wishlist */}
      {isItemInWishlist && (
        <div className="absolute inset-0 bg-red-400/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
    </button>
  );
}
