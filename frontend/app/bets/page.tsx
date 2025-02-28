"use client";

import { motion } from "framer-motion";
import { AppLayout } from "../components/app-layout";
import { Input } from "@/components/ui/input";
import { Search, Rocket } from "lucide-react";
import GridBackground from "../components/GridBackground";
import { useState } from "react";
import { LeaderboardCard } from "./leaderboard-card";
import { BetFilters } from "./bet-filters";
import { activeBets, pastBets } from "./data";
import { BetSection } from "./bet-section";
import { PastBetsSlider } from "./past-bets-slider";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function BetsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeCurrentPage, setActiveCurrentPage] = useState(1);

  // Filter bets based on search term and category
  const filteredActiveBets = activeBets.filter(
    (bet) =>
      (bet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bet.category.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!selectedCategory || bet.category === selectedCategory)
  );

  const filteredPastBets = pastBets.filter(
    (bet) =>
      (bet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bet.category.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!selectedCategory || bet.category === selectedCategory)
  );

  return (
    <AppLayout showFooter={false}>
      <GridBackground />
      <div className="py-8">
        <div className="container max-w-[1600px] mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
                  Prediction Bets
                </h1>
                <p className="text-muted-foreground">
                  Place your bets and challenge others on future events
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Button className="bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-400/90 hover:to-blue-500/90">
                  <Rocket className="mr-2 h-4 w-4" />
                  Create Prediction
                </Button>
                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
                  <div className="text-sm">
                    <span className="text-gray-400">Total Volume:</span>{" "}
                    <span className="font-mono font-medium text-white">
                      $1,234,567
                    </span>
                  </div>
                  <div className="w-px h-4 bg-white/10" />
                  <div className="text-sm">
                    <span className="text-gray-400">Active Bets:</span>{" "}
                    <span className="font-mono font-medium text-white">
                      {activeBets.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search bets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12"
              />
            </div>
            <BetFilters
              activeFilter="all"
              selectedCategory={selectedCategory}
              onFilterChange={() => {}}
              onCategoryChange={setSelectedCategory}
            />
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-12 gap-6">
            {/* Bets Sections */}
            <div className="col-span-12 lg:col-span-9 space-y-12">
              <BetSection
                title="Active Bets"
                bets={filteredActiveBets}
                currentPage={activeCurrentPage}
                onPageChange={setActiveCurrentPage}
                itemsPerPage={6}
                showViewAll={true}
              />

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">Past Bets</h2>
                  <Link
                    href="/bets/history"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    View All Past Bets
                  </Link>
                </div>
                <div className="overflow-hidden rounded-xl border border-white/10">
                  <PastBetsSlider bets={filteredPastBets} />
                </div>
              </div>
            </div>

            {/* Leaderboards */}
            <div className="col-span-12 lg:col-span-3 space-y-6">
              <LeaderboardCard
                title="Top Bettors"
                entries={[
                  { address: "0x1234...5678", amount: 1000, rank: 1 },
                  { address: "0x8765...4321", amount: 750, rank: 2 },
                  { address: "0x9876...5432", amount: 500, rank: 3 },
                  { address: "0x5432...1098", amount: 250, rank: 4 },
                  { address: "0x1098...7654", amount: 100, rank: 5 },
                ]}
              />
              <LeaderboardCard
                title="Recent Winners"
                entries={[
                  { address: "0xabcd...efgh", amount: 2500, rank: 1 },
                  { address: "0xijkl...mnop", amount: 1500, rank: 2 },
                  { address: "0xqrst...uvwx", amount: 1000, rank: 3 },
                  { address: "0xyzab...cdef", amount: 750, rank: 4 },
                  { address: "0xghij...klmn", amount: 500, rank: 5 },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
