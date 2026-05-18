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
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ComponentRef,
} from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { useCart } from "../../context/CartContext";
import { sendChatMessage } from "../../lib/api";
import { menuItems } from "@shared/menuItems";

import { ChatBubble } from "./ChatBubble";
import { SuggestionChips } from "./SuggestionChips";
import { TypingIndicator } from "./TypingIndicator";
import type { ChatMessage } from "./types";

export type ChatBottomSheetRef = BottomSheetModal;

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

  const notifyCount = useCallback(
    (next: ChatMessage[]) => {
      onMessageCountChange?.(next.length);
    },
    [onMessageCountChange]
  );

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

      setMessages((current) => {
        const next = [userMessage, ...current];
        notifyCount(next);
        return next;
      });
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

        setMessages((current) => {
          const next = [assistantMessage, ...current];
          notifyCount(next);
          return next;
        });
      } catch (error) {
        const assistantMessage: ChatMessage = {
          id: createMessageId(),
          role: "assistant",
          content:
            error instanceof Error
              ? error.message
              : "Something went wrong while talking to the assistant.",
        };

        setMessages((current) => {
          const next = [assistantMessage, ...current];
          notifyCount(next);
          return next;
        });
      } finally {
        setIsSending(false);
      }
    },
    [applyAIActions, isSending, items, notifyCount]
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
      animationConfigs={{
        damping: 22,
        stiffness: 220,
        mass: 0.9,
      }}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: "#1a1a1a" }}
      handleIndicatorStyle={{ backgroundColor: "#737373", width: 40 }}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      onChange={handleSheetChange}
    >
      <View className="flex-1 bg-[#1a1a1a]">
        <View className="flex-row items-center justify-between border-b border-[#2e2e2e] px-4 pb-3 pt-1">
          <Text className="text-lg font-semibold text-white">AI Assistant</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close assistant"
            onPress={() => sheetRef.current?.dismiss()}
            className="p-2"
          >
            <X color="#a3a3a3" size={22} strokeWidth={2} />
          </Pressable>
        </View>

        <BottomSheetFlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          inverted
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: 12,
            paddingBottom: 8,
          }}
          ListHeaderComponent={isSending ? <TypingIndicator /> : null}
        />

        {showSuggestions ? <SuggestionChips onSelect={sendMessage} /> : null}

        <View className="flex-row items-end gap-2 border-t border-[#2e2e2e] px-4 py-3">
          <BottomSheetTextInput
            ref={inputRef}
            value={input}
            onChangeText={setInput}
            editable={!isSending}
            multiline
            maxLength={500}
            placeholder="Ask about the menu or your order"
            placeholderTextColor="#737373"
            onSubmitEditing={handleSend}
            returnKeyType="send"
            style={{
              flex: 1,
              maxHeight: 96,
              minHeight: 44,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "#404040",
              backgroundColor: "#222222",
              color: "#ffffff",
              fontSize: 15,
              paddingHorizontal: 16,
              paddingVertical: 12,
            }}
          />

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Send message"
            disabled={isSending || !input.trim()}
            onPress={handleSend}
            className={`h-11 w-11 items-center justify-center rounded-full ${
              isSending || !input.trim() ? "bg-[#92400e]/40" : "bg-[#f59e0b]"
            }`}
          >
            {isSending ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <ArrowUp color="#ffffff" size={20} strokeWidth={2.5} />
            )}
          </Pressable>
        </View>
      </View>
    </BottomSheetModal>
  );
});
