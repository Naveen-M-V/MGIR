import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaHeart, FaCog, FaHistory, FaSignOutAlt, FaChevronDown } from 'react-icons/fa';

export default function MyAccountDropdown() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
      alert('✅ Logged out successfully!');
    } catch (error) {
      console.error('Logout error:', error);
      alert('❌ Error logging out');
    }
  };

  const menuItems = [];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Account Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-2xl hover:shadow-emerald-500/25 hover:scale-105"
      >
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
          <FaUser className="w-4 h-4" />
        </div>
        <div className="flex flex-col items-start">
          <span className="text-sm font-semibold">My Account</span>
          <span className="text-xs opacity-80">{user?.fullName || user?.username}</span>
        </div>
        <FaChevronDown 
          className={`w-3 h-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden z-50 animate-fadeIn">
          {/* User Info Header */}
          <div className="px-6 py-4 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {user?.fullName?.charAt(0) || user?.username?.charAt(0) || 'U'}
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">{user?.fullName || 'User'}</h3>
                <p className="text-white/70 text-sm">{user?.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-300 text-xs">Online</span>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-4 px-6 py-3 text-white hover:bg-white/10 transition-colors duration-200 group"
              >
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors duration-200">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{item.label}</div>
                  <div className="text-white/60 text-xs">{item.description}</div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>

          {/* Logout Button */}
          <div className="border-t border-white/10 p-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-6 py-3 text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-colors duration-200 rounded-lg group"
            >
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center group-hover:bg-red-500/30 transition-colors duration-200">
                <FaSignOutAlt className="w-4 h-4" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-sm">Sign Out</div>
                <div className="text-white/60 text-xs">Logout from your account</div>
              </div>
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
