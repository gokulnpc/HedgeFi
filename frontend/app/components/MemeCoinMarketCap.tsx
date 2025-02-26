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

// Update the Coin type to include an id
type Coin = {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change1h: number;
  change24h: number;
  change7d: number;
  marketCap: number;
  volume24h: number;
  circulatingSupply: number;
  sparkline: number[];
  logo: string;
};

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

const trendingCoins = [
  {
    id: "dogecoin",
    name: "Dogecoin",
    symbol: "DOGE",
    price: 0.2455,
    change1h: -0.14,
    change24h: 1.58,
    change7d: -9.93,
    marketCap: 36379981120,
    volume24h: 885839156,
    circulatingSupply: 148.15e9,
    sparkline: [
      0.26, 0.25, 0.24, 0.25, 0.26, 0.25, 0.24, 0.23, 0.24, 0.25, 0.24, 0.245,
    ],
    logo: "https://cryptologos.cc/logos/dogecoin-doge-logo.png",
  },
  {
    id: "shiba-inu",
    name: "Shiba Inu",
    symbol: "SHIB",
    price: 0.00001558,
    change1h: -0.15,
    change24h: 2.68,
    change7d: -4.18,
    marketCap: 9183229003,
    volume24h: 146263727,
    circulatingSupply: 589.25e12,
    sparkline: [
      0.000016, 0.0000155, 0.0000158, 0.0000157, 0.0000156, 0.0000155,
      0.0000157, 0.0000156, 0.0000155, 0.0000158, 0.0000156, 0.00001558,
    ],
    logo: "https://cryptologos.cc/logos/shiba-inu-shib-logo.png",
  },
  {
    id: "pepe",
    name: "PEPE",
    symbol: "PEPE",
    price: 0.00009562,
    change1h: -0.44,
    change24h: 4.01,
    change7d: -3.98,
    marketCap: 4022751797,
    volume24h: 485824771,
    circulatingSupply: 420.68e12,
    sparkline: [
      0.000098, 0.000096, 0.000095, 0.000097, 0.000096, 0.000094, 0.000095,
      0.000096, 0.000095, 0.000094, 0.000095, 0.00009562,
    ],
    logo: "https://cryptologos.cc/logos/pepe-pepe-logo.png",
  },
  {
    id: "trump",
    name: "TRUMP",
    symbol: "TRUMP",
    price: 16.48,
    change1h: -0.24,
    change24h: 2.43,
    change7d: -13.04,
    marketCap: 3297979858,
    volume24h: 576895263,
    circulatingSupply: 199.99e6,
    sparkline: [
      18.5, 17.8, 17.2, 16.8, 16.5, 16.2, 16.4, 16.3, 16.5, 16.4, 16.45, 16.48,
    ],
    logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/24383.png",
  },
  {
    id: "bonk",
    name: "BONK",
    symbol: "BONK",
    price: 0.00001606,
    change1h: -0.26,
    change24h: 3.03,
    change7d: -10.52,
    marketCap: 1242482471,
    volume24h: 72068303,
    circulatingSupply: 77.34e12,
    sparkline: [
      0.0000165, 0.0000162, 0.0000161, 0.000016, 0.0000159, 0.0000161, 0.000016,
      0.0000161, 0.0000159, 0.000016, 0.0000161, 0.00001606,
    ],
    logo: "https://cryptologos.cc/logos/bonk-bonk-logo.png",
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
                <th className="text-left py-4 px-4"></th> {/* Star column */}
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
                    className="border-b border-gray-800 hover:bg-gray-900/50"
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
                          )}{" "}
                          {coin.symbol}
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
