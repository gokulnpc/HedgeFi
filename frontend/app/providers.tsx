"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ChatbotButton from "@/app/chatbot/components/ChatbotButton";
import { WalletProvider } from "./providers/WalletProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}
