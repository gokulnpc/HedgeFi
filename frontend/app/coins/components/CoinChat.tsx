"use client";

import { useState, useEffect, useRef } from "react";
import {
  Brain,
  Send,
  Loader2,
  Users,
  Activity,
  Droplets,
  Twitter,
  ArrowRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const CoinChat = ({ symbol = "BTC" }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `What would you like to know about ${symbol}?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to the bottom when messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        `Based on current market conditions, ${symbol} is showing bullish momentum with strong support at $0.00120.`,
        `The recent trading volume suggests increasing interest from institutional investors in ${symbol}.`,
        `Technical indicators point to a potential breakout above the $0.00130 resistance level in the next 24-48 hours for ${symbol}.`,
        `I recommend monitoring ${symbol} closely as volatility may increase following the upcoming economic data release.`,
      ];

      const assistantMessage: Message = {
        role: "assistant",
        content: responses[Math.floor(Math.random() * responses.length)],
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleInsightRequest = (insight: string) => {
    const userMessage: Message = {
      role: "user",
      content: `Tell me about ${insight} for ${symbol}`,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, string> = {
        "Holder Analysis": `Current holder analysis shows 65% of ${symbol} tokens are held by long-term investors (>1 year). This suggests strong confidence in the asset's future performance.`,
        "Liquidity Pools": `The largest liquidity pool for ${symbol} is on Uniswap with $1.2M in liquidity. The current APY for liquidity providers is approximately 18.5%.`,
        "Twitter Sentiment": `Twitter sentiment analysis for ${symbol} shows 72% positive mentions in the last 24 hours, with increasing discussion volume (+35% week-over-week).`,
        "Trading Activity": `Recent trading activity shows accumulation by large wallets. In the past 24 hours, wallets holding >10,000 ${symbol} have increased their positions by 2.3%.`,
      };

      const assistantMessage: Message = {
        role: "assistant",
        content: responses[insight] || `Let me analyze ${symbol} for you...`,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 p-3 border-b bg-black/20 rounded-t-lg"></div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-2 rounded-lg text-sm ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white self-end"
                    : "bg-gray-800 text-gray-200 self-start"
                } max-w-[80%]`}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Insight Buttons */}
      <div className="px-3 pt-2">
        <div className="grid grid-cols-2 gap-2 mb-2">
          <Button
            variant="outline"
            className="bg-black/40 border-gray-400/30 text-gray-300 hover:bg-black/60 hover:text-white flex items-center justify-start text-xs sm:text-sm"
            onClick={() => handleInsightRequest("Holder Analysis")}
          >
            <Users className="mr-1 h-4 w-4 flex-shrink-0" />
            <span className="truncate">Holder Analysis</span>
          </Button>
          <Button
            variant="outline"
            className="bg-black/40 border-gray-400/30 text-gray-300 hover:bg-black/60 hover:text-white flex items-center justify-start text-xs sm:text-sm"
            onClick={() => handleInsightRequest("Liquidity Pools")}
          >
            <Droplets className="mr-1 h-4 w-4 flex-shrink-0" />
            <span className="truncate">Liquidity Pools</span>
          </Button>
          <Button
            variant="outline"
            className="bg-black/40 border-gray-400/30 text-gray-300 hover:bg-black/60 hover:text-white flex items-center justify-start text-xs sm:text-sm"
            onClick={() => handleInsightRequest("Twitter Sentiment")}
          >
            <Twitter className="mr-1 h-4 w-4 flex-shrink-0" />
            <span className="truncate">Twitter Sentiment</span>
          </Button>
          <Button
            variant="outline"
            className="bg-black/40 border-gray-400/30 text-gray-300 hover:bg-black/60 hover:text-white flex items-center justify-start text-xs sm:text-sm"
            onClick={() => handleInsightRequest("Trading Activity")}
          >
            <Activity className="mr-1 h-4 w-4 flex-shrink-0" />
            <span className="truncate">Trading Activity</span>
          </Button>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-3 border-t flex items-center gap-2 bg-black/30 rounded-b-lg">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about trading insights..."
          className="flex-1 bg-black/40 border-none focus:ring-0"
          disabled={isLoading}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
        />
        <Button
          size="icon"
          onClick={handleSendMessage}
          disabled={isLoading || !input.trim()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Send className="w-5 h-5 text-white" />
        </Button>
      </div>
    </div>
  );
};

export default CoinChat;
