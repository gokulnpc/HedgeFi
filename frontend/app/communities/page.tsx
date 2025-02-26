"use client"

import { motion } from "framer-motion"
import { SiteHeader } from "../components/site-header"
import { Footer } from "../components/footer"
import GridBackground from "../components/GridBackground"
import { CommunityFeed } from "./community-feed"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Paperclip, BarChart2 } from "lucide-react"
import { useState } from "react"
import { CommunityFilters } from "./community-filters"
import { mockFeedItems } from "./data"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function CommunitiesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState<"all" | "bets" | "coins" | "discussions">("all")

  // Filter feed items based on search and filter
  const filteredFeedItems = mockFeedItems.filter(
    (item) =>
      (item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.author.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedFilter === "all" || item.type === selectedFilter),
  )

  return (
    <div className="relative flex min-h-screen flex-col">
      <GridBackground />
      <SiteHeader />
      <main className="flex-1 pt-24">
        <div className="container max-w-3xl mx-auto px-4">
          {/* Post Creation Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Card className="p-4 border-white/10 bg-black/60 backdrop-blur-xl">
              <div className="flex gap-3">
                <Avatar>
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-4">
                  <Input
                    placeholder="What's on your mind?"
                    className="bg-transparent border-none text-lg placeholder:text-gray-500 focus-visible:ring-0 p-0"
                  />
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="text-gray-400 border-white/10">
                      <Paperclip className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                    <Button variant="outline" size="sm" className="text-gray-400 border-white/10">
                      <BarChart2 className="h-4 w-4 mr-2" />
                      Poll
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Filters */}
          <div className="mb-6">
            <CommunityFilters activeFilter={selectedFilter} onFilterChange={setSelectedFilter} />
          </div>

          {/* Feed */}
          <CommunityFeed items={filteredFeedItems} />
        </div>
      </main>
      <Footer />
    </div>
  )
}

