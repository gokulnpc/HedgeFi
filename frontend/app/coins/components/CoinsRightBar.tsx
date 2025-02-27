"use client";

import { useState } from "react";
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

  return (
    <div className="fixed right-4 top-24 w-[calc(25%-2rem)] max-w-[350px]">
      <div className="space-y-6 max-h-[calc(100vh-100px)] overflow-auto">
        <Card className="border border-gray-400/30">
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
          <CardContent>
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
