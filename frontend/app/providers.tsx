"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ChatbotButton from "@/app/chatbot/components/ChatbotButton";
import { WalletProvider } from "./providers/WalletProvider";
import { WagmiProvider, createConfig, http } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";

// Configure custom Aurora Testnet
const auroraTestnet = {
  id: 1313161555,
  name: "Aurora Testnet",
  network: "aurora-testnet",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: ["https://testnet.aurora.dev"] },
    default: { http: ["https://testnet.aurora.dev"] },
  },
  blockExplorers: {
    default: {
      name: "Aurora Explorer",
      url: "https://explorer.testnet.aurora.dev",
    },
  },
  testnet: true,
};

// Create wagmi config
const config = createConfig({
  chains: [auroraTestnet],
  transports: {
    [auroraTestnet.id]: http(),
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <NextThemesProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <WalletProvider>
              {children}
              <ChatbotButton />
            </WalletProvider>
          </NextThemesProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
