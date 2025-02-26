"use client";
import Image from "next/image";

const news = [
  {
    source: "Wired",
    date: "2/10/2025",
    title:
      "The Untold Story of a Crypto Crimefighter's Descent Into Nigerian Prison",
    author: "Andy Greenberg",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-23%20at%2002.57.37-piFu7D49oBzLogWJtQyt4WaDjtHPQs.png",
  },
  {
    source: "Gizmodo.com",
    date: "1/22/20",
    title:
      "Fresh Off Launching a Memecoin, Trump Tells SEC to Create Crypto Regulations",
    author: "AJ Dellinger",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-23%20at%2002.57.37-piFu7D49oBzLogWJtQyt4WaDjtHPQs.png",
  },
  {
    source: "The Verge",
    date: "1/21/2025",
    title: "Trump pardons Silk Road operator Ross Ulbricht",
    author: "Mitchell Clark",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-23%20at%2002.57.37-piFu7D49oBzLogWJtQyt4WaDjtHPQs.png",
  },
];

export function MemeNews() {
  return (
    <div className="space-y-6 mt-6">
      <h1 className="text-4xl font-bold">
        Meme{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
          Highlights
        </span>
      </h1>

      {/* Featured Article */}
      <div className="relative h-48 rounded-lg overflow-hidden mb-6">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-23%20at%2002.57.37-piFu7D49oBzLogWJtQyt4WaDjtHPQs.png"
          alt="This week in Meme Coins"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex flex-col justify-end">
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
            className="flex gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-400">{item.source}</span>
                <span className="text-xs text-gray-500">{item.date}</span>
              </div>
              <h3 className="text-sm font-medium mb-1">{item.title}</h3>
              <p className="text-xs text-blue-400">{item.author}</p>
            </div>
            <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
              <Image
                src={item.image || "/placeholder.svg"}
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
