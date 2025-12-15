import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "../hooks/useTranslation";

export default function TopNav({ active = "" }) {
  const { t } = useTranslation();
  const linkClass = (name, extra = "") =>
    `relative group transition-all duration-300 font-bold tracking-wide overflow-hidden ${
      active === name ? "text-amber-400" : "text-white/90"
    } ${extra}`;

  return (
    <header className="fixed top-0 left-0 right-0 w-full bg-black/95 backdrop-blur-xl text-white z-50 border-b border-gradient-to-r from-amber-500/30 via-emerald-500/30 to-blue-500/30 shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-emerald-500/5 to-blue-500/5" />
      <div className="max-w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-12 grid grid-cols-3 items-center py-3 sm:py-4 relative z-10">
        
        {/* Left links */}
        <div className="hidden md:flex items-center justify-end space-x-6 lg:space-x-12 xl:space-x-16">
          {[
            { name: "about", label: t.aboutUsMenu, to: "/about" },
            { name: "services", label: t.ourServicesMenu, to: "/services" },

          ].map((link) => (
            <Link key={link.name} to={link.to} className={linkClass(link.name, "text-xs lg:text-sm")}>
              <span className="relative z-10">{link.label}</span>

              {/* Creative Hover Effect */}
              <span className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
              <span className="absolute -inset-3 bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></span>
            </Link>
          ))}
        </div>

        {/* Center logo - match footer style */}
        <div className="flex justify-center px-2">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-400 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
            <Link to="/" className="relative block">
              <img
                src="/logo.png"
                alt="My Guide in Rome"
                className="h-10 sm:h-12 md:h-16 lg:h-20 w-auto relative z-10 transform group-hover:scale-110 transition-transform duration-500 cursor-pointer"
              />
            </Link>
          </div>
        </div>
        
        {/* Right links */}
        <nav className="hidden md:flex justify-start space-x-6 lg:space-x-12 xl:space-x-16 text-xs lg:text-sm font-medium">
          {[
            { name: "personal", label: t.personalCuratorMenu, to: "/personal" },
            { name: "contact", label: t.contactUsMenu, to: "/contact" },
          ].map((link) => (
            <Link key={link.name} to={link.to} className={linkClass(link.name)}>
              <span className="relative z-10">{link.label}</span>

              {/* Creative Hover Effect */}
              <span className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
              <span className="absolute -inset-3 bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
