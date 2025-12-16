import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../api';

export const useWishlist = () => {
  const { isAuthenticated, user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load wishlist on component mount
  useEffect(() => {
    if (isAuthenticated) {
      loadWishlist();
    } else {
      // Clear wishlist for non-authenticated users
      setWishlist([]);
    }
  }, [isAuthenticated]);

  const loadWishlist = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const response = await userAPI.getWishlist();
      console.log('useWishlist: Raw API response:', response);
      if (response.data.success) {
        console.log('useWishlist: Setting wishlist data:', response.data.data.wishlist);
        console.log('useWishlist: Wishlist length:', response.data.data.wishlist.length);
        console.log('useWishlist: Wishlist items:', response.data.data.wishlist);
        setWishlist(response.data.data.wishlist);
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (item, onLoginRequired) => {
    try {
      setLoading(true);
      
      if (isAuthenticated) {
        // Add to backend for authenticated users
        const response = await userAPI.addToWishlist(item.title);
        if (response.data.success) {
          setWishlist(response.data.data.wishlist);
          return { success: true, message: `${item.title} added to wishlist!` };
        }
      } else {
        // Require login for wishlist functionality
        if (onLoginRequired) {
          onLoginRequired();
        }
        return { success: false, message: 'Please login to add items to wishlist', requiresLogin: true };
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return { success: false, message: 'Failed to add to wishlist' };
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (itemTitle, onLoginRequired) => {
    try {
      setLoading(true);
      console.log('Removing item from wishlist:', itemTitle, 'isAuthenticated:', isAuthenticated);
      
      if (isAuthenticated) {
        // Remove from backend for authenticated users
        try {
          const response = await userAPI.removeFromWishlist(itemTitle);
          if (response.data.success) {
            setWishlist(response.data.data.wishlist);
            return { success: true, message: 'Item removed from wishlist!' };
          } else {
            return { success: false, message: response.data.message || 'Failed to remove from wishlist' };
          }
        } catch (apiError) {
          console.error('Backend API error:', apiError);
          return { success: false, message: 'Failed to remove from wishlist' };
        }
      } else {
        // Require login for wishlist functionality
        if (onLoginRequired) {
          onLoginRequired();
        }
        return { success: false, message: 'Please login to manage your wishlist', requiresLogin: true };
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return { success: false, message: 'Failed to remove from wishlist' };
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (itemTitle) => {
    if (isAuthenticated) {
      return wishlist.includes(itemTitle);
    } else {
      return false; // Not in wishlist if not authenticated
    }
  };

  const clearWishlist = async () => {
    try {
      setLoading(true);
      
      if (isAuthenticated) {
        // Clear backend wishlist for authenticated users
        for (const item of wishlist) {
          await userAPI.removeFromWishlist(item);
        }
        setWishlist([]);
        return { success: true, message: 'Wishlist cleared!' };
      } else {
        return { success: false, message: 'Please login to manage your wishlist' };
      }
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      return { success: false, message: 'Failed to clear wishlist' };
    } finally {
      setLoading(false);
    }
  };

  const getWishlistCount = () => {
    return wishlist.length;
  };

  return {
    wishlist,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    getWishlistCount,
    loadWishlist
  };
};
