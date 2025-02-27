"use client";
// Test comment to check Git tracking

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowUp,
  Sprout,
  TrendingUp,
  Eye,
  Star,
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { SparklineChart } from "./SparklineChart";
import type { Chain, FilterOption } from "./types";
import { MarketFilters } from "./MarketFilters";
import { useRouter } from "next/navigation";
import { trendingCoins, type Coin } from "@/app/data/mockCoins";

const chains: Chain[] = [
  {
    id: "ethereum",
    name: "Ethereum",
    logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
  },
  {
    id: "bsc",
    name: "BSC",
    logo: "https://cryptologos.cc/logos/bnb-bnb-logo.png",
  },
  {
    id: "solana",
    name: "Solana",
    logo: "https://cryptologos.cc/logos/solana-sol-logo.png",
  },
  {
    id: "polygon",
    name: "Polygon",
    logo: "https://cryptologos.cc/logos/polygon-matic-logo.png",
  },
  {
    id: "avalanche",
    name: "Avalanche",
    logo: "https://cryptologos.cc/logos/avalanche-avax-logo.png",
  },
  {
    id: "cardano",
    name: "Cardano",
    logo: "https://cryptologos.cc/logos/cardano-ada-logo.png",
  },
  {
    id: "optimism",
    name: "Optimism",
    logo: "https://cryptologos.cc/logos/optimism-ethereum-op-logo.png",
  },
  {
    id: "tron",
    name: "TRON",
    logo: "https://cryptologos.cc/logos/tron-trx-logo.png",
  },
  {
    id: "arbitrum",
    name: "Arbitrum",
    logo: "https://cryptologos.cc/logos/arbitrum-arb-logo.png",
  },
  {
    id: "ton",
    name: "TON",
    logo: "https://cryptologos.cc/logos/ton-ton-logo.png",
  },
];

const filterOptions: FilterOption[] = [
  { id: "new", label: "New", icon: Sprout },
  { id: "gainers", label: "Gainers", icon: TrendingUp },
  { id: "visited", label: "Most Visited", icon: Eye },
];

// Helper functions for watchlist management
const WATCHLIST_STORAGE_KEY = "hedgefi_watchlist";

const getWatchlistFromStorage = (): string[] => {
  if (typeof window === "undefined") return [];

  try {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (!isAuthenticated) {
      return []; // Return empty array if not authenticated
    }

    const saved = localStorage.getItem(WATCHLIST_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Failed to load watchlist from storage:", error);
    return [];
  }
};

const saveWatchlistToStorage = (watchlist: string[]) => {
  if (typeof window === "undefined") return;

  try {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (!isAuthenticated) {
      return; // Don't save if not authenticated
    }

    localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(watchlist));
  } catch (error) {
    console.error("Failed to save watchlist to storage:", error);
  }
};

interface MemeCoinMarketCapProps {
  watchlistOnly?: boolean;
}

