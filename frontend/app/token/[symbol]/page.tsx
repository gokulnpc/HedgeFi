"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { AppLayout } from "@/app/components/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ethers } from "ethers";
import { getTokens, buyToken } from "@/services/memecoin-launchpad";
import { useToast } from "@/components/ui/use-toast";
import {
  TrendingUp,
  TrendingDown,
  Globe,
  Twitter,
  MessageSquare as Telegram,
  Copy,
  Loader2,
  Rocket,
  BarChart3,
  AlertCircle,
  ArrowLeft,
  Share2,
  Star,
} from "lucide-react";
import GridBackground from "@/app/components/GridBackground";

const DEFAULT_TOKEN_IMAGE = "/placeholder.svg";

export default function TokenDetailPage() {
  const params = useParams();
  const { toast } = useToast();
  const symbol = params.symbol as string;

  const [token, setToken] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [buyAmount, setBuyAmount] = useState("1");
  const [isBuying, setIsBuying] = useState(false);
  const [isStarred, setIsStarred] = useState(false);

  // Fetch token details
  useEffect(() => {
    const fetchToken = async () => {
      try {
        setIsLoading(true);
        // Get all tokens that are open for sale
        const tokens = await getTokens({ isOpen: true });

        // Find the token with matching symbol
        const foundToken = tokens.find(
          (t) => t.name.substring(0, 4).toUpperCase() === symbol.toUpperCase()
        );

        if (foundToken) {
          // Format token data for display
          setToken({
            id: foundToken.token,
            name: foundToken.name,
            symbol: foundToken.name.substring(0, 4).toUpperCase(),
            description: foundToken.description || "No description available",
            imageUrl: foundToken.image || DEFAULT_TOKEN_IMAGE,
            price: "0.000033", // Default price, should be calculated from token data
            marketCap: (Number(foundToken.raised) / 1e18).toFixed(2) + "k",
            priceChange: Math.random() * 20 - 10, // Random price change for now
            fundingRaised: foundToken.raised.toString(),
            chain: "ethereum", // Default to ethereum, should be determined from the chain ID
            volume24h: "$" + (Math.random() * 100000).toFixed(2),
            holders: (Math.random() * 1000).toFixed(0),
            launchDate: new Date().toISOString().split("T")[0],
            status: "active",
            creator: foundToken.creator,
            baseCost: "0.0001", // Base cost in ETH
            rawToken: foundToken, // Keep the original token data for buy function
          });
        }
      } catch (error) {
        console.error("Error fetching token:", error);
        toast({
          title: "Error",
          description: "Failed to load token details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (symbol) {
      fetchToken();
    }
  }, [symbol, toast]);

  // Handle buy token
  const handleBuyToken = async () => {
    if (!token || !buyAmount) return;

    try {
      setIsBuying(true);

      // Convert amount to BigInt
      const amount = BigInt(parseFloat(buyAmount));

      // Call the buyToken function
      const result = await buyToken(token.rawToken, amount);

      if (result.success) {
        toast({
          title: "Success",
          description: `Successfully purchased ${buyAmount} ${token.symbol} tokens!`,
        });
      } else {
        toast({
          title: "Transaction Failed",
          description: result.error || "Failed to buy tokens",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error buying token:", error);
      toast({
        title: "Error",
        description: "An error occurred while buying tokens",
        variant: "destructive",
      });
    } finally {
      setIsBuying(false);
    }
  };

  // Format address for display
  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Address copied to clipboard",
    });
  };

  // Handle share
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${token?.name} (${token?.symbol})`,
          text: `Check out ${token?.name} on HedgeFi!`,
          url: window.location.href,
        })
        .catch((err) => {
          console.error("Error sharing:", err);
        });
    } else {
      copyToClipboard(window.location.href);
      toast({
        title: "Link Copied",
        description: "Token link copied to clipboard for sharing",
      });
    }
  };

  // Toggle star/favorite
  const toggleStar = () => {
    setIsStarred(!isStarred);
    toast({
      title: isStarred ? "Removed from Watchlist" : "Added to Watchlist",
      description: isStarred
        ? `${token?.symbol} has been removed from your watchlist`
        : `${token?.symbol} has been added to your watchlist`,
    });
  };

  if (isLoading) {
    return (
      <AppLayout>
        <GridBackground />
        <div className="container py-12">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-500 border-l-transparent border-r-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-lg text-muted-foreground">
              Loading token details...
            </p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!token) {
    return (
      <AppLayout>
        <GridBackground />
        <div className="container py-12">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <AlertCircle className="w-16 h-16 text-red-500" />
            <h2 className="mt-4 text-2xl font-bold">Token Not Found</h2>
            <p className="mt-2 text-muted-foreground">
              The token you're looking for doesn't exist or is not available.
            </p>
            <Link href="/marketplace">
              <Button className="mt-6">Back to Marketplace</Button>
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <GridBackground />
      <div className="pb-12">
        <div className="container max-w-7xl mx-auto px-4 pt-6">
          {/* Header with Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pt-4">
            <Link href="/marketplace">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Marketplace
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleStar}
                className={
                  isStarred
                    ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                    : ""
                }
              >
                <Star
                  className={`mr-2 h-4 w-4 ${isStarred ? "fill-blue-500" : ""}`}
                />
                {isStarred ? "Watchlisted" : "Add to Watchlist"}
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Token Overview Card */}
              <Card className="border-white/10 bg-black/50 backdrop-blur-xl">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Token Image */}
                    <div className="w-full md:w-48 h-48 relative rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={token?.imageUrl || DEFAULT_TOKEN_IMAGE}
                        alt={token?.name || "Token"}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Token Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <h1 className="text-3xl font-bold">{token?.name}</h1>
                        <Badge className="bg-gradient-to-r from-sky-400 to-blue-500 text-white font-semibold">
                          ${token?.symbol}
                        </Badge>
                      </div>

                      <p className="text-muted-foreground mb-6 line-clamp-3">
                        {token?.description}
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-black/20 rounded-lg p-4">
                          <div className="text-muted-foreground text-sm mb-1">
                            Price
                          </div>
                          <div className="text-xl font-semibold">
                            ${token?.price}
                          </div>
                          <div
                            className={`text-sm ${
                              token?.priceChange > 0
                                ? "text-green-400"
                                : "text-red-400"
                            } flex items-center gap-1`}
                          >
                            {token?.priceChange > 0 ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            {token?.priceChange > 0 ? "+" : ""}
                            {token?.priceChange?.toFixed(2)}%
                          </div>
                        </div>

                        <div className="bg-black/20 rounded-lg p-4">
                          <div className="text-muted-foreground text-sm mb-1">
                            Market Cap
                          </div>
                          <div className="text-xl font-semibold">
                            ${token?.marketCap}
                          </div>
                        </div>

                        <div className="bg-black/20 rounded-lg p-4">
                          <div className="text-muted-foreground text-sm mb-1">
                            Volume 24h
                          </div>
                          <div className="text-xl font-semibold">
                            {token?.volume24h}
                          </div>
                        </div>

                        <div className="bg-black/20 rounded-lg p-4">
                          <div className="text-muted-foreground text-sm mb-1">
                            Holders
                          </div>
                          <div className="text-xl font-semibold">
                            {token?.holders}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Description Card */}
              <Card className="border-white/10 bg-black/50 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle>About {token?.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      {token?.description ||
                        "No description available for this token."}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="bg-black/20 p-4 rounded-lg">
                        <h3 className="text-sm font-medium mb-2">
                          Token Utility
                        </h3>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                          <li>Governance voting rights</li>
                          <li>Platform fee discounts</li>
                          <li>Access to premium features</li>
                          <li>Staking rewards</li>
                        </ul>
                      </div>

                      <div className="bg-black/20 p-4 rounded-lg">
                        <h3 className="text-sm font-medium mb-2">Tokenomics</h3>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                          <li>Total Supply: 1,000,000,000</li>
                          <li>Circulating Supply: 250,000,000</li>
                          <li>Initial Distribution: 25%</li>
                          <li>Team Allocation: 15% (locked)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Price Chart Card */}
              <Card className="border-white/10 bg-black/50 backdrop-blur-xl">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle>Price History</CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs"
                      >
                        1D
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs bg-blue-500/10 text-blue-500 border-blue-500/20"
                      >
                        1W
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs"
                      >
                        1M
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs"
                      >
                        1Y
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="aspect-[16/9] bg-black/20 rounded-lg flex flex-col items-center justify-center p-6">
                    <BarChart3 className="h-16 w-16 text-white/20 mb-4" />
                    <p className="text-muted-foreground text-center">
                      Price chart data will be available once there is
                      sufficient trading activity.
                    </p>
                    <p className="text-sm text-muted-foreground text-center mt-2">
                      Be one of the first to trade this token!
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="bg-black/20 p-3 rounded-lg">
                      <div className="text-xs text-muted-foreground">
                        All-time high
                      </div>
                      <div className="font-medium">$0.000045</div>
                      <div className="text-xs text-green-400">
                        +36.36% from current
                      </div>
                    </div>
                    <div className="bg-black/20 p-3 rounded-lg">
                      <div className="text-xs text-muted-foreground">
                        All-time low
                      </div>
                      <div className="font-medium">$0.000021</div>
                      <div className="text-xs text-red-400">
                        -36.36% from current
                      </div>
                    </div>
                    <div className="bg-black/20 p-3 rounded-lg">
                      <div className="text-xs text-muted-foreground">
                        30d change
                      </div>
                      <div className="font-medium flex items-center">
                        <TrendingDown className="h-3 w-3 text-red-400 mr-1" />
                        -9.65%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Buy Card */}
              <Card className="border-white/10 bg-black/50 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle>Buy {token?.symbol}</CardTitle>
                  <CardDescription>
                    Purchase tokens directly with ETH
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="text-muted-foreground text-sm block mb-2">
                        Amount
                      </label>
                      <Input
                        type="number"
                        value={buyAmount}
                        onChange={(e) => setBuyAmount(e.target.value)}
                        min="1"
                        className="bg-black/30 border-white/10 h-12 rounded-lg text-lg"
                      />
                    </div>
                    <div>
                      <label className="text-muted-foreground text-sm block mb-2">
                        Total Cost
                      </label>
                      <div className="bg-black/30 border border-white/10 h-12 rounded-lg flex items-center px-4 text-lg font-mono">
                        {(
                          Number.parseFloat(buyAmount) *
                          Number.parseFloat(token?.baseCost || "0")
                        ).toFixed(6)}{" "}
                        ETH
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full h-12 text-base font-semibold bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white rounded-lg"
                    onClick={handleBuyToken}
                    disabled={
                      isBuying ||
                      !buyAmount ||
                      Number.parseFloat(buyAmount) <= 0
                    }
                  >
                    {isBuying ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Processing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Rocket className="h-5 w-5" />
                        <span>Buy {token?.symbol}</span>
                      </div>
                    )}
                  </Button>
                </CardContent>
                <CardFooter className="bg-black/20 px-6 py-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>
                      Base cost: {token?.baseCost} ETH per token. Gas fees may
                      apply.
                    </span>
                  </div>
                </CardFooter>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Token Information Card */}
              <Card className="border-white/10 bg-black/50 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle>Token Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between py-3 border-b border-white/10">
                      <span className="text-muted-foreground">
                        Contract Address
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">
                          {formatAddress(token?.id)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => copyToClipboard(token?.id)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-between py-3 border-b border-white/10">
                      <span className="text-muted-foreground">Network</span>
                      <Badge variant="outline" className="bg-white/5">
                        {token?.chain}
                      </Badge>
                    </div>

                    <div className="flex justify-between py-3 border-b border-white/10">
                      <span className="text-muted-foreground">Launch Date</span>
                      <span>{token?.launchDate}</span>
                    </div>

                    <div className="flex justify-between py-3 border-b border-white/10">
                      <span className="text-muted-foreground">Creator</span>
                      <span className="font-mono text-sm">
                        {formatAddress(token?.creator)}
                      </span>
                    </div>

                    <div className="flex justify-between py-3 border-b border-white/10">
                      <span className="text-muted-foreground">Status</span>
                      <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                        Active
                      </Badge>
                    </div>

                    <div className="flex justify-between py-3">
                      <span className="text-muted-foreground">
                        Social Links
                      </span>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Globe className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Twitter className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Telegram className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Transactions */}
              <Card className="border-white/10 bg-black/50 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Empty state for now */}
                    <div className="text-center py-6">
                      <div className="bg-black/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                        <AlertCircle className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-medium mb-1">
                        No transactions yet
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Be the first to trade this token
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Market Activity */}
              <Card className="border-white/10 bg-black/50 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle>Market Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-black/20 p-4 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-muted-foreground">
                          Trading Volume (24h)
                        </span>
                        <span className="text-sm font-medium">
                          {token?.volume24h}
                        </span>
                      </div>
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-sky-400 to-blue-500 h-full rounded-full"
                          style={{ width: "35%" }}
                        ></div>
                      </div>
                    </div>

                    <div className="bg-black/20 p-4 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-muted-foreground">
                          Liquidity
                        </span>
                        <span className="text-sm font-medium">$45,678.90</span>
                      </div>
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-sky-400 to-blue-500 h-full rounded-full"
                          style={{ width: "62%" }}
                        ></div>
                      </div>
                    </div>

                    <div className="bg-black/20 p-4 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-muted-foreground">
                          Buy/Sell Ratio
                        </span>
                        <span className="text-sm font-medium">68% / 32%</span>
                      </div>
                      <div className="flex h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-green-500 h-full"
                          style={{ width: "68%" }}
                        ></div>
                        <div
                          className="bg-red-500 h-full"
                          style={{ width: "32%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
