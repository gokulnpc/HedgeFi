"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CoinSwap from "@/app/coins/components/CoinSwap";
import { AppLayout } from "@/app/components/app-layout";
import { getTokens } from "@/services/memecoin-launchpad";

// Define the Token interface to match what's returned by getTokens
interface Token {
  token: string;
  name: string;
  creator: string;
  sold: any;
  raised: any;
  isOpen: boolean;
  image: string;
  description: string;
}

export default function QuickSwapPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [marketplaceTokens, setMarketplaceTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status
  useEffect(() => {
    const savedAuth = localStorage.getItem("isAuthenticated");
    setIsAuthenticated(savedAuth === "true");
  }, []);

  // Fetch marketplace tokens
  useEffect(() => {
    const fetchMarketplaceTokens = async () => {
      try {
        setIsLoading(true);
        // Get tokens that are open for sale (isOpen = true)
        const tokens = await getTokens({ isOpen: true });
        setMarketplaceTokens(tokens);
      } catch (error) {
        console.error("Error fetching marketplace tokens:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarketplaceTokens();
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

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <CoinSwap
              symbol="ETH"
              isAuthenticated={isAuthenticated}
              handleTradeAction={handleTradeAction}
              marketplaceTokens={marketplaceTokens}
            />
          )}
        </motion.div>
      </div>
    </AppLayout>
  );
}
