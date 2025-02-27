import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import AITradeRecommendation from "./AITradeRecommendation";

interface CoinTradeProps {
  symbol: string;
  isAuthenticated: boolean;
  handleTradeAction: () => void;
}

const CoinTrade = ({
  symbol,
  isAuthenticated,
  handleTradeAction,
}: CoinTradeProps) => {
  const [amount, setAmount] = useState("");
  const [total, setTotal] = useState("");
  const balance = 500;

  const handlePercentageClick = (percentage: number) => {
    const newAmount = ((balance * percentage) / 100).toFixed(2);
    setAmount(newAmount);
    setTotal(newAmount);
  };

  const handleApplyRecommendation = () => {
    if (!isAuthenticated) {
      handleTradeAction();
      return;
    }
    // Apply the recommendation values
    setAmount("100");
    setTotal("100");
  };

  return (
    <div className="space-y-4">
      {/* AI Trade Recommendation - Moved to top */}
      <AITradeRecommendation
        symbol={symbol}
        recommendation="BUY"
        analysis="Based on current market analysis, a buying opportunity is present with a favorable risk-reward ratio."
        entry={0.00123}
        target={0.00129}
        stopLoss={0.0012}
        onApply={handleApplyRecommendation}
      />

      <Tabs defaultValue="buy">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="buy">Buy</TabsTrigger>
          <TabsTrigger value="sell">Sell</TabsTrigger>
        </TabsList>
        <TabsContent value="buy">
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-2">
              {[25, 50, 75, 100].map((percent) => (
                <Button
                  key={percent}
                  variant="outline"
                  className="border-gray-400/30"
                  onClick={() => handlePercentageClick(percent)}
                >
                  {percent}%
                </Button>
              ))}
            </div>
            <Input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border-gray-400/30"
            />
            <Input
              type="number"
              placeholder="Total USDT"
              value={total}
              onChange={(e) => setTotal(e.target.value)}
              className="border-gray-400/30"
            />
            <Button
              className="w-full"
              variant="default"
              onClick={handleTradeAction}
            >
              {isAuthenticated ? `Buy ${symbol}` : "Login to Trade"}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="sell">
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-2">
              {[25, 50, 75, 100].map((percent) => (
                <Button
                  key={percent}
                  variant="outline"
                  className="border-gray-400/30"
                  onClick={() => handlePercentageClick(percent)}
                >
                  {percent}%
                </Button>
              ))}
            </div>
            <Input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border-gray-400/30"
            />
            <Input
              type="number"
              placeholder="Total USDT"
              value={total}
              onChange={(e) => setTotal(e.target.value)}
              className="border-gray-400/30"
            />
            <Button
              className="w-full"
              variant="destructive"
              onClick={handleTradeAction}
            >
              {isAuthenticated ? `Sell ${symbol}` : "Login to Trade"}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CoinTrade;