export function MemeCoinMarketCap({
  watchlistOnly = false,
}: MemeCoinMarketCapProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [activeFilter, setActiveFilter] = useState<
    "latest" | "trending" | "new" | "gainers" | "visited"
  >("new");
  const [selectedChain, setSelectedChain] = useState<Chain | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const itemsPerPage = 5;

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const loadWatchlist = () => {
      const savedWatchlist = getWatchlistFromStorage();
      setFavorites(savedWatchlist);
      setIsLoaded(true);
    };

    loadWatchlist();

    // Add event listener to sync watchlist across tabs/windows
    window.addEventListener("storage", (event) => {
      if (event.key === WATCHLIST_STORAGE_KEY) {
        const newWatchlist = event.newValue ? JSON.parse(event.newValue) : [];
        setFavorites(newWatchlist);
      }
    });

    return () => {
      window.removeEventListener("storage", () => {});
    };
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      saveWatchlistToStorage(favorites);
    }
  }, [favorites, isLoaded]);

  const handleFavoriteToggle = (coinId: string) => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

    if (!isAuthenticated) {
      // Show inline login warning instead of alert
      const warningElement = document.createElement("div");
      warningElement.className =
        "fixed bottom-4 right-4 bg-yellow-500/90 text-black p-4 rounded-lg shadow-lg z-50 flex items-center gap-2";
      warningElement.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
        <span>Please log in to add tokens to your watchlist</span>
      `;
      document.body.appendChild(warningElement);

      // Remove the warning after 3 seconds
      setTimeout(() => {
        warningElement.classList.add(
          "opacity-0",
          "transition-opacity",
          "duration-300"
        );
        setTimeout(() => {
          document.body.removeChild(warningElement);
        }, 300);
      }, 3000);

      return;
    }

    setFavorites((prev) => {
      const newFavorites = prev.includes(coinId)
        ? prev.filter((id) => id !== coinId)
        : [...prev, coinId];

      // Immediately save to localStorage to ensure consistency
      saveWatchlistToStorage(newFavorites);
      return newFavorites;
    });
  };

  // Filter and sort coins based on active filter and watchlist setting
  const filteredCoins = useMemo(() => {
    let filtered = [...trendingCoins];

    // Filter by favorites if watchlistOnly is true
    if (watchlistOnly) {
      filtered = filtered.filter((coin) => favorites.includes(coin.id));
    }

    // Filter by chain if selected
    if (selectedChain) {
      // This is a placeholder - in a real app, you'd filter by chain
      // filtered = filtered.filter(coin => coin.chain === selectedChain.id)
    }

    // Sort based on active filter
    switch (activeFilter) {
      case "latest":
      case "new":
        filtered = filtered.sort((a, b) => b.marketCap - a.marketCap);
        break;
      case "trending":
      case "gainers":
        filtered = filtered.sort((a, b) => b.change24h - a.change24h);
        break;
      case "visited":
        filtered = filtered.sort((a, b) => b.volume24h - a.volume24h);
        break;
    }

    return filtered;
  }, [activeFilter, selectedChain, favorites, watchlistOnly]);

  const totalPages = Math.ceil(filteredCoins.length / itemsPerPage);

  const getCurrentPageItems = () => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredCoins.slice(start, end);
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, selectedChain, watchlistOnly, favorites]);

  const handleCoinClick = (coinId: string) => {
    router.push(`/coins/${coinId}`);
  };

  return (
    <section className="container py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <MarketFilters
          chains={chains}
          filterOptions={filterOptions}
          selectedChain={selectedChain}
          activeFilter={activeFilter}
          onChainSelect={setSelectedChain}
          onFilterSelect={setActiveFilter}
        />

        {/* Table section */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-4 px-4"></th>
                <th className="text-left py-4 px-4">#</th>
                <th className="text-left py-4 px-4">Name</th>
                <th className="text-right py-4 px-4">Price</th>
                <th className="text-right py-4 px-4">1h %</th>
                <th className="text-right py-4 px-4">24h %</th>
                <th className="text-right py-4 px-4">7d %</th>
                <th className="text-right py-4 px-4">Market Cap</th>
                <th className="text-right py-4 px-4">Volume(24h)</th>
                <th className="text-right py-4 px-4">Circulating Supply</th>
                <th className="text-right py-4 px-4">Last 7 Days</th>
              </tr>
            </thead>
            <tbody>
              {getCurrentPageItems().length > 0 ? (
                getCurrentPageItems().map((coin, index) => (
                  <tr
                    key={coin.id}
                    className="border-b border-gray-800 hover:bg-gray-900/50 cursor-pointer transition-colors duration-200 hover:shadow-lg"
                    onClick={() => handleCoinClick(coin.id)}
                  >
                    <td className="py-4 px-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFavoriteToggle(coin.id);
                        }}
                      >
                        <Star
                          className={`h-4 w-4 ${
                            favorites.includes(coin.id)
                              ? "text-yellow-500 fill-yellow-500"
                              : ""
                          }`}
                        />
                      </Button>
                    </td>
                    <td className="py-4 px-4 text-gray-400">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                          <img
                            src={coin.logo}
                            alt={`${coin.name} logo`}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              // Fallback if image fails to load
                              (e.target as HTMLImageElement).src =
                                "https://placehold.co/32x32?text=?";
                            }}
                          />
                        </div>
                        <div>
                          <span className="font-semibold">{coin.name}</span>
                          <span className="text-gray-400 text-sm block">
                            {coin.symbol}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="text-right py-4 px-4">
                      ${coin.price.toFixed(8)}
                    </td>
                    <td
                      className={`text-right py-4 px-4 ${
                        coin.change1h > 0 ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {coin.change1h > 0 ? (
                        <ArrowUp className="inline h-4 w-4" />
                      ) : (
                        <ArrowDown className="inline h-4 w-4" />
                      )}
                      {Math.abs(coin.change1h)}%
                    </td>
                    <td
                      className={`text-right py-4 px-4 ${
                        coin.change24h > 0 ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {coin.change24h > 0 ? (
                        <ArrowUp className="inline h-4 w-4" />
                      ) : (
                        <ArrowDown className="inline h-4 w-4" />
                      )}
                      {Math.abs(coin.change24h)}%
                    </td>
                    <td
                      className={`text-right py-4 px-4 ${
                        coin.change7d > 0 ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {coin.change7d > 0 ? (
                        <ArrowUp className="inline h-4 w-4" />
                      ) : (
                        <ArrowDown className="inline h-4 w-4" />
                      )}
                      {Math.abs(coin.change7d)}%
                    </td>
                    <td className="text-right py-4 px-4">
                      ${coin.marketCap.toLocaleString()}
                    </td>
                    <td className="text-right py-4 px-4">
                      <div className="flex flex-col items-end">
                        <span>${coin.volume24h.toLocaleString()}</span>
                        <span className="text-sm text-gray-400">
                          {(coin.volume24h / coin.price).toLocaleString(
                            undefined,
                            { maximumFractionDigits: 2 }
                          )}
                          {" " + coin.symbol}
                        </span>
                      </div>
                    </td>
                    <td className="text-right py-4 px-4">
                      {coin.circulatingSupply.toLocaleString()} {coin.symbol}
                    </td>
                    <td className="py-4 px-4">
                      <SparklineChart
                        data={[...coin.sparkline]}
                        color={coin.change7d > 0 ? "#22c55e" : "#ef4444"}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-gray-400">
                    {watchlistOnly ? (
                      <div className="flex flex-col items-center gap-2">
                        <Star className="h-8 w-8 mb-2" />
                        <p className="text-lg font-medium">
                          Your watchlist is empty
                        </p>
                        <p>Star some coins to add them to your watchlist</p>
                      </div>
                    ) : (
                      "No coins match your filters"
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {filteredCoins.length > 0 && (
          <div className="mt-4 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      onClick={() => setCurrentPage(i + 1)}
                      isActive={currentPage === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </motion.div>
    </section>
  );
}
