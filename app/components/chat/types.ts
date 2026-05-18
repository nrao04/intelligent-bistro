export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export const SUGGESTION_CHIPS = [
  "What's popular?",
  "Add a combo meal",
  "Clear my cart",
] as const;
