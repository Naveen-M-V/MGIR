import React from "react";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden">
      {/* Animated floating particles */}
      <div className="absolute inset-0 -z-10 opacity-40">
        <div className="animate-pulse absolute top-10 left-16 w-2 h-2 bg-pink-400 rounded-full blur-sm" />
        <div className="animate-bounce absolute bottom-12 right-20 w-3 h-3 bg-purple-400 rounded-full blur-sm" />
        <div className="animate-ping absolute top-1/2 left-1/3 w-2 h-2 bg-blue-400 rounded-full" />
      </div>

      {/* Glass Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="w-full backdrop-blur-md bg-black/60 border-t border-white/10 relative"
      >
        {/* Animated top glow line */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 animate-gradient-x" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col items-center justify-center text-center space-y-5">

            {/* Logo */}
            <motion.img
              src="/logo.png"
              alt="MGIR Logo"
              className="h-14 drop-shadow-lg"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              whileHover={{ scale: 1.1, rotate: 2 }}
            />

            {/* Address */}
            <motion.div
              className="flex items-start gap-3 text-white/80"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <svg
                className="w-6 h-6 mt-1 text-pink-400 flex-shrink-0 animate-pulse"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <div className="flex flex-col text-sm leading-5">
                <p>Via dei Castani 178, 00100</p>
                <p>Rome, Italy</p>
              </div>
            </motion.div>

            {/* Animated Social Icons */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="flex gap-6 mt-2"
            >
              {["facebook", "twitter", "instagram"].map((icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  className="text-white/70 hover:text-white transition-colors"
                  whileHover={{ scale: 1.3, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <i className={`ri-${icon}-fill text-xl`} />
                </motion.a>
              ))}
            </motion.div>

            {/* Copyright */}
            <div className="mt-4 text-xs text-white/60">
              © {new Date().getFullYear()} MGIR. All rights reserved.
            </div>
          </div>
        </div>
      </motion.div>

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
    </footer>
  );
}
