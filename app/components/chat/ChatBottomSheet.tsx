import {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { ArrowUp, X } from "lucide-react-native";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ComponentRef,
} from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { useCart } from "../../context/CartContext";
import { sendChatMessage } from "../../lib/api";
import { colors, spacing, springSheet, typography } from "../../lib/theme";
import { menuItems } from "@shared/menuItems";

import { ChatBubble } from "./ChatBubble";
import { SuggestionChips } from "./SuggestionChips";
import { TypingIndicator } from "./TypingIndicator";
import type { ChatMessage } from "./types";

type ChatBottomSheetProps = {
  onMessageCountChange?: (count: number) => void;
};

function createMessageId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const ChatBottomSheet = forwardRef<
  BottomSheetModal,
  ChatBottomSheetProps
>(function ChatBottomSheet({ onMessageCountChange }, ref) {
  const sheetRef = useRef<BottomSheetModal>(null);
  const inputRef = useRef<ComponentRef<typeof BottomSheetTextInput>>(null);

  useImperativeHandle(ref, () => sheetRef.current as BottomSheetModal);

  const { items, applyAIActions } = useCart();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  const snapPoints = useMemo(() => ["85%"], []);

  const showSuggestions = messages.length === 0 && !isSending;

  useEffect(() => {
    onMessageCountChange?.(messages.length);
  }, [messages.length, onMessageCountChange]);

  const renderBackdrop = useCallback(
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.7}
        pressBehavior="close"
      />
    ),
    []
  );

  const handleSheetChange = useCallback((index: number) => {
    if (index >= 0) {
      setTimeout(() => inputRef.current?.focus(), 280);
    }
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isSending) return;

      const userMessage: ChatMessage = {
        id: createMessageId(),
        role: "user",
        content: trimmed,
      };

      setMessages((current) => [userMessage, ...current]);
      setInput("");
      setIsSending(true);

      try {
        const { reply, actions } = await sendChatMessage(
          trimmed,
          items,
          menuItems
        );

        applyAIActions(actions);

        const assistantMessage: ChatMessage = {
          id: createMessageId(),
          role: "assistant",
          content: reply,
        };

        setMessages((current) => [assistantMessage, ...current]);
      } catch (error) {
        const assistantMessage: ChatMessage = {
          id: createMessageId(),
          role: "assistant",
          content:
            error instanceof Error
              ? error.message
              : "Something went wrong while talking to the assistant.",
        };

        setMessages((current) => [assistantMessage, ...current]);
      } finally {
        setIsSending(false);
      }
    },
    [applyAIActions, isSending, items]
  );

  const handleSend = useCallback(() => {
    sendMessage(input);
  }, [input, sendMessage]);

  const renderItem = useCallback(
    ({ item }: { item: ChatMessage }) => <ChatBubble message={item} />,
    []
  );

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose
      animationConfigs={springSheet}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: colors.base }}
      handleIndicatorStyle={{
        backgroundColor: colors.textMuted,
        width: spacing.xxl + spacing.sm,
      }}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      onChange={handleSheetChange}
    >
      <View style={{ flex: 1, backgroundColor: colors.base }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
            paddingHorizontal: spacing.lg,
            paddingBottom: spacing.md,
            paddingTop: spacing.xs,
          }}
        >
          <Text style={[typography.title, { color: colors.textPrimary }]}>
            AI Assistant
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close assistant"
            onPress={() => sheetRef.current?.dismiss()}
            style={{ padding: spacing.sm }}
          >
            <X color={colors.textSecondary} size={22} strokeWidth={2} />
          </Pressable>
        </View>

        <BottomSheetFlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          inverted
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: spacing.md,
            paddingBottom: spacing.sm,
          }}
          ListHeaderComponent={isSending ? <TypingIndicator /> : null}
        />

        {showSuggestions ? (
          <View style={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.md }}>
            <Text
              style={[typography.title, { color: colors.textPrimary, marginBottom: spacing.xs }]}
            >
              How can I help?
            </Text>
            <Text
              style={[typography.caption, { color: colors.textSecondary, marginBottom: spacing.lg }]}
            >
              Ask me to recommend dishes, build a meal, or update your cart.
            </Text>
            <SuggestionChips onSelect={sendMessage} />
          </View>
        ) : null}

        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: colors.border,
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.md,
            paddingBottom: spacing.md,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "flex-end", gap: spacing.sm }}>
            <BottomSheetTextInput
              ref={inputRef}
              value={input}
              onChangeText={setInput}
              editable={!isSending}
              multiline
              maxLength={500}
              placeholder="Message the assistant..."
              placeholderTextColor={colors.textMuted}
              accessibilityLabel="Message to the AI assistant"
              onSubmitEditing={handleSend}
              returnKeyType="send"
              style={{
                flex: 1,
                maxHeight: spacing.xxl + spacing.xxl + spacing.lg,
                minHeight: spacing.xxl + spacing.lg,
                borderRadius: spacing.md,
                borderWidth: 1,
                borderColor: colors.borderMuted,
                backgroundColor: colors.surface,
                color: colors.textPrimary,
                fontSize: typography.body.fontSize,
                paddingHorizontal: spacing.lg,
                paddingVertical: spacing.md,
              }}
            />

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Send message"
              disabled={isSending || !input.trim()}
              onPress={handleSend}
              style={{
                height: spacing.xl + spacing.md,
                width: spacing.xl + spacing.md,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: spacing.xl + spacing.md,
                backgroundColor:
                  isSending || !input.trim()
                    ? `${colors.accentMuted}80`
                    : colors.accent,
              }}
            >
              {isSending ? (
                <ActivityIndicator color={colors.iconOnAccent} size="small" />
              ) : (
                <ArrowUp
                  color={colors.iconOnAccent}
                  size={20}
                  strokeWidth={2.5}
                />
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </BottomSheetModal>
  );
});
