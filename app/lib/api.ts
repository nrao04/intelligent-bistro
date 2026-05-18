import type { AIAction, CartItem } from "../context/CartContext";
import type { MenuItem } from "@shared/menuItems";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3001";

export type ChatError = {
  code: string;
  message: string;
};

export type ChatResponse = {
  reply: string;
  actions: AIAction[];
};

export async function sendChatMessage(
  message: string,
  cart: CartItem[],
  menuItems: MenuItem[]
): Promise<ChatResponse> {
  const response = await fetch(`${API_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, cart, menuItems }),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = data.error as ChatError | undefined;
    throw new Error(
      error?.message ?? "Something went wrong while talking to the assistant."
    );
  }

  return data as ChatResponse;
}
