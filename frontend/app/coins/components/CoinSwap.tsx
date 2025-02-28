"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ArrowUpDown,
  Settings2,
  Info,
  Search,
  ChevronDown,
  X,
  Share2,
  Clock,
  Zap,
  Check,
  ExternalLink,
  Copy,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";

interface CoinSwapProps {
  symbol: string;
  isAuthenticated: boolean;
  handleTradeAction: () => void;
}

// Define token data with more details
const tokens = [
  {
    symbol: "DOGE",
    name: "Dogecoin",
    balance: 861.87,
    icon: "🐶",
    change24h: "+2.4%",
    price: 0.18659,
  },
  {
    symbol: "USDT",
    name: "Tether",
    balance: 500.0,
    icon: "💵",
    change24h: "+0.1%",
    price: 1.0,
  },
  {
    symbol: "BTC",
    name: "Bitcoin",
    balance: 0.05,
    icon: "₿",
    change24h: "+1.8%",
    price: 61250,
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    balance: 1.2,
    icon: "Ξ",
    change24h: "-0.5%",
    price: 4125,
  },
  {
    symbol: "CAKE",
    name: "PancakeSwap",
    balance: 18.46,
    icon: "🍰",
    change24h: "+5.2%",
    price: 2.34,
  },
  {
    symbol: "SHELL",
    name: "Shell Protocol",
    balance: 1250.45,
    icon: "🐚",
    change24h: "+8.7%",
    price: 0.018,
  },
  {
    symbol: "SOL",
    name: "Solana",
    balance: 3.75,
    icon: "◎",
    change24h: "+4.3%",
    price: 175.42,
  },
  {
    symbol: "AVAX",
    name: "Avalanche",
    balance: 12.5,
    icon: "🔺",
    change24h: "+3.1%",
    price: 28.75,
  },
  {
    symbol: "MATIC",
    name: "Polygon",
    balance: 150.25,
    icon: "⬡",
    change24h: "+1.9%",
    price: 0.58,
  },
  {
    symbol: "LINK",
    name: "Chainlink",
    balance: 25.0,
    icon: "⬡",
    change24h: "+2.8%",
    price: 15.23,
  },
  {
    symbol: "UNI",
    name: "Uniswap",
    balance: 45.75,
    icon: "🦄",
    change24h: "+0.7%",
    price: 8.45,
  },
  {
    symbol: "AAVE",
    name: "Aave",
    balance: 8.2,
    icon: "👻",
    change24h: "-1.2%",
    price: 92.36,
  },
];

