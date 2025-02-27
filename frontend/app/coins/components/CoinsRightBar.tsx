"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Wallet } from "lucide-react";
import CoinChat from "./CoinChat";
import CoinTrade from "./CoinTrade";

interface CoinsRightBarProps {
  symbol: string;
  isAuthenticated: boolean;
  handleTradeAction: () => void;
}

export default function CoinsRightBar({
  symbol,
  isAuthenticated,
  handleTradeAction,
}: CoinsRightBarProps) {
  const [showChat, setShowChat] = useState(true);
  const [windowHeight, setWindowHeight] = useState(0);

  useEffect(() => {
    // Set initial height
    setWindowHeight(window.innerHeight);

    // Update height on window resize
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Clean up event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      className="fixed right-4 w-[calc(30%-2rem)] max-w-[400px]"
      style={{ height: `calc(${windowHeight}px - 96px)` }}
    >
      <div className="space-y-6 h-full overflow-auto">
        <Card className="h-full flex flex-col shadow-lg bg-black/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex gap-2">
              <Button
                variant={showChat ? "default" : "outline"}
                size="sm"
                onClick={() => setShowChat(true)}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Chat
              </Button>
              <Button
                variant={showChat ? "outline" : "default"}
                size="sm"
                onClick={() => setShowChat(false)}
              >
                <Wallet className="w-4 h-4 mr-2" />
                Trade
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            {showChat ? (
              <CoinChat />
            ) : (
              <CoinTrade
                symbol={symbol}
                isAuthenticated={isAuthenticated}
                handleTradeAction={handleTradeAction}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
