"use client";

import type React from "react";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppLayout } from "../components/app-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Fish,
  ArrowLeftRight,
  LineChart,
  Newspaper,
  Send,
  Copy,
  Volume2,
  RefreshCw,
  Globe,
  Mic,
  Loader2,
  Bot,
  Brain,
  Pencil,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: string;
  file?: {
    name: string;
    url: string;
    type: string;
  };
}

interface ActionType {
  iconName: keyof typeof icons;
  label: string;
  prompt: string;
}

// Map of icon components
const icons = {
  Fish,
  ArrowLeftRight,
  LineChart,
  Newspaper,
};

const quickActions: ActionType[] = [
  {
    iconName: "Fish",
    label: "Whale Activity",
    prompt: "Show me recent whale activity. What are they dumping and buying?",
  },
  {
    iconName: "ArrowLeftRight",
    label: "Compare Coins",
    prompt:
      "Compare the top trending meme coins. Show key metrics and differences.",
  },
  {
    iconName: "LineChart",
    label: "Stalker Mode",
    prompt: "Which tokens have strong holders but low volume?",
  },
  {
    iconName: "Newspaper",
    label: "News Scanner",
    prompt:
      "Show me the latest news and social media sentiment about meme coins.",
  },
];

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  const handleSend = async (content: string, file?: File) => {
    if ((!content.trim() && !file) || isLoading) return;

    setHasInteracted(true); // Add this line to hide welcome section

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isBot: false,
      timestamp: new Date().toLocaleTimeString(),
    };

    if (file) {
      // In a real app, you would upload the file to a server and get a URL
      userMessage.file = {
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type,
      };
    }

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "This is a placeholder response. The actual AI integration will be implemented here.",
        isBot: true,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleQuickAction = (prompt: string) => {
    setHasInteracted(true); // Add this line
    handleSend(prompt);
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const handleEdit = (message: Message) => {
    setEditingMessageId(message.id);
    setEditingContent(message.content);
  };

  const handleSaveEdit = () => {
    if (!editingMessageId) return;

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === editingMessageId ? { ...msg, content: editingContent } : msg
      )
    );
    setEditingMessageId(null);
    setEditingContent("");
  };

  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result) => result.transcript)
        .join("");

      setInput(transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleSend(`Uploaded file: ${file.name}`, file);
    }
  };

  // Add this function after the handleFileUpload function
  const handleSpeak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  // Add this function after the handleSpeak function
  const handleRegenerate = async (messageId: string) => {
    setIsLoading(true);

    // Find the message and its index
    const messageIndex = messages.findIndex((m) => m.id === messageId);
    if (messageIndex === -1) return;

    // Get the previous user message
    const previousUserMessage = messages
      .slice(0, messageIndex)
      .reverse()
      .find((m) => !m.isBot);
    if (!previousUserMessage) return;

    // Remove the old bot message
    const newMessages = messages.slice(0, messageIndex);
    setMessages(newMessages);

    // Simulate API call - replace with actual AI integration
    setTimeout(() => {
      const botMessage: Message = {
        id: Date.now().toString(),
        content:
          "This is a regenerated response. The actual AI integration will provide different responses.",
        isBot: true,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <AppLayout showFooter={false}>
      <div className="container max-w-4xl mx-auto h-[calc(100vh-5rem)] flex flex-col">
        {/* Welcome Section */}
        <AnimatePresence>
          {!hasInteracted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12 space-y-6"
            >
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Brain className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold">
                Where Knowledge{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
                  Begins
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                I'm your HedgeFi AI assistant. I can help you analyze meme
                coins, track whale activity, and spot potential opportunities.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Actions */}
        <AnimatePresence>
          {!hasInteracted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4"
            >
              {quickActions.map((action) => {
                const Icon = icons[action.iconName];
                return (
                  <Card
                    key={action.label}
                    className="p-4 cursor-pointer hover:bg-primary/5 transition-colors border-primary/20"
                    onClick={() => handleQuickAction(action.prompt)}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">
                        {action.label}
                      </span>
                    </div>
                  </Card>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Area */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-3",
                message.isBot ? "items-start" : "items-start flex-row-reverse"
              )}
            >
              <Avatar>
                {message.isBot ? (
                  <>
                    <AvatarImage src="/hedgefi-bot.png" />
                    <AvatarFallback>
                      <Bot className="h-5 w-5" />
                    </AvatarFallback>
                  </>
                ) : (
                  <>
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>U</AvatarFallback>
                  </>
                )}
              </Avatar>
              <div
                className={cn(
                  "flex flex-col gap-2",
                  message.isBot ? "items-start" : "items-end"
                )}
              >
                {editingMessageId === message.id ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      className="min-w-[300px]"
                      autoFocus
                    />
                    <Button size="sm" onClick={handleSaveEdit}>
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingMessageId(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div
                    className={cn(
                      "rounded-lg px-4 py-2 max-w-[80%]",
                      message.isBot
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-primary text-primary-foreground"
                    )}
                  >
                    <p className="text-sm">{message.content}</p>
                    {message.file && (
                      <div className="mt-2 p-2 bg-background/10 rounded flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        <a
                          href={message.file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm underline"
                        >
                          {message.file.name}
                        </a>
                      </div>
                    )}
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{message.timestamp}</span>
                  {message.isBot ? (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleCopy(message.content)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleSpeak(message.content)}
                      >
                        <Volume2 className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleRegenerate(message.id)}
                      >
                        <RefreshCw className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleCopy(message.content)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleEdit(message)}
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <div className="flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}
          <div ref={messagesEndRef} />
        </motion.div>

        {/* Input Area */}
        <div className="p-4">
          <div className="relative flex items-center">
            <div className="absolute left-2 flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => fileInputRef.current?.click()}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx,.txt"
              />
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Globe className="h-4 w-4" />
              </Button>
            </div>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(input);
                }
              }}
              placeholder="Ask me anything..."
              className="pl-20 pr-24"
            />
            <div className="absolute right-2 flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className={cn("h-8 w-8", isListening && "text-red-500")}
                onClick={handleVoiceInput}
              >
                <Mic className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                className="h-8 w-8"
                onClick={() => handleSend(input)}
                disabled={!input.trim() || isLoading}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
