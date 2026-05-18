import { Bot } from "lucide-react-native";
import { Text, View } from "react-native";

import type { ChatMessage } from "./types";

type ChatBubbleProps = {
  message: ChatMessage;
};

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <View className="mb-4 flex-row justify-end px-4">
        <View className="max-w-[82%] rounded-2xl rounded-br-sm bg-[#f59e0b] px-4 py-3">
          <Text className="text-[15px] leading-5 text-white">
            {message.content}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="mb-4 flex-row items-end px-4">
      <View className="mr-2 w-6 items-center pb-1">
        <Bot color="#737373" size={18} strokeWidth={2} />
      </View>
      <View className="max-w-[82%] rounded-2xl rounded-bl-sm bg-[#262626] px-4 py-3">
        <Text className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-neutral-500">
          AI
        </Text>
        <Text className="text-[15px] leading-5 text-white">{message.content}</Text>
      </View>
    </View>
  );
}
