"use client";

import { motion } from "framer-motion";
import { SiteHeader } from "../components/site-header";
import { Footer } from "../components/Footer";
import { MemeCoinMarketCap } from "../components/MemeCoinMarketCap";
import GridBackground from "../components/GridBackground";

export default function MarketcapPage(): JSX.Element {
  return (
    <div className="relative flex min-h-screen flex-col">
      <GridBackground />
      <SiteHeader />
      <main className="flex-1 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container"
        >
          <div className="flex flex-col gap-4 text-center mb-8">
            <h2 className="text-3xl text-center font-bold leading-[1.1] sm:text-3xl md:text-5xl mb-10tracking-tight">
              Today's Meme Coin{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
                Prices by Market Cap
              </span>
            </h2>
            <p className="text-muted-foreground">
              Track and analyze the latest meme coins across multiple chains
            </p>
          </div>
        </motion.div>
        <MemeCoinMarketCap />
      </main>
      <Footer />
    </div>
  );
}
