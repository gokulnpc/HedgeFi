"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { AppLayout } from "@/app/components/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ethers } from "ethers";
import GridBackground from "@/app/components/GridBackground";
import { useWalletStore } from "@/app/store/walletStore";
import { activeBets } from "../data";
import {
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  AlertCircle,
  Info,
  ArrowRight,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";

export default function PlaceBetPage() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const betId = searchParams.get("id");

  // Wallet state
  const { isConnected, connect, balance, addFunds, withdrawFunds, getBalance } =
    useWalletStore();

  // Bet state
  const [bet, setBet] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [betAmount, setBetAmount] = useState("10");
  const [betSide, setBetSide] = useState<"yes" | "no">("yes");
  const [isPlacingBet, setIsPlacingBet] = useState(false);
  const [depositAmount, setDepositAmount] = useState("100");
  const [isDepositing, setIsDepositing] = useState(false);
  const [estimatedGasFee, setEstimatedGasFee] = useState("0.005");
  const [totalCost, setTotalCost] = useState("0");

  // Fetch bet details
  useEffect(() => {
    if (betId) {
      // Find the bet in the active bets
      const foundBet = activeBets.find((b) => b.id === betId);
      if (foundBet) {
        setBet(foundBet);
      }
    }
    setIsLoading(false);
  }, [betId]);

  // Calculate total cost when bet amount changes
  useEffect(() => {
    const amount = parseFloat(betAmount) || 0;
    const gas = parseFloat(estimatedGasFee);
    setTotalCost((amount + gas).toFixed(3));
  }, [betAmount, estimatedGasFee]);

  // Handle wallet connection
  const handleConnectWallet = async () => {
    try {
      await connect();
      toast({
        title: "Wallet Connected",
        description: "Your wallet has been connected successfully.",
      });
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect your wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle deposit
  const handleDeposit = async () => {
    try {
      setIsDepositing(true);
      // Simulate blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Add funds to wallet
      const amount = parseFloat(depositAmount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error("Invalid amount");
      }

      addFunds(amount, "0x" + Math.random().toString(16).substring(2, 10));

      toast({
        title: "Deposit Successful",
        description: `${amount} ETH has been added to your wallet.`,
      });

      setDepositAmount("100");
    } catch (error) {
      console.error("Error depositing funds:", error);
      toast({
        title: "Deposit Failed",
        description: "Failed to deposit funds. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDepositing(false);
    }
  };

  // Handle placing bet
  const handlePlaceBet = async () => {
    try {
      setIsPlacingBet(true);

      // Check if user has enough balance
      const amount = parseFloat(betAmount) || 0;
      const gas = parseFloat(estimatedGasFee);
      const total = amount + gas;
      const currentBalance = getBalance();

      if (total > currentBalance) {
        throw new Error("Insufficient balance");
      }

      // Simulate blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Withdraw funds from wallet
      const success = withdrawFunds(total);
      if (!success) {
        throw new Error("Failed to withdraw funds");
      }

      toast({
        title: "Bet Placed Successfully",
        description: `You bet ${amount} ETH on ${betSide.toUpperCase()} for "${
          bet.title
        }"`,
      });

      // Reset form
      setBetAmount("10");
    } catch (error: any) {
      console.error("Error placing bet:", error);
      toast({
        title: "Bet Failed",
        description: error.message || "Failed to place bet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPlacingBet(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container py-12 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  if (!bet) {
    return (
      <AppLayout>
        <div className="container py-12">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <AlertCircle className="w-16 h-16 text-red-500" />
            <h2 className="mt-4 text-2xl font-bold">Bet Not Found</h2>
            <p className="mt-2 text-muted-foreground">
              The bet you're looking for doesn't exist or is not available.
            </p>
            <Link href="/bets">
              <Button className="mt-6">Back to Bets</Button>
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <GridBackground />
      <div className="container py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Back button */}
          <div className="mb-6">
            <Link href="/bets">
              <Button variant="outline" size="sm">
                ← Back to Bets
              </Button>
            </Link>
          </div>

          {/* Main content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Bet details */}
            <div className="md:col-span-2">
              <Card className="border-white/10 bg-black/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl">{bet.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge
                      variant="outline"
                      className="bg-black/90 border-white/10"
                    >
                      {bet.category}
                    </Badge>
                    <div className="text-sm text-muted-foreground">
                      Ends {formatDate(bet.endDate)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video relative rounded-lg overflow-hidden mb-6">
                    <Image
                      src={bet.image || "/placeholder.svg"}
                      alt={bet.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Pool Distribution */}
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-1 text-green-400">
                        Yes {(bet.yesProbability * 100).toFixed(0)}%
                      </span>
                      <span className="flex items-center gap-1 text-red-400">
                        No {(bet.noProbability * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="relative h-2 overflow-hidden rounded-full bg-white/5">
                      <div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-sky-400 to-blue-500"
                        style={{ width: `${bet.yesProbability * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Pool Info */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-sm text-muted-foreground mb-1">
                        Total Pool
                      </div>
                      <div className="text-lg font-medium font-mono">
                        ${bet.totalPool.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-sm text-muted-foreground mb-1">
                        Yes Pool
                      </div>
                      <div className="text-lg font-medium font-mono text-green-400">
                        ${bet.yesPool.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-sm text-muted-foreground mb-1">
                        No Pool
                      </div>
                      <div className="text-lg font-medium font-mono text-red-400">
                        ${bet.noPool.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-400 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-400">
                          How it works
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Place your bet on whether this prediction will come
                          true. If you're right, you'll win a share of the pool
                          proportional to your bet amount. The smaller the
                          probability of your chosen outcome, the higher your
                          potential reward.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Betting form */}
            <div className="md:col-span-1">
              <div className="space-y-6">
                {/* Wallet Card */}
                <Card className="border-white/10 bg-black/60 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wallet className="h-5 w-5" />
                      Wallet
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isConnected ? (
                      <div className="space-y-4">
                        <div className="p-4 bg-white/5 rounded-lg">
                          <div className="text-sm text-muted-foreground mb-1">
                            Your Balance
                          </div>
                          <div className="text-2xl font-medium font-mono">
                            {balance ? parseFloat(balance).toFixed(3) : "0.000"}{" "}
                            ETH
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="text-sm font-medium">Add Funds</div>
                          <div className="flex gap-2">
                            <Input
                              type="number"
                              value={depositAmount}
                              onChange={(e) => setDepositAmount(e.target.value)}
                              className="flex-1"
                              min="0"
                              step="0.01"
                            />
                            <Button
                              onClick={handleDeposit}
                              disabled={isDepositing}
                              className="whitespace-nowrap"
                            >
                              {isDepositing && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              )}
                              Deposit
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          Connect your wallet to place bets and manage your
                          funds.
                        </p>
                        <Button
                          onClick={handleConnectWallet}
                          className="w-full"
                        >
                          Connect Wallet
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Betting Card */}
                <Card className="border-white/10 bg-black/60 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Place Your Bet</CardTitle>
                    <CardDescription>
                      Choose your prediction and bet amount
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Bet Side Selection */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Your Prediction
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            type="button"
                            variant={betSide === "yes" ? "default" : "outline"}
                            className={
                              betSide === "yes"
                                ? "bg-green-500 hover:bg-green-600"
                                : "border-white/10"
                            }
                            onClick={() => setBetSide("yes")}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Yes
                          </Button>
                          <Button
                            type="button"
                            variant={betSide === "no" ? "default" : "outline"}
                            className={
                              betSide === "no"
                                ? "bg-red-500 hover:bg-red-600"
                                : "border-white/10"
                            }
                            onClick={() => setBetSide("no")}
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            No
                          </Button>
                        </div>
                      </div>

                      {/* Bet Amount */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Bet Amount (ETH)
                        </label>
                        <Input
                          type="number"
                          value={betAmount}
                          onChange={(e) => setBetAmount(e.target.value)}
                          min="0.001"
                          step="0.001"
                        />
                      </div>

                      {/* Potential Reward */}
                      <div className="p-4 bg-white/5 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">
                          Potential Reward
                        </div>
                        <div className="text-lg font-medium font-mono">
                          {betSide === "yes"
                            ? (
                                (parseFloat(betAmount) || 0) *
                                (bet.totalPool / bet.yesPool)
                              ).toFixed(3)
                            : (
                                (parseFloat(betAmount) || 0) *
                                (bet.totalPool / bet.noPool)
                              ).toFixed(3)}{" "}
                          ETH
                        </div>
                      </div>

                      {/* Gas Fee */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Estimated Gas Fee
                          </span>
                          <span>{estimatedGasFee} ETH</span>
                        </div>
                        <Separator className="bg-white/10" />
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">Total Cost</span>
                          <span className="font-medium">{totalCost} ETH</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      disabled={
                        !isConnected ||
                        isPlacingBet ||
                        parseFloat(betAmount) <= 0 ||
                        parseFloat(totalCost) > getBalance()
                      }
                      onClick={handlePlaceBet}
                    >
                      {isPlacingBet && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {!isConnected
                        ? "Connect Wallet to Bet"
                        : parseFloat(totalCost) > getBalance()
                        ? "Insufficient Balance"
                        : `Place ${betSide.toUpperCase()} Bet`}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
