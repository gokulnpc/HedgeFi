"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useWallet } from "../../providers/WalletProvider";
import { Loader2, Wallet } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function WalletSettings() {
  const { address, isConnected } = useAccount();
  const { balance, connect, addFunds, withdrawFunds } = useWallet();
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [isDepositing, setIsDepositing] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const handleConnectWallet = async () => {
    try {
      await connect();
      toast.success("Wallet connected successfully");
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast.error("Failed to connect wallet");
    }
  };

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsDepositing(true);
    try {
      // Simulate transaction delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Add funds to wallet
      addFunds(
        parseFloat(depositAmount),
        "0x" + Math.random().toString(16).slice(2)
      );

      toast.success(`Successfully deposited ${depositAmount} ETH`);
      setDepositAmount("");
    } catch (error) {
      console.error("Error depositing funds:", error);
      toast.error("Failed to deposit funds");
    } finally {
      setIsDepositing(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsWithdrawing(true);
    try {
      // Attempt to withdraw funds
      const success = withdrawFunds(parseFloat(withdrawAmount));

      if (success) {
        toast.success(`Successfully withdrew ${withdrawAmount} ETH`);
        setWithdrawAmount("");
      } else {
        toast.error("Insufficient funds for withdrawal");
      }
    } catch (error) {
      console.error("Error withdrawing funds:", error);
      toast.error("Failed to withdraw funds");
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Wallet Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your wallet connection and funds for HedgeFi.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-white/10 bg-black/50 backdrop-blur-xl">
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
                    {balance ? parseFloat(balance).toFixed(3) : "0.000"} ETH
                  </div>
                </div>

                <div className="p-4 bg-white/5 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">
                    Connected Address
                  </div>
                  <div className="text-sm font-medium font-mono break-all">
                    {address}
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
                      placeholder="Amount in ETH"
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

                <div className="space-y-2">
                  <div className="text-sm font-medium">Withdraw Funds</div>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="flex-1"
                      min="0"
                      step="0.01"
                      placeholder="Amount in ETH"
                    />
                    <Button
                      onClick={handleWithdraw}
                      disabled={isWithdrawing}
                      variant="outline"
                      className="whitespace-nowrap"
                    >
                      {isWithdrawing && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Withdraw
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Connect your wallet to manage your funds and create
                  predictions.
                </p>
                <Button onClick={handleConnectWallet} className="w-full">
                  Connect Wallet
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-black/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Transaction History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                View your recent transactions and deposit history.
              </p>

              {/* This would be populated with actual transaction data */}
              <div className="rounded-md border border-white/10 overflow-hidden">
                <div className="bg-white/5 p-3 text-sm font-medium">
                  Recent Transactions
                </div>
                <div className="p-4 text-sm text-center text-muted-foreground">
                  No transactions yet
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
