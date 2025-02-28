import { create } from "zustand";
import { Message } from "@/types/chat";

interface ChatState {
  messages: Message[];
  isThinking: boolean;
  addMessage: (message: Message) => void;
  setIsThinking: (isThinking: boolean) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isThinking: false,
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
  setIsThinking: (isThinking) => set({ isThinking }),
  clearMessages: () => set({ messages: [] }),
}));
