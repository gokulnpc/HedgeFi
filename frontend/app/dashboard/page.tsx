"use client";

import { motion } from "framer-motion";
import { AppLayout } from "../components/app-layout";
import { PortfolioOverview } from "./portfolio/components/portfolio-overview";
import { PortfolioChart } from "./portfolio/components/portfolio-chart";
import { PortfolioAnalytics } from "./portfolio/components/portfolio-analytics";
import { BetsSection } from "./components/bets-section";
import { LaunchedTokens } from "./components/launched-tokens";
import { MemeNews } from "./components/meme-news";
import { AboutMemes } from "./components/about-memes";

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="px-4 pr-[400px]">
        <h1 className="text-4xl font-bold mb-8 max-w-5xl mx-auto mt-6">
          Portfolio{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
            Snapshot
          </span>
        </h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 max-w-5xl mx-auto"
        >
          {/* Portfolio Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <PortfolioOverview />
          </motion.div>

          {/* Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <PortfolioChart />
          </motion.div>

          {/* Portfolio Analytics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-8"
          >
            <PortfolioAnalytics />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <BetsSection />
            <LaunchedTokens />
          </div>
        </motion.div>
      </div>

      {/* Fixed Right Sidebar */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="fixed top-[64px] right-0 w-[380px] h-[calc(100vh-64px)] overflow-y-auto bg-gray-900/50 backdrop-blur-sm border-l border-green-500/10"
      >
        <div className="p-4 space-y-6">
          <MemeNews />
          <AboutMemes />
        </div>
      </motion.div>
    </AppLayout>
  );
}
