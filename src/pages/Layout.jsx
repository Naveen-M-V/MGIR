import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Footer from "../components/ui/footer";
import FloatingSocial from "../components/FloatingSocial";

export default function Layout({ children }) {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <FloatingSocial />
    </div>
  );
}
