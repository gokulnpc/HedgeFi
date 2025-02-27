"use client";

import { useState, useEffect, useRef } from "react";
import { Brain, Send, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const CoinChat = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! Ask me anything about trading.", isBot: true },
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

    const userMessage = { text: input, isBot: false };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: "Here's some insight about DOGE...", isBot: true },
      ]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 p-3 border-b bg-black/20 rounded-t-lg">
        <Brain className="w-5 h-5 text-gray-400" />
        <span className="text-gray-400 font-semibold">Hedge Bot</span>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg text-sm ${
              msg.isBot
                ? "bg-gray-800 text-gray-200 self-start"
                : "bg-blue-600 text-white self-end"
            } max-w-[80%]`}
          >
            {msg.text}
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        )}
        <div ref={chatEndRef} />
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
