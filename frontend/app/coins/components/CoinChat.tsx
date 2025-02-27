import { Brain } from "lucide-react";
import { Input } from "@/components/ui/input";

const CoinChat = () => {
  return (
    <div className="space-y-4">
      <div className="h-[400px] bg-black/20 rounded-lg p-4 border border-gray-400/30">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-gray-400" />
          <span className="text-gray-400">AI Assistant</span>
        </div>
        {/* Chat interface */}
        <div className="h-[300px] overflow-y-auto mb-4">
          {/* Chat messages would go here */}
        </div>
        <Input
          placeholder="Ask about trading insights..."
          className="bg-black/40"
        />
      </div>
    </div>
  );
};

export default CoinChat;
