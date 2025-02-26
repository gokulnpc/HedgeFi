"use client";

import { ReactNode, useEffect, useState } from "react";
import { SiteHeader } from "./site-header";
import { SiteLeftbar } from "./site-leftbar";
import { Footer } from "./Footer";
import { motion } from "framer-motion";

interface AppLayoutProps {
  children: ReactNode;
  showFooter?: boolean;
}

export function AppLayout({ children, showFooter = false }: AppLayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const savedAuth = localStorage.getItem("isAuthenticated");
      setIsAuthenticated(savedAuth === "true");
    };

    // Check on initial load
    checkAuth();

    // Listen for storage changes (for cross-tab synchronization)
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  return (
    <div className="relative min-h-screen">
      <SiteHeader />

      <div className="flex">
        {/* Left Sidebar - only shown when authenticated */}
        {isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed top-[64px] left-0 z-10"
          >
            <SiteLeftbar />
          </motion.div>
        )}

        {/* Main Content - adjust padding based on authentication status */}
        <main
          className={`flex-1 pt-20 pb-16 ${
            isAuthenticated ? "pl-[300px]" : ""
          }`}
        >
          {children}
        </main>
      </div>

      {showFooter && <Footer />}
    </div>
  );
}
