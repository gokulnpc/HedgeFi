import { Message } from "@/types/chat";

const DEFAULT_AGENT_ID = "d789f671-fbc9-08d1-aa63-25f8e4be0f21";

export async function sendChatMessage(
  message: string,
  file?: File | null
): Promise<Message> {
  try {
    const formData = new FormData();
    formData.append("message", message);
    formData.append("agentId", DEFAULT_AGENT_ID);

    if (file) {
      formData.append("file", file);
    }

    const response = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        message,
        agentId: DEFAULT_AGENT_ID,
        file: file
          ? {
              name: file.name,
              type: file.type,
              // We can't send the actual file in JSON, but we'll handle this in a real implementation
            }
          : null,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    // Convert the API response to our Message format
    return {
      id: Date.now().toString(),
      content: data.response[0].content,
      isBot: true,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}
