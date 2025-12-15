// Sidebar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setOpen(true)}
        className="absolute top-6 left-6 z-20 text-white focus:outline-none"
        aria-label="Open menu"
      >
        <div
          className={`w-8 h-1 bg-white mb-1 transition-all duration-300 ${
            open ? "rotate-45 translate-y-2" : ""
          }`}
        ></div>
        <div
          className={`w-8 h-1 bg-white mb-1 transition-all duration-300 ${
            open ? "opacity-0" : ""
          }`}
        ></div>
        <div
          className={`w-8 h-1 bg-white transition-all duration-300 ${
            open ? "-rotate-45 -translate-y-2" : ""
          }`}
        ></div>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-black bg-opacity-95 text-white transform transition-transform duration-300 z-30 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute top-6 right-6 text-2xl text-white hover:text-[#c96451]"
          aria-label="Close menu"
        >
          ✕
        </button>

        {/* Nav Links */}
        <nav className="mt-24 flex flex-col space-y-8 text-lg px-8">
          {["Home", "Famiglia", "Tenute", "Vini", "Esperienze"].map(
            (item, i) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                onClick={() => setOpen(false)}
                className={`opacity-0 transform -translate-x-6 transition-all duration-500 delay-${i * 150} ${
                  open ? "opacity-100 translate-x-0" : ""
                }`}
              >
                {item}
              </Link>
            )
          )}
        </nav>
      </div>
    </>
  );
}

export default Sidebar;
