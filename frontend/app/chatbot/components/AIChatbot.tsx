"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Bot,
  Brain,
  Pencil,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useChatStore } from "../store";
import { Message } from "@/types/chat";
import ThinkingMessage from "./ThinkingMessage";
import { sendChatMessage } from "../service";

// Map of icon components
const icons = {
  Fish,
  ArrowLeftRight,
  LineChart,
  Newspaper,
};

interface ActionType {
  iconName: keyof typeof icons;
  label: string;
  prompt: string;
}

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

export default function AIChatbot() {
  const { messages, addMessage, isThinking, setIsThinking, clearMessages } =
    useChatStore();

  const [input, setInput] = useState("");
  const [hasInteracted, setHasInteracted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showFollowUpActions, setShowFollowUpActions] = useState(false);
  const searchParams = useSearchParams();

  // Check if we need to start a new chat
  useEffect(() => {
    if (searchParams.get("new") === "true") {
      startNewChat();
    }
  }, [searchParams.get("new"), searchParams.get("t")]);

  // Follow-up quick actions based on previous interaction
  const followUpActions = [
    {
      label: "Quick Swap",
      prompt: "Help me swap these tokens on the best DEX with lowest fees",
      icon: <ArrowLeftRight className="h-4 w-4" />,
    },
    {
      label: "Latest News",
      prompt: "Show me the latest news about these tokens",
      icon: <Newspaper className="h-4 w-4" />,
    },
    {
      label: "Price Alert",
      prompt: "Set a price alert for these tokens",
      icon: <LineChart className="h-4 w-4" />,
    },
  ];

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (input.length > 0) {
      scrollToBottom();
    }
  }, [input, scrollToBottom]);

  const handleSend = async (content: string, file?: File) => {
    if ((!content.trim() && !file) || isThinking) return;

    setHasInteracted(true);

    // Create user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content,
      isBot: false,
      timestamp: new Date().toISOString(),
    };

    // Add file if present
    if (file) {
      // In a real app, you would upload the file to a server and get a URL
      userMessage.file = {
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type,
      };
    }

    // Convert to ContentWithUser and add to store
    addMessage({
      id: userMessage.id,
      content: userMessage.content,
      isBot: false,
      timestamp: userMessage.timestamp,
    });

    setInput("");

    try {
      // Send message to API - the service will handle adding the bot message to the store
      await sendChatMessage(content, file);

      // Show follow-up actions after bot response
      setShowFollowUpActions(true);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleQuickAction = (prompt: string) => {
    setHasInteracted(true);
    setShowFollowUpActions(false); // Reset follow-up actions when starting a new conversation
    handleSend(prompt);
  };

  // Function to start a new chat
  const startNewChat = () => {
    clearMessages();
    setInput("");
    setHasInteracted(false);
    setShowFollowUpActions(false);
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

    // In a real app, you would update the message in the store
    // For now, we'll just update the local state
    const updatedMessages = messages.map((msg) =>
      msg.id === editingMessageId ? { ...msg, content: editingContent } : msg
    );

    // Update the store with the new messages
    clearMessages();
    updatedMessages.forEach((msg) => addMessage(msg));

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

  const handleSpeak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const handleRegenerate = async (messageId: string) => {
    setIsThinking(true);

    // Find the message and its index
    const messageIndex = messages.findIndex((m) => m.id === messageId);
    if (messageIndex === -1) return;

    // Get the previous user message
    const previousUserMessage = messages
      .slice(0, messageIndex)
      .reverse()
      .find((m) => !m.isBot);
    if (!previousUserMessage) return;

    // Remove the old bot message and all messages after it
    const newMessages = messages.slice(0, messageIndex);

    // Update the store with the new messages
    clearMessages();
    newMessages.forEach((msg) => addMessage(msg));

    try {
      // Regenerate response
      const botMessage = await sendChatMessage(previousUserMessage.content);
      addMessage(botMessage);
    } catch (error) {
      console.error("Error regenerating message:", error);
      // Add error message
      addMessage({
        id: Date.now().toString(),
        content: "Sorry, there was an error regenerating the response.",
        isBot: true,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="ml-10 mr-10 mx-auto flex flex-col h-[calc(100vh-5rem)] max-h-[calc(100vh-5rem)] pt-12">
      {/* Welcome Section */}
      <AnimatePresence>
        {!hasInteracted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-8 space-y-6 mt-4"
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
              I'm your HedgeFi AI assistant. I can help you analyze meme coins,
              track whale activity, and spot potential opportunities.
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
                  className="p-4 cursor-pointer bg-[#2A2B2E] border-[#353538] text-gray-300 hover:bg-[#353538] hover:text-white transition-colors"
                  onClick={() => handleQuickAction(action.prompt)}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">{action.label}</span>
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
        className="flex-1 overflow-y-auto p-4 space-y-4 mt-2"
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
                <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
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
        {isThinking && <ThinkingMessage />}
        <div ref={messagesEndRef} />
      </motion.div>

      {/* Follow-up Quick Actions */}
      <AnimatePresence>
        {showFollowUpActions && hasInteracted && messages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="px-4 py-3"
          >
            <div className="flex justify-center gap-4">
              {followUpActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="default"
                  className="bg-[#2A2B2E] border-[#353538] text-gray-300 hover:bg-[#353538] hover:text-white flex items-center justify-start text-sm gap-2 px-6 py-2 min-w-[160px]"
                  onClick={() => handleSend(action.prompt)}
                >
                  <span className="text-primary">{action.icon}</span>
                  <span>{action.label}</span>
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className="pt-4 mt-auto">
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
              disabled={!input.trim() || isThinking}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
