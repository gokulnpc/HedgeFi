import { apiClient } from "../api";
import { useChatStore, ContentWithUser } from "../stores/chatStore";
import type { UUID } from "@/types/chat";

export async function sendChatMessage(
  agentId: UUID,
  message: string,
  file?: File | null
) {
  try {
    // Add user message to the store
    const userMessage = {
      id: `user-${Date.now()}`,
      type: "text",
      text: message,
      content: message,
      user: "user",
      createdAt: Date.now(),
      timestamp: Date.now(),
    };

    // Add thinking message to the store
    const thinkingMessage = {
      id: `thinking-${Date.now()}`,
      type: "text",
      text: "Cooking up my response...",
      content: "Cooking up my response...",
      user: "assistant",
      createdAt: Date.now() + 1,
      timestamp: Date.now() + 1,
      isLoading: true,
    };

    useChatStore.getState().addMessage(userMessage);
    useChatStore.getState().addMessage(thinkingMessage);

    // Send message to API
    const response = await apiClient.sendMessage(agentId, message, file);

    // Remove thinking message and add response
    const filteredMessages = useChatStore
      .getState()
      .messages.filter((msg) => !msg.isLoading);

    useChatStore.setState({
      messages: [
        ...filteredMessages,
        ...response.map((msg: ContentWithUser) => ({
          ...msg,
          createdAt: Date.now(),
        })),
      ],
    });

    return response;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}
