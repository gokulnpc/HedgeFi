"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, Activity, Users } from "lucide-react";
import { SiteHeader } from "@/app/components/site-header";
import { Footer } from "@/app/components/Footer";
import GridBackground from "@/app/components/GridBackground";
import { Input } from "@/components/ui/input";
import Marquee from "react-fast-marquee";

// Import the mock coin data
import { trendingCoins, type Coin } from "@/app/data/mockCoins";

const TradingViewWidget = dynamic(
  () => import("../components/trading-view-widget"),
  {
    ssr: false,
  }
);

const getTradingViewWidget = (pool_id: string) => {
  return (
    <iframe
      height="100%"
      width="100%"
      id="geckoterminal-embed"
      title="GeckoTerminal Embed"
      src={`https://www.geckoterminal.com/sui-network/pools/${pool_id}?embed=1&info=0&swaps=0&grayscale=0&light_chart=0`}
      style={{ border: 0 }}
      allow="clipboard-write"
      allowFullScreen
    ></iframe>
  );
};

const timeRanges = ["6H", "1D", "7D", "30D"];

// Add this type definition near the top of the file
type Holder = {
  rank: number;
  address: string;
  liquidityPercentage: number;
};

// Update the mockHolders array with 10 entries
const mockHolders: Holder[] = [
  { rank: 1, address: "0x1234...5678", liquidityPercentage: 15.5 },
  { rank: 2, address: "0x8765...4321", liquidityPercentage: 12.3 },
  { rank: 3, address: "0x9876...1234", liquidityPercentage: 8.7 },
  { rank: 4, address: "0x4567...8901", liquidityPercentage: 6.4 },
  { rank: 5, address: "0x3456...7890", liquidityPercentage: 5.2 },
  { rank: 6, address: "0x2345...6789", liquidityPercentage: 4.1 },
  { rank: 7, address: "0x7890...2345", liquidityPercentage: 3.8 },
  { rank: 8, address: "0x6789...3456", liquidityPercentage: 3.2 },
  { rank: 9, address: "0x5678...4567", liquidityPercentage: 2.9 },
  { rank: 10, address: "0x4321...5678", liquidityPercentage: 2.5 },
];

const AddressMarquee: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div className="w-[300px] bg-gray-800 rounded-lg px-2 py-1">
      <Marquee
        gradient={false}
        speed={20}
        delay={2}
        play={true}
        direction="left"
        pauseOnHover={true}
      >
        <span className="font-clean text-green-400">{text}</span>
      </Marquee>
    </div>
  );
};

// Add this new component for the title
const TitleMarquee: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div className="w-full overflow-hidden">
      <Marquee
        gradient={false}
        speed={20}
        delay={2}
        play={true}
        direction="left"
        pauseOnHover={true}
      >
        <span className="text-3xl font-pixel text-green-400">{text}</span>
      </Marquee>
    </div>
  );
};

export default function CoinPage() {
  const { id } = useParams();
  const [amount, setAmount] = useState("");
  const [total, setTotal] = useState("");
  const balance = 500;
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [coinData, setCoinData] = useState<Coin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication status on client side
    const savedAuth = localStorage.getItem("isAuthenticated");
    setIsAuthenticated(savedAuth === "true");

    // Fetch coin data based on ID
    if (id) {
      // Handle case when id is an array
      const coinId = Array.isArray(id) ? id[0] : id.toString();

      // For now, we'll use the mock data
      // In a real app, you would fetch this from an API
      const coin = trendingCoins.find((coin) => coin.id === coinId);

      if (coin) {
        setCoinData(coin);
        setLoading(false);
      } else {
        // If coin not found, you could redirect to a 404 page
        // or show an error message
        setLoading(false);
      }
    }
  }, [id]);

  // Redirect if not authenticated for trading functionality
  const handleTradeAction = () => {
    if (!isAuthenticated) {
      router.push("/signin?redirect=" + encodeURIComponent(`/coins/${id}`));
      return;
    }
    // Handle trade action for authenticated users
  };

  const handlePercentageClick = (percentage: number) => {
    const newAmount = ((balance * percentage) / 100).toFixed(2);
    setAmount(newAmount);
    setTotal(newAmount);
  };

  // Mock data for top holders
  const topHolders = [
    { rank: 1, address: "0x1234...5678", percentage: 50 },
    { rank: 2, address: "0x8765...4321", percentage: 25 },
    { rank: 3, address: "0x9876...1234", percentage: 16.67 },
  ];

  // Mock market stats
  const marketStats = {
    price: "$0.00123",
    change24h: "+5.67%",
    volume24h: "$1,234,567",
    marketCap: "$12,345,678",
  };

  return (
    <div className="relative flex min-h-screen flex-col">
      <GridBackground />
      <SiteHeader />

      <main className="flex-1 pt-20">
        <div className="container mx-auto p-4 space-y-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : coinData ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Chart Section */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-xl font-bold">
                      {coinData.symbol}/USDT
                    </CardTitle>
                    <div className="flex gap-2">
                      {["1H", "4H", "1D", "1W"].map((timeframe) => (
                        <Button key={timeframe} variant="outline" size="sm">
                          {timeframe}
                        </Button>
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 h-[500px]">
                    <TradingViewWidget symbol={coinData.symbol} />
                  </CardContent>
                </Card>
              </div>

              {/* Trading Interface */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wallet className="h-5 w-5" />
                      Trading
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
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
                          />
                          <Input
                            type="number"
                            placeholder="Total USDT"
                            value={total}
                            onChange={(e) => setTotal(e.target.value)}
                          />
                          <Button
                            className="w-full"
                            variant="default"
                            onClick={handleTradeAction}
                          >
                            {isAuthenticated
                              ? `Buy ${coinData.symbol}`
                              : "Login to Trade"}
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
                          />
                          <Input
                            type="number"
                            placeholder="Total USDT"
                            value={total}
                            onChange={(e) => setTotal(e.target.value)}
                          />
                          <Button
                            className="w-full"
                            variant="destructive"
                            onClick={handleTradeAction}
                          >
                            {isAuthenticated
                              ? `Sell ${coinData.symbol}`
                              : "Login to Trade"}
                          </Button>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                {/* Market Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Market Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Price</p>
                      <p className="text-lg font-bold">
                        ${coinData.price.toFixed(8)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        24h Change
                      </p>
                      <p
                        className={`text-lg font-bold ${
                          coinData.change24h > 0
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {coinData.change24h > 0 ? "+" : ""}
                        {coinData.change24h}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        24h Volume
                      </p>
                      <p className="text-lg font-bold">
                        ${coinData.volume24h.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Market Cap
                      </p>
                      <p className="text-lg font-bold">
                        ${coinData.marketCap.toLocaleString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Top Holders */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Top Holders
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {mockHolders.map((holder) => (
                        <div
                          key={holder.rank}
                          className="flex justify-between items-center"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              #{holder.rank}
                            </span>
                            <span className="text-sm">{holder.address}</span>
                          </div>
                          <span className="text-sm font-bold">
                            {holder.liquidityPercentage.toFixed(2)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Coin not found</h2>
              <p className="mb-6">
                The coin you're looking for doesn't exist or has been removed.
              </p>
              <Button onClick={() => router.push("/")}>Return to Home</Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
