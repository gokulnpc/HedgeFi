"use client";

import { motion } from "framer-motion";
import { SiteHeader } from "../components/site-header";
import { Footer } from "../components/Footer";
import { Input } from "@/components/ui/input";
import { Search, Rocket, Plus, Trophy } from "lucide-react";
import GridBackground from "../components/GridBackground";
import { useState, useEffect } from "react";
import { LeaderboardCard } from "./leaderboard-card";
import { BetFilters } from "./bet-filters";
import { activeBets, pastBets } from "./data";
import { BetSection } from "./bet-section";
import { PastBetsSlider } from "./past-bets-slider";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { AppLayout } from "../components/app-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function BetsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeCurrentPage, setActiveCurrentPage] = useState(1);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthWarning, setShowAuthWarning] = useState(false);
  const router = useRouter();

  // Check authentication status
  useEffect(() => {
    const savedAuth = localStorage.getItem("isAuthenticated");
    setIsAuthenticated(savedAuth === "true");
  }, []);

  // Handle create prediction click
  const handleCreatePrediction = () => {
    if (!isAuthenticated) {
      setShowAuthWarning(true);
      setTimeout(() => setShowAuthWarning(false), 3000);
      return;
    }

    // Navigate to create prediction page
    router.push("/bets/create");
  };

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
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container py-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-bold">
                Prediction{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
                  Markets
                </span>
              </h1>
              <p className="text-muted-foreground mt-2">
                Bet on the future of meme coins and crypto events
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search predictions..."
                  className="pl-8 w-[200px] md:w-[300px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {isAuthenticated ? (
                <Button asChild>
                  <Link href="/bets/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Prediction
                  </Link>
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setShowAuthWarning(true);
                    setTimeout(() => setShowAuthWarning(false), 3000);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Prediction
                </Button>
              )}
            </div>
          </div>

          {showAuthWarning && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 p-3 rounded-md mb-6"
            >
              Please sign in to create a prediction
            </motion.div>
          )}

          <Tabs defaultValue="active" className="mb-8">
            <TabsList>
              <TabsTrigger value="active">Active Bets</TabsTrigger>
              <TabsTrigger value="past">Past Bets</TabsTrigger>
              <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            </TabsList>
            <TabsContent value="active" className="mt-6">
              <BetSection
                title="Active Bets"
                bets={filteredActiveBets}
                currentPage={activeCurrentPage}
                onPageChange={setActiveCurrentPage}
                itemsPerPage={6}
                showViewAll={true}
              />
            </TabsContent>
            <TabsContent value="past" className="mt-6">
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
            </TabsContent>
            <TabsContent value="leaderboard" className="mt-6">
              <div className="grid grid-cols-12 gap-6">
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
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </AppLayout>
  );
}
