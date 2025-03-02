"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AppLayout } from "../../components/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowUpDown,
  ChevronDown,
  Copy,
  ExternalLink,
  Eye,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  Share2,
  Trash,
  TrendingUp,
  TrendingDown,
  Rocket,
  Users,
  DollarSign,
  LinkIcon,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { useTokenStore } from "../../store/tokenStore";
import { getUserTokens } from "@/services/memecoin-launchpad";

export default function TokensPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  }>({ key: "value", direction: "desc" });
  const [isLoading, setIsLoading] = useState(true);
  const [userTokens, setUserTokens] = useState<any[]>([]);

  // Get tokens from store
  const storeTokens = useTokenStore((state) => state.tokens);

  // Fetch user tokens from blockchain
  useEffect(() => {
    const fetchUserTokens = async () => {
      try {
        setIsLoading(true);
        const tokens = await getUserTokens();

        // Convert blockchain tokens to match the expected format
        const formattedTokens = tokens.map((token) => ({
          id: token.token,
          name: token.name,
          symbol: token.name.substring(0, 4).toUpperCase(),
          description: token.description || "No description available",
          imageUrl: token.image || "/placeholder.svg",
          price: "0.000033", // Default price, should be calculated from token data
          marketCap: (Number(token.raised) / 1e18).toFixed(2) + "k",
          priceChange: Math.random() * 20 - 10, // Random price change for now
          fundingRaised: token.raised.toString(),
          chain: "ethereum", // Default to ethereum, should be determined from the chain ID
          volume24h: "$" + (Math.random() * 100000).toFixed(2),
          holders: (Math.random() * 1000).toFixed(0).toString(),
          launchDate: new Date().toISOString().split("T")[0],
          status: token.isOpen ? "active" : "paused",
        }));

        setUserTokens(formattedTokens);
      } catch (error) {
        console.error("Error fetching user tokens:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserTokens();
  }, []);

  // Combine store tokens with blockchain tokens
  const tokens = [...storeTokens, ...userTokens];

  // Filter tokens based on search query and active tab
  const filteredTokens = tokens.filter((token) => {
    const matchesSearch =
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "active")
      return matchesSearch && token.status === "active";
    if (activeTab === "paused")
      return matchesSearch && token.status === "paused";

    return matchesSearch;
  });

  // Sort tokens based on sort config
  const sortedTokens = [...filteredTokens].sort((a, b) => {
    if (
      a[sortConfig.key as keyof typeof a] < b[sortConfig.key as keyof typeof b]
    ) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (
      a[sortConfig.key as keyof typeof a] > b[sortConfig.key as keyof typeof b]
    ) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  // Handle sort
  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  // Find best and worst performers
  const bestPerformer =
    tokens.length > 0
      ? [...tokens].reduce(
          (best, token) =>
            token.priceChange > best.priceChange ? token : best,
          tokens[0]
        )
      : null;

  const worstPerformer =
    tokens.length > 0
      ? [...tokens].reduce(
          (worst, token) =>
            token.priceChange < worst.priceChange ? token : worst,
          tokens[0]
        )
      : null;

  // Calculate total volume
  const totalVolume = tokens.reduce((sum, token) => {
    const volumeNumber = parseFloat(token.volume24h.replace(/[^0-9.]/g, ""));
    return sum + volumeNumber;
  }, 0);

  return (
    <AppLayout>
      <main className="pt-6 pb-16">
        <div className="container max-w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">
                  My
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
                    {" "}
                    Tokens
                  </span>
                </h1>
                <p className="text-muted-foreground">
                  Manage and monitor all your created tokens
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/launch">
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create New Token
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              <Card className="border-white/10 bg-black/60 backdrop-blur-xl overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <Rocket className="h-5 w-5 text-sky-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Tokens
                    </p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold">{tokens.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-black/60 backdrop-blur-xl overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <Users className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Holders
                    </p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold">3,617</p>
                      <span className="text-green-500">+12.5%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-black/60 backdrop-blur-xl overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <DollarSign className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Volume
                    </p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold">
                        ${totalVolume.toLocaleString()}
                      </p>
                      <span className="text-green-500">+8.3%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-black/60 backdrop-blur-xl overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <TrendingUp className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">24h Volume</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold">$155,840</p>
                      <span className="text-red-500">-3.2%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-black/60 backdrop-blur-xl overflow-hidden xl:col-span-1">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <TrendingUp className="h-5 w-5 text-green-400" />
                    <p className="text-base font-medium">Best Performer</p>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center gap-2">
                      <div className="text-xl font-bold">
                        {bestPerformer?.symbol}
                      </div>
                      <Badge
                        variant="default"
                        className="bg-green-500/20 text-green-500"
                      >
                        +{bestPerformer?.priceChange.toFixed(2)}%
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm">24h change</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-black/60 backdrop-blur-xl overflow-hidden xl:col-span-1">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <TrendingDown className="h-5 w-5 text-red-400" />
                    <p className="text-base font-medium">Worst Performer</p>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center gap-2">
                      <div className="text-xl font-bold">
                        {worstPerformer?.symbol}
                      </div>
                      <Badge
                        variant="destructive"
                        className="bg-red-500/20 text-red-500"
                      >
                        {worstPerformer?.priceChange.toFixed(2)}%
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm">24h change</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <Tabs
                defaultValue="all"
                className="w-full"
                onValueChange={setActiveTab}
              >
                <TabsList>
                  <TabsTrigger value="all">All Tokens</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="paused">Paused</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search tokens..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter By</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Newest First</DropdownMenuItem>
                    <DropdownMenuItem>Oldest First</DropdownMenuItem>
                    <DropdownMenuItem>Highest Market Cap</DropdownMenuItem>
                    <DropdownMenuItem>Most Holders</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <Card className="border-white/10 bg-black/60 backdrop-blur-xl">
              <CardHeader>
                <CardTitle>Your Created Tokens</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-white/10">
                      <TableHead className="text-xs uppercase text-gray-400 font-medium">
                        Token
                      </TableHead>
                      <TableHead className="text-xs uppercase text-gray-400 font-medium">
                        Price
                      </TableHead>
                      <TableHead className="hidden md:table-cell text-xs uppercase text-gray-400 font-medium">
                        Market Cap
                      </TableHead>
                      <TableHead className="hidden md:table-cell text-xs uppercase text-gray-400 font-medium">
                        Holders
                      </TableHead>
                      <TableHead className="hidden md:table-cell text-xs uppercase text-gray-400 font-medium">
                        24h Volume
                      </TableHead>
                      <TableHead className="hidden lg:table-cell text-xs uppercase text-gray-400 font-medium">
                        Launch Date
                      </TableHead>
                      <TableHead className="hidden lg:table-cell text-xs uppercase text-gray-400 font-medium">
                        Chain
                      </TableHead>
                      <TableHead className="hidden lg:table-cell text-xs uppercase text-gray-400 font-medium">
                        Status
                      </TableHead>
                      <TableHead className="text-xs uppercase text-gray-400 font-medium">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTokens.map((token) => (
                      <TableRow
                        key={token.id}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img
                              src={token.imageUrl || "/placeholder.svg"}
                              alt={token.name}
                              className="h-10 w-10 rounded-full border border-white/10"
                            />
                            <div>
                              <div className="font-medium">{token.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {token.symbol}
                              </div>
                              <div className="text-xs text-gray-500 mt-0.5 max-w-[150px] truncate">
                                {token.description}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{token.price}</div>
                          <div
                            className={`text-sm flex items-center ${
                              token.priceChange >= 0
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {token.priceChange >= 0 ? (
                              <TrendingUp className="h-3 w-3 mr-1" />
                            ) : (
                              <TrendingDown className="h-3 w-3 mr-1" />
                            )}
                            {token.priceChange >= 0 ? "+" : ""}
                            {token.priceChange}%
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            24h change
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="font-medium">{token.marketCap}</div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {token.status === "active"
                              ? "Fully diluted"
                              : "Locked"}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="font-medium">{token.holders}</div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {token.id === "1" || token.id === "3" ? (
                              <span className="text-green-500">
                                +5.2% this week
                              </span>
                            ) : (
                              <span className="text-red-500">
                                -2.1% this week
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="font-medium">{token.volume24h}</div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {token.id === "1" || token.id === "4" ? (
                              <span className="text-green-500">
                                +12.3% from avg
                              </span>
                            ) : (
                              <span className="text-red-500">
                                -8.7% from avg
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="font-medium">{token.launchDate}</div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {token.id === "1"
                              ? "3 months ago"
                              : token.id === "2"
                              ? "2 months ago"
                              : token.id === "3"
                              ? "1 month ago"
                              : "2 months ago"}
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <Badge
                            variant="outline"
                            className="bg-black/40 border-white/20 px-2 py-1"
                          >
                            {token.chain}
                          </Badge>
                          <div className="text-xs text-gray-500 mt-1">
                            {token.chain === "ETH"
                              ? "Ethereum"
                              : token.chain === "BSC"
                              ? "Binance"
                              : "Solana"}
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <Badge
                            variant={
                              token.status === "active"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              token.status === "active"
                                ? "bg-green-500/20 text-green-500 hover:bg-green-500/30"
                                : "bg-gray-500/20 text-gray-400"
                            }
                          >
                            {token.status === "active" ? "Active" : "Paused"}
                          </Badge>
                          <div className="text-xs text-gray-500 mt-1">
                            {token.status === "active"
                              ? "Trading enabled"
                              : "Trading paused"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-56 bg-black/90 border-white/10"
                            >
                              <DropdownMenuLabel className="text-xs text-gray-400">
                                Token Actions
                              </DropdownMenuLabel>
                              <DropdownMenuSeparator className="bg-white/10" />
                              <DropdownMenuItem className="flex items-center gap-2 text-sm hover:bg-white/5 cursor-pointer">
                                <Rocket className="h-4 w-4 text-blue-400" />
                                <span>Boost Marketing</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="flex items-center gap-2 text-sm hover:bg-white/5 cursor-pointer">
                                <Users className="h-4 w-4 text-purple-400" />
                                <span>View Holders</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="flex items-center gap-2 text-sm hover:bg-white/5 cursor-pointer">
                                <DollarSign className="h-4 w-4 text-green-400" />
                                <span>Add Liquidity</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="flex items-center gap-2 text-sm hover:bg-white/5 cursor-pointer">
                                <LinkIcon className="h-4 w-4 text-yellow-400" />
                                <span>View on Explorer</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="flex items-center gap-2 text-sm hover:bg-white/5 cursor-pointer">
                                <Share2 className="h-4 w-4 text-sky-400" />
                                <span>Share Token</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-white/10" />
                              <DropdownMenuItem className="flex items-center gap-2 text-sm hover:bg-white/5 cursor-pointer">
                                <Settings className="h-4 w-4 text-gray-400" />
                                <span>Token Settings</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </AppLayout>
  );
}
