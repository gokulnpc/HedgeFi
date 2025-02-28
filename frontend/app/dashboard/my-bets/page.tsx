"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Plus,
  Filter,
  TrendingUp,
  TrendingDown,
  Dices,
  Award,
  BarChart,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppLayout } from "../../components/app-layout";
import { activeBets, pastBets } from "../../bets/data";
import { BetCard } from "../../bets/bet-card";
import { BetFilters } from "../../bets/bet-filters";

// Extend the Bet type to include outcome for statistics
interface Bet {
  id: string;
  title: string;
  image: string;
  category: string;
  endDate: string;
  totalPool: number;
  yesPool: number;
  noPool: number;
  yesProbability: number;
  noProbability: number;
  isResolved?: boolean;
  result?: "yes" | "no";
  outcome?: "won" | "lost";
}

export default function MyBetsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "active" | "resolved"
  >("all");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthWarning, setShowAuthWarning] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();

  // Check authentication status
  useEffect(() => {
    const savedAuth = localStorage.getItem("isAuthenticated");
    setIsAuthenticated(savedAuth === "true");

    // If not authenticated, show warning and redirect after 3 seconds
    if (savedAuth !== "true") {
      setShowAuthWarning(true);
      const timer = setTimeout(() => {
        router.push("/bets");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [router]);

  // Filter bets to only show user's bets (for demo, we'll just show a subset)
  // In a real app, you would filter based on the user's ID
  const myActiveBets = activeBets.slice(0, 4) as Bet[];
  const myPastBets = pastBets.slice(0, 6).map((bet) => ({
    ...bet,
    outcome: Math.random() > 0.5 ? "won" : "lost", // Mock outcome for demo
  })) as Bet[];

  // Calculate bet statistics
  const totalBets = myActiveBets.length + myPastBets.length;
  const wonBets = myPastBets.filter((bet) => bet.outcome === "won").length;
  const lostBets = myPastBets.filter((bet) => bet.outcome === "lost").length;
  const pendingBets = myActiveBets.length;
  const winRate = totalBets > 0 ? Math.round((wonBets / totalBets) * 100) : 0;

  // Calculate total profit/loss (mock data)
  const totalProfit = 125.75; // In NEAR tokens
  const profitTrend = totalProfit >= 0 ? "up" : "down";

  // Filter bets based on search term and category
  const filteredActiveBets = myActiveBets.filter(
    (bet) =>
      (bet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bet.category.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!selectedCategory || bet.category === selectedCategory)
  );

  const filteredPastBets = myPastBets.filter(
    (bet) =>
      (bet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bet.category.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!selectedCategory || bet.category === selectedCategory)
  );

  // Handle filter change
  const handleFilterChange = (filter: "all" | "active" | "resolved") => {
    setActiveFilter(filter);
  };

  if (showAuthWarning) {
    return (
      <AppLayout>
        <div className="container max-w-4xl mx-auto px-4 pt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 p-6 rounded-md"
          >
            <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
            <p>
              You need to be signed in to view your bets. Redirecting to the
              bets page...
            </p>
          </motion.div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold">
                My{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
                  Bets
                </span>
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage and track your prediction market bets
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search your bets..."
                  className="pl-8 w-[200px] md:w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? "bg-white/10" : ""}
              >
                <Filter className="h-4 w-4" />
              </Button>
              <Button asChild>
                <Link href="/bets/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Bet
                </Link>
              </Button>
            </div>
          </div>

          {/* Betting Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Bets Card */}
              <Card className="border-white/10 bg-black/50 backdrop-blur-xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Bets
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Dices className="h-8 w-8 mr-3 text-blue-400" />
                      <div>
                        <div className="text-2xl font-bold">{totalBets}</div>
                        <p className="text-xs text-muted-foreground">
                          {pendingBets} active, {myPastBets.length} completed
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Win Rate Card */}
              <Card className="border-white/10 bg-black/50 backdrop-blur-xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Win Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Award className="h-8 w-8 mr-3 text-green-400" />
                      <div>
                        <div className="text-2xl font-bold">{winRate}%</div>
                        <p className="text-xs text-muted-foreground">
                          {wonBets} won, {lostBets} lost
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Total Profit Card */}
              <Card className="border-white/10 bg-black/50 backdrop-blur-xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Profit
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {profitTrend === "up" ? (
                        <TrendingUp className="h-8 w-8 mr-3 text-green-400" />
                      ) : (
                        <TrendingDown className="h-8 w-8 mr-3 text-red-400" />
                      )}
                      <div>
                        <div className="text-2xl font-bold">
                          {totalProfit > 0 ? "+" : ""}
                          {totalProfit.toFixed(2)} NEAR
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Lifetime profit/loss
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Biggest Win Card */}
              <Card className="border-white/10 bg-black/50 backdrop-blur-xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Biggest Win
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <BarChart className="h-8 w-8 mr-3 text-blue-400" />
                      <div>
                        <div className="text-2xl font-bold">+45.20 NEAR</div>
                        <p className="text-xs text-muted-foreground">
                          From "BTC to 100K" bet
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <Card className="border-white/10 bg-black/50 backdrop-blur-xl">
                <CardContent className="pt-6">
                  <BetFilters
                    activeFilter={activeFilter}
                    selectedCategory={selectedCategory}
                    onFilterChange={handleFilterChange}
                    onCategoryChange={setSelectedCategory}
                  />
                </CardContent>
              </Card>
            </motion.div>
          )}

          <Tabs defaultValue="active" className="mb-8">
            <TabsList>
              <TabsTrigger value="active">Active Bets</TabsTrigger>
              <TabsTrigger value="past">Past Bets</TabsTrigger>
              <TabsTrigger value="created">Created by Me</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="mt-6">
              {filteredActiveBets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredActiveBets.map((bet) => (
                    <BetCard key={bet.id} bet={bet} />
                  ))}
                </div>
              ) : (
                <Card className="border-white/10 bg-black/50 backdrop-blur-xl">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Dices className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium mb-2">
                      No active bets found
                    </h3>
                    <p className="text-muted-foreground text-center max-w-md mb-6">
                      You don't have any active bets matching your search
                      criteria. Try clearing your filters or create a new bet.
                    </p>
                    <Button asChild>
                      <Link href="/bets">Browse Prediction Markets</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="past" className="mt-6">
              {filteredPastBets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredPastBets.map((bet) => (
                    <BetCard key={bet.id} bet={bet} />
                  ))}
                </div>
              ) : (
                <Card className="border-white/10 bg-black/50 backdrop-blur-xl">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Dices className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium mb-2">
                      No past bets found
                    </h3>
                    <p className="text-muted-foreground text-center max-w-md mb-6">
                      You don't have any past bets matching your search
                      criteria. Try clearing your filters or participate in some
                      prediction markets.
                    </p>
                    <Button asChild>
                      <Link href="/bets">Browse Prediction Markets</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="created" className="mt-6">
              <Card className="border-white/10 bg-black/50 backdrop-blur-xl">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Dices className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">
                    No created bets yet
                  </h3>
                  <p className="text-muted-foreground text-center max-w-md mb-6">
                    You haven't created any prediction markets yet. Create your
                    first prediction market and let others bet on the outcome.
                  </p>
                  <Button asChild>
                    <Link href="/bets/create">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Prediction Market
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </AppLayout>
  );
}
