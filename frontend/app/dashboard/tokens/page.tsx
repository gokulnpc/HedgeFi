"use client";

import { useState } from "react";
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
  Search,
  Filter,
  MoreVertical,
  TrendingUp,
  TrendingDown,
  Rocket,
  Users,
  DollarSign,
  LinkIcon,
  Share2,
  Settings,
  Plus,
} from "lucide-react";
import Link from "next/link";

// Mock data for created tokens
const mockTokens = [
  {
    id: "1",
    name: "DogeMoon",
    symbol: "DGMN",
    imageUrl: "/placeholder.svg?height=100&width=100",
    description: "To the moon with Doge power!",
    price: "$0.00042",
    priceChange: 15.2,
    marketCap: "$420,690",
    holders: "1,337",
    volume24h: "$69,420",
    launchDate: "2023-12-01",
    chain: "ETH",
    status: "active",
  },
  {
    id: "2",
    name: "PepeFi",
    symbol: "PEFI",
    imageUrl: "/placeholder.svg?height=100&width=100",
    description: "The rarest Pepe in DeFi",
    price: "$0.0069",
    priceChange: -5.3,
    marketCap: "$138,420",
    holders: "845",
    volume24h: "$28,350",
    launchDate: "2024-01-15",
    chain: "BSC",
    status: "active",
  },
  {
    id: "3",
    name: "CatRocket",
    symbol: "CTRK",
    imageUrl: "/placeholder.svg?height=100&width=100",
    description: "Feline-powered rocket to the stars",
    price: "$0.00013",
    priceChange: 32.7,
    marketCap: "$98,760",
    holders: "512",
    volume24h: "$15,890",
    launchDate: "2024-02-10",
    chain: "SOL",
    status: "active",
  },
  {
    id: "4",
    name: "MoonLambo",
    symbol: "MLMB",
    imageUrl: "/placeholder.svg?height=100&width=100",
    description: "When moon? When lambo? Now!",
    price: "$0.00021",
    priceChange: -12.8,
    marketCap: "$210,450",
    holders: "923",
    volume24h: "$42,180",
    launchDate: "2024-01-05",
    chain: "ETH",
    status: "paused",
  },
];

export default function TokensPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Filter tokens based on search query and active tab
  const filteredTokens = mockTokens.filter((token) => {
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

  return (
    <AppLayout>
      <main className="pt-24 pb-16 px-4 md:px-6">
        <div className="container max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">
                  My Tokens
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
                    {" "}
                    Dashboard
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

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="border-white/10 bg-black/60 backdrop-blur-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <Rocket className="h-5 w-5 text-sky-400" />
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">
                      Total Tokens
                    </p>
                    <div className="mt-2 flex items-baseline gap-2">
                      <p className="text-2xl font-bold">{mockTokens.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-black/60 backdrop-blur-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <Users className="h-5 w-5 text-purple-400" />
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">
                      Total Holders
                    </p>
                    <div className="mt-2 flex items-baseline gap-2">
                      <p className="text-2xl font-bold">3,617</p>
                      <span className="text-green-500">+12.5%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-black/60 backdrop-blur-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <DollarSign className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">Total Value</p>
                    <div className="mt-2 flex items-baseline gap-2">
                      <p className="text-2xl font-bold">$868,320</p>
                      <span className="text-green-500">+8.3%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-black/60 backdrop-blur-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <TrendingUp className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">24h Volume</p>
                    <div className="mt-2 flex items-baseline gap-2">
                      <p className="text-2xl font-bold">$155,840</p>
                      <span className="text-red-500">-3.2%</span>
                    </div>
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
                                <MoreVertical className="h-4 w-4" />
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
