"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ChatbotButton from "@/app/chatbot/components/ChatbotButton";

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
        {children}
        <ChatbotButton />
      </NextThemesProvider>
    </QueryClientProvider>
  );
}
