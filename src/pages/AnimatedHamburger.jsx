// src/components/AnimatedHamburger.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";

export default function AnimatedHamburger({ toggleMenu }) {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
    if (toggleMenu) toggleMenu(); // notify parent to open/close menu
  };

  return (
    <button
      onClick={handleClick}
      className="relative w-10 h-10 flex flex-col justify-around items-center z-50"
    >
      <motion.span
        animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.3 }}
        className="block w-8 h-[3px] bg-white rounded"
      />
      <motion.span
        animate={open ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="block w-8 h-[3px] bg-white rounded"
      />
      <motion.span
        animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.3 }}
        className="block w-8 h-[3px] bg-white rounded"
      />
    </button>
  );
}
