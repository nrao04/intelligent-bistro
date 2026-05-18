import { Bot } from "lucide-react-native";
import { Text, View } from "react-native";

import { colors, spacing, typography } from "../../lib/theme";
import type { ChatMessage } from "./types";

type ChatBubbleProps = {
  message: ChatMessage;
};

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <View
        style={{
          marginBottom: spacing.lg,
          flexDirection: "row",
          justifyContent: "flex-end",
          paddingHorizontal: spacing.lg,
        }}
      >
        <View
          style={{
            maxWidth: "82%",
            borderRadius: spacing.lg,
            borderBottomRightRadius: spacing.xs,
            backgroundColor: colors.accent,
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
          }}
        >
          <Text style={[typography.body, { color: colors.iconOnAccent }]}>
            {message.content}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View
      style={{
        marginBottom: spacing.lg,
        flexDirection: "row",
        alignItems: "flex-end",
        paddingHorizontal: spacing.lg,
      }}
    >
      <View
        style={{
          marginRight: spacing.sm,
          width: spacing.xl,
          alignItems: "center",
          paddingBottom: spacing.xs,
        }}
      >
        <Bot color={colors.textMuted} size={18} strokeWidth={2} />
      </View>
      <View
        style={{
          maxWidth: "82%",
          borderRadius: spacing.lg,
          borderBottomLeftRadius: spacing.xs,
          backgroundColor: colors.surfaceRaised,
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
        }}
      >
        <Text
          style={[
            typography.label,
            {
              color: colors.textMuted,
              marginBottom: spacing.xs,
              textTransform: "uppercase",
              letterSpacing: 0.8,
            },
          ]}
        >
          AI
        </Text>
        <Text style={[typography.body, { color: colors.textPrimary }]}>
          {message.content}
        </Text>
      </View>
    </View>
  );
}
