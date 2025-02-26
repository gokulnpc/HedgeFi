"use client";

import { MemeCoinMarketCap } from "@/app/components/MemeCoinMarketCap";
import { motion } from "framer-motion";
import { SiteHeader } from "../components/site-header";
import GridBackground from "../components/GridBackground";

export default function WatchlistPage() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <GridBackground />
      <SiteHeader />
      <main className="flex-1 pt-24">
        <div className="container max-w-7xl mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold mb-2 mt-6">
              Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
                Watchlist
              </span>
            </h1>
          </motion.div>

          <MemeCoinMarketCap watchlistOnly={true} />
        </div>
      </main>
    </div>
  );
}
