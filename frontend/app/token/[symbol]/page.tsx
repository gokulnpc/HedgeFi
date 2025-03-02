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
  Settings2,
  Power,
} from "lucide-react";

const DEFAULT_TOKEN_IMAGE = "/placeholder.svg";

export default function TokenDetailPage() {
  const params = useParams();
  const { toast } = useToast();
  const symbol = params.symbol as string;

  const [token, setToken] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [buyAmount, setBuyAmount] = useState("1");
  const [isBuying, setIsBuying] = useState(false);

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

  if (isLoading) {
    return (
      <AppLayout>
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
      <div className="min-h-screen bg-[#141414] text-white pb-12">
        <div className="container max-w-7xl mx-auto px-4 pt-6">
          {/* Cat Mascot */}
          <div className="relative">
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-32 h-32 z-10">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-28%20at%2000.31.26-W4ED3LHCyVcxQbYIhgztjbnxRkOegQ.png"
                alt="Cute cat mascot"
                width={128}
                height={128}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Header with Settings */}
          <div className="flex items-center justify-between mb-8 pt-4">
            <Link href="/marketplace">
              <Button
                variant="ghost"
                className="text-white/70 hover:text-white"
              >
                ← Back
              </Button>
            </Link>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-white/70 hover:text-white"
              >
                <Settings2 className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white/70 hover:text-white"
              >
                <Power className="h-6 w-6" />
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
            <div className="lg:col-span-2">
              <Card className="bg-[#1c1c1e] border-none rounded-3xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Token Image */}
                    <div className="w-full md:w-48 h-48 relative rounded-2xl overflow-hidden">
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
                        <Badge className="bg-[#FFB800] text-black font-semibold">
                          ${token?.symbol}
                        </Badge>
                      </div>

                      <p className="text-white/60 mb-6">{token?.description}</p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-black/20 rounded-xl p-4">
                          <div className="text-white/60 text-sm mb-1">
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

                        <div className="bg-black/20 rounded-xl p-4">
                          <div className="text-white/60 text-sm mb-1">
                            Market Cap
                          </div>
                          <div className="text-xl font-semibold">
                            ${token?.marketCap}
                          </div>
                        </div>

                        <div className="bg-black/20 rounded-xl p-4">
                          <div className="text-white/60 text-sm mb-1">
                            Volume 24h
                          </div>
                          <div className="text-xl font-semibold">
                            {token?.volume24h}
                          </div>
                        </div>

                        <div className="bg-black/20 rounded-xl p-4">
                          <div className="text-white/60 text-sm mb-1">
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

              {/* Buy Card */}
              <Card className="bg-[#1c1c1e] border-none rounded-3xl overflow-hidden mt-6">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-6">
                    Buy {token?.symbol}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="text-white/60 text-sm block mb-2">
                        Amount
                      </label>
                      <Input
                        type="number"
                        value={buyAmount}
                        onChange={(e) => setBuyAmount(e.target.value)}
                        min="1"
                        className="bg-black border-white/10 h-14 rounded-xl text-lg"
                      />
                    </div>
                    <div>
                      <label className="text-white/60 text-sm block mb-2">
                        Total Cost
                      </label>
                      <div className="bg-black border border-white/10 h-14 rounded-xl flex items-center px-4 text-lg font-mono">
                        {(
                          Number.parseFloat(buyAmount) *
                          Number.parseFloat(token?.baseCost || "0")
                        ).toFixed(6)}{" "}
                        ETH
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full h-14 text-lg font-semibold bg-[#FFB800] hover:bg-[#FFA500] text-black rounded-xl"
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
              </Card>
            </div>

            {/* Right Column */}
            <div>
              <Card className="bg-[#1c1c1e] border-none rounded-3xl overflow-hidden">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-6">Token Information</h2>

                  <div className="space-y-4">
                    <div className="flex justify-between py-3 border-b border-white/10">
                      <span className="text-white/60">Contract Address</span>
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
                      <span className="text-white/60">Network</span>
                      <Badge variant="outline" className="bg-white/5">
                        {token?.chain}
                      </Badge>
                    </div>

                    <div className="flex justify-between py-3 border-b border-white/10">
                      <span className="text-white/60">Launch Date</span>
                      <span>{token?.launchDate}</span>
                    </div>

                    <div className="flex justify-between py-3">
                      <span className="text-white/60">Social Links</span>
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

              {/* Chart Placeholder */}
              <Card className="bg-[#1c1c1e] border-none rounded-3xl overflow-hidden mt-6">
                <CardContent className="p-6">
                  <div className="aspect-video bg-black/20 rounded-xl flex items-center justify-center">
                    <BarChart3 className="h-12 w-12 text-white/20" />
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
