import { create } from "zustand";
import type { Content } from "@/types/chat";

type ExtraContentFields = {
  user: string;
  createdAt: number;
  isLoading?: boolean;
};

export type ContentWithUser = Content & ExtraContentFields;

interface ChatState {
  messages: ContentWithUser[];
  addMessage: (message: ContentWithUser) => void;
  addMessages: (messages: ContentWithUser[]) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  addMessage: (message: ContentWithUser) =>
    set((state: ChatState) => ({
      messages: [...state.messages, message],
    })),
  addMessages: (newMessages: ContentWithUser[]) =>
    set((state: ChatState) => ({
      messages: [...state.messages, ...newMessages],
    })),
  clearMessages: () => set({ messages: [] }),
}));
