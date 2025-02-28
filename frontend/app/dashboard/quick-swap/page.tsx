"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CoinSwap from "@/app/coins/components/CoinSwap";
import { AppLayout } from "@/app/components/app-layout";

export default function QuickSwapPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status
  useEffect(() => {
    const savedAuth = localStorage.getItem("isAuthenticated");
    setIsAuthenticated(savedAuth === "true");
  }, []);

  const handleTradeAction = () => {
    // This function would handle trade actions
    console.log("Trade action triggered");
  };

  return (
    <AppLayout>
      <div className="container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-center">
              Quick <span className="text-blue-500">Swap</span>
            </h1>
          </div>

          <CoinSwap
            symbol="DOGE"
            isAuthenticated={isAuthenticated}
            handleTradeAction={handleTradeAction}
          />
        </motion.div>
      </div>
    </AppLayout>
  );
}
