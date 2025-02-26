"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { MessageCircle, X, Send, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChatMessage } from "./ChatMessage"
import { cn } from "@/lib/utils"

interface Message {
  text: string
  isBot: boolean
  timestamp: string
}

interface ChatCompletionChoice {
  message: {
    content: string
    role: string
  }
  finish_reason: string
  index: number
}

interface ChatCompletionResponse {
  id: string
  choices: ChatCompletionChoice[]
  created: number
  model: string
  object: string
}

const formatBotResponse = (text: string): string => {
  const formattedText = text
    .replace(/•/g, "\n•")
    .replace(/(\d+\.\s)/g, "\n$1")
    .replace(/(\*\*.*?\*\*)/g, "\n$1\n")

  return formattedText.replace(/\n{3,}/g, "\n\n").trim()
}

const getCurrentTime = () => {
  return new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hi! I'm your HedgeFi assistant. I can help you analyze meme coins, spot trends, and identify potential rugs. What would you like to know?",
      isBot: true,
      timestamp: getCurrentTime(),
    },
  ])
  const [input, setInput] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Reset chat when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = {
      text: input,
      isBot: false,
      timestamp: getCurrentTime(),
    }
    setMessages((prevMessages) => [...prevMessages, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Replace this with your actual API call
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()
      const botResponseText = formatBotResponse(data.message || "Sorry, I didn't understand that.")

      const botMessage: Message = {
        text: botResponseText,
        isBot: true,
        timestamp: getCurrentTime(),
      }
      setMessages((prevMessages) => [...prevMessages, botMessage])
    } catch (error) {
      console.error("Error:", error)
      const errorMessage: Message = {
        text: "Sorry, I encountered an error. Please try again.",
        isBot: true,
        timestamp: getCurrentTime(),
      }
      setMessages((prevMessages) => [...prevMessages, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700"
            >
              <MessageCircle className="h-5 w-5" />
              <span>Need Help?</span>
            </Button>
          </motion.div>
        )}

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="w-96 h-[500px] bg-background/95 backdrop-blur-xl rounded-xl border shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-blue-500" />
                <span className="font-medium">HedgeFi Assistant</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 rounded-full">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, index) => (
                <ChatMessage
                  key={index}
                  text={msg.text}
                  isBot={msg.isBot}
                  timestamp={msg.timestamp}
                  name={msg.isBot ? "HedgeFi" : "You"}
                  avatar={msg.isBot ? "/hedgefi-bot.png" : undefined}
                />
              ))}
              {isLoading && (
                <div className="flex justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              )}
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t">
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about meme coins..."
                  className={cn("flex-1", isLoading && "opacity-50 cursor-not-allowed")}
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={isLoading}
                  className={cn(
                    "bg-gradient-to-r from-blue-600 to-blue-700",
                    isLoading && "opacity-50 cursor-not-allowed",
                  )}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

