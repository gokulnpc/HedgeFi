"use client";

import { Suspense } from "react";
import { AppLayout } from "@/app/components/app-layout";
import AIChatbot from "./components/AIChatbot";
import { Loader2 } from "lucide-react";

export default function ChatbotPage() {
  return (
    <AppLayout showFooter={false}>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        }
      >
        <AIChatbot />
      </Suspense>
    </AppLayout>
  );
}