const CoinSwap = ({
  symbol,
  isAuthenticated,
  handleTradeAction,
}: CoinSwapProps) => {
  // Find the token that matches the symbol or default to the first token
  const defaultToken = tokens.find((t) => t.symbol === symbol) || tokens[0];

  const [fromToken, setFromToken] = useState(defaultToken);
  const [toToken, setToToken] = useState(tokens[1]); // Default to USDT
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [swapType, setSwapType] = useState("instant");
  const [fromSearchQuery, setFromSearchQuery] = useState("");
  const [toSearchQuery, setToSearchQuery] = useState("");
  const [isFromOpen, setIsFromOpen] = useState(false);
  const [isToOpen, setIsToOpen] = useState(false);
  const [slippage, setSlippage] = useState("0.5");
  const [showSettings, setShowSettings] = useState(false);
  const [orderType, setOrderType] = useState("instant");
  const [showSuccess, setShowSuccess] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");
  const [recipientAddress, setRecipientAddress] = useState(
    "0xf79DcD66e8bC69dae488c3E0F35e0693815bD7d6"
  );
  const [gasOnDestination, setGasOnDestination] = useState("0 BNB");
  const [fee, setFee] = useState("$0.00");
  const [gasCost, setGasCost] = useState("0.0 BNB");
  const [estimatedTime, setEstimatedTime] = useState("0 min");

  // Filter tokens based on search query
  const filteredFromTokens = tokens.filter(
    (token) =>
      token.symbol.toLowerCase().includes(fromSearchQuery.toLowerCase()) ||
      token.name.toLowerCase().includes(fromSearchQuery.toLowerCase())
  );

  const filteredToTokens = tokens.filter(
    (token) =>
      token.symbol.toLowerCase().includes(toSearchQuery.toLowerCase()) ||
      token.name.toLowerCase().includes(toSearchQuery.toLowerCase())
  );

  // Mock exchange rates (in a real app, these would come from an API)
  const getExchangeRate = (from: string, to: string) => {
    const rates: Record<string, Record<string, number>> = {
      DOGE: { USDT: 0.18659, BTC: 0.00000304, ETH: 0.00004521 },
      USDT: { DOGE: 5.36, BTC: 0.000016, ETH: 0.00024 },
      BTC: { DOGE: 328900, USDT: 61250, ETH: 14.8 },
      ETH: { DOGE: 22120, USDT: 4125, BTC: 0.0675 },
      CAKE: { USDT: 2.34, SHELL: 0.0053 },
      SHELL: { USDT: 0.018, CAKE: 188.67 },
      SOL: { USDT: 175.42, BTC: 0.00286 },
      AVAX: { USDT: 28.75, BTC: 0.00047 },
      MATIC: { USDT: 0.58, BTC: 0.0000095 },
      LINK: { USDT: 15.23, BTC: 0.00025 },
      UNI: { USDT: 8.45, BTC: 0.000138 },
      AAVE: { USDT: 92.36, BTC: 0.00151 },
    };

    return rates[from]?.[to] || 1;
  };

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    if (value && !isNaN(parseFloat(value))) {
      const rate = getExchangeRate(fromToken.symbol, toToken.symbol);
      setToAmount((parseFloat(value) * rate).toFixed(6));
    } else {
      setToAmount("");
    }
  };

  const handleToAmountChange = (value: string) => {
    setToAmount(value);
    if (value && !isNaN(parseFloat(value))) {
      const rate = getExchangeRate(toToken.symbol, fromToken.symbol);
      setFromAmount((parseFloat(value) * rate).toFixed(6));
    } else {
      setFromAmount("");
    }
  };

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const handleMaxClick = () => {
    handleFromAmountChange(fromToken.balance.toString());
  };

  const exchangeRate = getExchangeRate(fromToken.symbol, toToken.symbol);

  // Calculate estimated fees and slippage
  const estimatedFee = fromAmount ? parseFloat(fromAmount) * 0.003 : 0;
  const estimatedSlippage =
    fromAmount && slippage
      ? parseFloat(fromAmount) * (parseFloat(slippage) / 100)
      : 0;

  // Calculate minimum received
  const minimumReceived =
    toAmount && estimatedSlippage
      ? (parseFloat(toAmount) - estimatedSlippage).toFixed(6)
      : "0";

  // Calculate USD values
  const fromUsdValue = fromAmount
    ? parseFloat(fromAmount) * fromToken.price
    : 0;
  const toUsdValue = toAmount ? parseFloat(toAmount) * toToken.price : 0;

  // Estimate transaction cost (gas fee)
  const estimatedGasFee = 6.2; // In USD, this would come from an API in a real app

  // Handle the swap action
  const handleSwap = () => {
    // In a real app, this would call a blockchain transaction
    // For demo purposes, we'll just show the success dialog after a short delay
    if (handleTradeAction) {
      handleTradeAction();
    }

    // Simulate transaction processing
    setTimeout(() => {
      // Generate a mock transaction hash
      const mockTxHash =
        "0xf79DcD66e8bC69dae488c3E0F35e069381" +
        Math.floor(Math.random() * 1000000)
          .toString(16)
          .padStart(6, "0");
      setTransactionHash(mockTxHash);
      setShowSuccess(true);
    }, 1500);
  };

  return (
    <Card className="bg-[#1A1B1E] border-none w-full overflow-visible shadow-xl">
      <div className="relative">
        <CardContent className="p-6">
          {!showSuccess ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-[#2A2B2E] text-gray-400 hover:text-green-400"
                  onClick={() => setShowSettings(!showSettings)}
                >
                  <Settings2 className="h-5 w-5" />
                </Button>

                <h2 className="text-xl font-bold text-white">Exchange</h2>

                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-[#2A2B2E] text-gray-400 hover:text-green-400"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              {/* Order Type Selector */}
              <div className="mb-6">
                <div className="bg-[#2A2B2E] rounded-xl p-1 flex">
                  <button
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium ${
                      orderType === "instant"
                        ? "bg-[#353538] text-white"
                        : "text-gray-400 hover:text-gray-300"
                    }`}
                    onClick={() => setOrderType("instant")}
                  >
                    <Zap className="h-4 w-4" />
                    Instant
                  </button>
                  <button
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium ${
                      orderType === "limit"
                        ? "bg-[#353538] text-white"
                        : "text-gray-400 hover:text-gray-300"
                    }`}
                    onClick={() => setOrderType("limit")}
                  >
                    <Clock className="h-4 w-4" />
                    Limit
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {/* From Token */}
                <div className="bg-[#2A2B2E] rounded-2xl p-4">
                  <div className="flex justify-between mb-2">
                    <div className="text-sm text-gray-400">You pay</div>
                    <div className="text-sm text-gray-400">
                      Available:{" "}
                      <span className="text-gray-300">
                        {fromToken.balance.toFixed(4)} {fromToken.symbol}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Popover open={isFromOpen} onOpenChange={setIsFromOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-12 px-3 bg-[#353538] hover:bg-[#404043] rounded-xl flex items-center gap-2"
                        >
                          <span className="text-xl">{fromToken.icon}</span>
                          <span className="text-white font-medium">
                            {fromToken.symbol}
                          </span>
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64 p-0 bg-[#1A1B1E] border-[#353538]">
                        <div className="p-2">
                          <div className="flex items-center border border-[#353538] rounded-md bg-[#2A2B2E]">
                            <Search className="h-4 w-4 ml-2 text-gray-400" />
                            <Input
                              placeholder="Search tokens..."
                              value={fromSearchQuery}
                              onChange={(e) =>
                                setFromSearchQuery(e.target.value)
                              }
                              className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                            {fromSearchQuery && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 p-0 mr-1"
                                onClick={() => setFromSearchQuery("")}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto py-1">
                          {filteredFromTokens.map((token) => (
                            <div
                              key={token.symbol}
                              className={`flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-[#2A2B2E] ${
                                fromToken.symbol === token.symbol
                                  ? "bg-[#2A2B2E]"
                                  : ""
                              }`}
                              onClick={() => {
                                setFromToken(token);
                                setIsFromOpen(false);
                                if (fromAmount) {
                                  handleFromAmountChange(fromAmount);
                                }
                              }}
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-xl">{token.icon}</span>
                                <div className="flex flex-col">
                                  <span className="font-medium text-white">
                                    {token.symbol}
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    {token.name}
                                  </span>
                                </div>
                              </div>
                              <div className="flex flex-col items-end">
                                <span className="text-sm text-gray-300">
                                  {token.balance.toFixed(4)}
                                </span>
                                <span
                                  className={`text-xs ${
                                    token.change24h.startsWith("+")
                                      ? "text-green-400"
                                      : "text-red-400"
                                  }`}
                                >
                                  {token.change24h}
                                </span>
                              </div>
                            </div>
                          ))}
                          {filteredFromTokens.length === 0 && (
                            <div className="px-3 py-4 text-center text-gray-400">
                              No tokens found
                            </div>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>

                    <div className="flex-1 relative">
                      <Input
                        type="text"
                        placeholder="0.0"
                        value={fromAmount}
                        onChange={(e) => handleFromAmountChange(e.target.value)}
                        className="bg-transparent border-none text-right text-xl text-white focus-visible:ring-0 p-0 pr-16"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleMaxClick}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 text-xs px-2 py-1 h-6 bg-[#353538] border-[#454548] text-green-400 hover:bg-[#404043]"
                      >
                        Max
                      </Button>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-400 mt-1">
                    ≈ ${fromUsdValue.toFixed(2)}
                  </div>
                </div>

                {/* Swap Button */}
                <div className="relative flex justify-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -top-2 z-10 rounded-xl bg-[#2A2B2E] border border-[#353538] hover:bg-[#353538]"
                    onClick={handleSwapTokens}
                  >
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </div>

                {/* To Token */}
                <div className="bg-[#2A2B2E] rounded-2xl p-4 mt-4">
                  <div className="flex justify-between mb-2">
                    <div className="text-sm text-gray-400">You receive</div>
                    <div className="text-sm text-gray-400">
                      Balance:{" "}
                      <span className="text-gray-300">
                        {toToken.balance.toFixed(4)} {toToken.symbol}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Popover open={isToOpen} onOpenChange={setIsToOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-12 px-3 bg-[#353538] hover:bg-[#404043] rounded-xl flex items-center gap-2"
                        >
                          <span className="text-xl">{toToken.icon}</span>
                          <span className="text-white font-medium">
                            {toToken.symbol}
                          </span>
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64 p-0 bg-[#1A1B1E] border-[#353538]">
                        <div className="p-2">
                          <div className="flex items-center border border-[#353538] rounded-md bg-[#2A2B2E]">
                            <Search className="h-4 w-4 ml-2 text-gray-400" />
                            <Input
                              placeholder="Search tokens..."
                              value={toSearchQuery}
                              onChange={(e) => setToSearchQuery(e.target.value)}
                              className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                            {toSearchQuery && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 p-0 mr-1"
                                onClick={() => setToSearchQuery("")}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto py-1">
                          {filteredToTokens.map((token) => (
                            <div
                              key={token.symbol}
                              className={`flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-[#2A2B2E] ${
                                toToken.symbol === token.symbol
                                  ? "bg-[#2A2B2E]"
                                  : ""
                              }`}
                              onClick={() => {
                                setToToken(token);
                                setIsToOpen(false);
                                if (fromAmount) {
                                  handleFromAmountChange(fromAmount);
                                }
                              }}
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-xl">{token.icon}</span>
                                <div className="flex flex-col">
                                  <span className="font-medium text-white">
                                    {token.symbol}
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    {token.name}
                                  </span>
                                </div>
                              </div>
                              <div className="flex flex-col items-end">
                                <span className="text-sm text-gray-300">
                                  {token.balance.toFixed(4)}
                                </span>
                                <span
                                  className={`text-xs ${
                                    token.change24h.startsWith("+")
                                      ? "text-green-400"
                                      : "text-red-400"
                                  }`}
                                >
                                  {token.change24h}
                                </span>
                              </div>
                            </div>
                          ))}
                          {filteredToTokens.length === 0 && (
                            <div className="px-3 py-4 text-center text-gray-400">
                              No tokens found
                            </div>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>

                    <Input
                      type="text"
                      placeholder="0.0"
                      value={toAmount}
                      onChange={(e) => handleToAmountChange(e.target.value)}
                      className="bg-transparent border-none text-right text-xl text-white focus-visible:ring-0 p-0 flex-1"
                    />
                  </div>
                  <div className="text-right text-sm text-gray-400 mt-1">
                    ≈ ${toUsdValue.toFixed(2)}
                  </div>
                </div>

                {/* Transaction Details */}
                <div className="bg-[#2A2B2E] rounded-xl p-4 space-y-3">
                  {/* Price Info */}
                  <div className="flex justify-between items-center text-sm">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="text-gray-400 flex items-center gap-1 cursor-help">
                            Price <Info className="h-4 w-4" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-[#1A1B1E] border-[#353538]">
                          <p>Current exchange rate</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <div className="text-gray-300">
                      1 {fromToken.symbol} = {exchangeRate} {toToken.symbol}
                    </div>
                  </div>

                  {/* Recipient Address */}
                  <div className="flex justify-between items-center text-sm">
                    <div className="text-gray-400">Recipient Address</div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-300 text-sm truncate max-w-[180px]">
                        {recipientAddress.substring(0, 12)}...
                        {recipientAddress.substring(
                          recipientAddress.length - 6
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Transaction Cost */}
                  <div className="flex justify-between items-center text-sm">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="text-gray-400 flex items-center gap-1 cursor-help">
                            Transaction cost <Info className="h-4 w-4" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-[#1A1B1E] border-[#353538]">
                          <p>Estimated gas fee for this transaction</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-300">
                        ≈ ${estimatedGasFee.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Slippage Settings */}
                  <div className="flex justify-between items-center text-sm">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="text-gray-400 flex items-center gap-1 cursor-help">
                            Slippage Tolerance <Info className="h-4 w-4" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-[#1A1B1E] border-[#353538]">
                          <p>Maximum price change you're willing to accept</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {["0.1", "0.5", "1.0"].map((value) => (
                          <Button
                            key={value}
                            variant={slippage === value ? "default" : "outline"}
                            size="sm"
                            className={`h-6 px-2 text-xs ${
                              slippage === value
                                ? "bg-green-500 hover:bg-green-600"
                                : "bg-[#353538] border-[#454548] text-gray-300"
                            }`}
                            onClick={() => setSlippage(value)}
                          >
                            {value}%
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Gas on destination */}
                  <div className="flex justify-between items-center text-sm">
                    <div className="text-gray-400">Gas on destination</div>
                    <div className="text-gray-300">{gasOnDestination}</div>
                  </div>

                  {/* Fee */}
                  <div className="flex justify-between items-center text-sm">
                    <div className="text-gray-400">Fee</div>
                    <div className="text-gray-300">{fee}</div>
                  </div>

                  {/* Gas cost */}
                  <div className="flex justify-between items-center text-sm">
                    <div className="text-gray-400">Gas cost</div>
                    <div className="text-gray-300">{gasCost}</div>
                  </div>

                  {/* Estimated time for transfer */}
                  <div className="flex justify-between items-center text-sm">
                    <div className="text-gray-400">
                      Estimated time for transfer
                    </div>
                    <div className="text-gray-300">{estimatedTime}</div>
                  </div>

                  {fromAmount && parseFloat(fromAmount) > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="text-gray-400 flex items-center gap-1 cursor-help">
                              Minimum Received <Info className="h-4 w-4" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="bg-[#1A1B1E] border-[#353538]">
                            <p>
                              Minimum amount you'll receive after slippage (
                              {slippage}%)
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <div className="text-gray-300">
                        {minimumReceived} {toToken.symbol}
                      </div>
                    </div>
                  )}
                </div>

                {/* Swap Button */}
                <Button
                  className="w-full h-14 text-lg font-medium mt-4 bg-green-500 hover:bg-green-600 text-white rounded-xl"
                  onClick={handleSwap}
                >
                  {isAuthenticated ? "Swap now" : "Login to Swap"}
                </Button>
              </div>
            </>
          ) : (
            // Success View (in-component instead of modal)
            <div className="flex flex-col items-center text-center space-y-6 py-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-20 h-20 rounded-full bg-gradient-to-r from-yellow-400 via-green-400 to-green-500 flex items-center justify-center"
              >
                <Check className="h-10 w-10 text-black" />
              </motion.div>
              <div className="space-y-2">
                <h2 className="text-2xl font-medium text-white">
                  Transfer has been completed!
                </h2>
                <p className="text-gray-400">
                  {fromAmount} {fromToken.symbol} → {toAmount} {toToken.symbol}
                </p>
              </div>

              <div className="space-y-4 w-full">
                {/* Transaction Details */}
                <div className="space-y-3 w-full">
                  {/* Transaction Hash */}
                  <div className="bg-[#2A2B2E] rounded-xl p-4">
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span className="text-gray-400">Transaction Hash</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm truncate mr-2">
                        {transactionHash}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-white p-1 h-auto"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Additional Transaction Details */}
                  <div className="bg-[#2A2B2E] rounded-xl p-4 space-y-3">
                    {/* Recipient Address */}
                    <div className="flex justify-between items-center text-sm">
                      <div className="text-gray-400">Recipient Address</div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-300 text-sm truncate max-w-[180px]">
                          {recipientAddress.substring(0, 12)}...
                          {recipientAddress.substring(
                            recipientAddress.length - 6
                          )}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-white p-1 h-auto"
                        >
                          Edit
                        </Button>
                      </div>
                    </div>

                    {/* Slippage */}
                    <div className="flex justify-between items-center text-sm">
                      <div className="text-gray-400">Slippage</div>
                      <div className="text-gray-300">{slippage}%</div>
                    </div>

                    {/* Gas on destination */}
                    <div className="flex justify-between items-center text-sm">
                      <div className="text-gray-400">Gas on destination</div>
                      <div className="text-gray-300">{gasOnDestination}</div>
                    </div>

                    {/* Fee */}
                    <div className="flex justify-between items-center text-sm">
                      <div className="text-gray-400">Fee</div>
                      <div className="text-gray-300">{fee}</div>
                    </div>

                    {/* Gas cost */}
                    <div className="flex justify-between items-center text-sm">
                      <div className="text-gray-400">Gas cost</div>
                      <div className="text-gray-300">{gasCost}</div>
                    </div>

                    {/* Estimated time for transfer */}
                    <div className="flex justify-between items-center text-sm">
                      <div className="text-gray-400">
                        Estimated time for transfer
                      </div>
                      <div className="text-gray-300">{estimatedTime}</div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 w-full">
                  <Button
                    variant="ghost"
                    className="flex-1 text-gray-400 hover:text-white"
                  >
                    View in Explorer <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>

                  <Button
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                    onClick={() => setShowSuccess(false)}
                  >
                    New Swap
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );
};

export default CoinSwap;
