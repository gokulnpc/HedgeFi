"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import type { NewsItem } from "@/app/types/news";

// const news = [
//   {
//     source: "Wired",
//     publishedAt: "2/10/2025",
//     title:
//       "The Untold Story of a Crypto Crimefighter's Descent Into Nigerian Prison",
//     author: "Andy Greenberg",
//     image:
//       "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-23%20at%2002.57.37-piFu7D49oBzLogWJtQyt4WaDjtHPQs.png",
//   },
//   {
//     source: "Gizmodo.com",
//     publishedAt: "1/22/20",
//     title:
//       "Fresh Off Launching a Memecoin, Trump Tells SEC to Create Crypto Regulations",
//     author: "AJ Dellinger",
//     image:
//       "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-23%20at%2002.57.37-piFu7D49oBzLogWJtQyt4WaDjtHPQs.png",
//   },
//   {
//     source: "The Verge",
//     publishedAt: "1/21/2025",
//     title: "Trump pardons Silk Road operator Ross Ulbricht",
//     author: "Mitchell Clark",
//     image:
//       "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-23%20at%2002.57.37-piFu7D49oBzLogWJtQyt4WaDjtHPQs.png",
//   },
// ];

export function MemeNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  useEffect(() => {
    const fetchNews = async () => {
      const response = await fetch("/api/news");
      const data = await response.json();
      setNews(data);
    };
    fetchNews();
  }, []);

  return (
    <div className="mt-6 space-y-6">
      <h1 className="text-4xl font-bold">
        Meme{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
          Highlights
        </span>
      </h1>

      {/* Featured Article */}
      <div className="relative h-48 mb-6 overflow-hidden rounded-lg">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-23%20at%2002.57.37-piFu7D49oBzLogWJtQyt4WaDjtHPQs.png"
          alt="This week in Meme Coins"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 to-transparent">
          <h3 className="text-lg font-semibold text-white">
            This week in Meme Coins
          </h3>
          <p className="text-sm text-gray-200">
            BSC Bumps, (Does) Portnoy Not Like Us?
          </p>
        </div>
      </div>

      {/* News List */}
      <div className="space-y-4">
        {news.map((item, index) => (
          <div
            key={index}
            className="flex gap-3 p-3 transition-colors rounded-lg cursor-pointer hover:bg-white/5"
          >
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-400">
                  {item.source.name}
                </span>
                <span className="text-xs text-gray-500">
                  {item.publishedAt}
                </span>
              </div>
              <h3 className="mb-1 text-sm font-medium">{item.title}</h3>
              <p className="text-xs text-blue-400">{item.author}</p>
            </div>
            <div className="relative flex-shrink-0 w-16 h-16 overflow-hidden rounded-md">
              <Image
                src={item.urlToImage || "/placeholder.svg"}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
