require("dotenv").config();

const express = require("express");
const cors = require("cors");
const Anthropic = require("@anthropic-ai/sdk");
const { menuItems: defaultMenuItems } = require("../shared/menuItems.ts");

const app = express();
const PORT = process.env.PORT || 3001;
const MODEL = "claude-sonnet-4-20250514";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const VALID_ACTION_TYPES = new Set([
  "ADD_ITEM",
  "REMOVE_ITEM",
  "UPDATE_QUANTITY",
  "CLEAR_CART",
]);

function formatMenuForPrompt(items) {
  return items
    .map(
      (item) =>
        `- id: ${item.id} | ${item.name} | $${item.price.toFixed(2)} | category: ${item.category}${item.isPopular ? " | popular" : ""}${item.customizations.length ? ` | customizations: ${item.customizations.join(", ")}` : ""}`
    )
    .join("\n");
}

function formatCartForPrompt(cart) {
  if (!cart || cart.length === 0) {
    return "Cart is empty.";
  }
  return cart
    .map(
      (line) =>
        `- ${line.name ?? line.itemId} x${line.quantity}${line.customization ? ` (${line.customization})` : ""}`
    )
    .join("\n");
}

function buildSystemPrompt(menuItems, cart) {
  return `You are the ordering assistant for The Intelligent Bistro, an upscale casual restaurant.

MENU (use item ids exactly as listed):
${formatMenuForPrompt(menuItems)}

CURRENT CART:
${formatCartForPrompt(cart)}

Your job is to help guests add, remove, or update items in their cart using natural language.

You MUST respond with raw JSON only. No markdown, no preamble, no code fences, no explanation outside the JSON object. If you return anything other than valid JSON, the integration breaks.

Respond with this exact shape:
{
  "reply": "A short, friendly conversational reply to the guest",
  "actions": []
}

Valid action types:
- ADD_ITEM: { "type": "ADD_ITEM", "itemId": "<menu id>", "quantity": <positive integer> }
- REMOVE_ITEM: { "type": "REMOVE_ITEM", "itemId": "<menu id>" }
- UPDATE_QUANTITY: { "type": "UPDATE_QUANTITY", "itemId": "<menu id>", "quantity": <non-negative integer> }
- CLEAR_CART: { "type": "CLEAR_CART" }

Rules:
- Only use item ids from the menu above.
- Match guest requests to the closest menu item by name or description.
- If the guest asks what is popular, answer in reply and only add actions when they ask to order.
- If the request is unclear, return an empty actions array and ask a clarifying question in reply.
- quantity on UPDATE_QUANTITY of 0 should remove the item (use REMOVE_ITEM or UPDATE_QUANTITY with 0).
- Keep reply concise, warm, and professional. No emojis.`;
}

function extractJsonText(text) {
  const trimmed = text.trim();
  if (trimmed.startsWith("{")) {
    return trimmed;
  }
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenceMatch) {
    return fenceMatch[1].trim();
  }
  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1);
  }
  return trimmed;
}

function validateAction(action, menuIds) {
  if (!action || typeof action !== "object" || !VALID_ACTION_TYPES.has(action.type)) {
    return false;
  }

  switch (action.type) {
    case "ADD_ITEM":
      return (
        typeof action.itemId === "string" &&
        menuIds.has(action.itemId) &&
        Number.isInteger(action.quantity) &&
        action.quantity > 0
      );
    case "REMOVE_ITEM":
      return typeof action.itemId === "string" && menuIds.has(action.itemId);
    case "UPDATE_QUANTITY":
      return (
        typeof action.itemId === "string" &&
        menuIds.has(action.itemId) &&
        Number.isInteger(action.quantity) &&
        action.quantity >= 0
      );
    case "CLEAR_CART":
      return true;
    default:
      return false;
  }
}

function parseAssistantResponse(rawText, menuItems) {
  const jsonText = extractJsonText(rawText);
  let parsed;

  try {
    parsed = JSON.parse(jsonText);
  } catch {
    return {
      ok: false,
      error: {
        code: "INVALID_JSON",
        message:
          "The assistant returned a response we could not understand. Please try again.",
      },
    };
  }

  if (!parsed || typeof parsed !== "object") {
    return {
      ok: false,
      error: {
        code: "INVALID_SHAPE",
        message:
          "The assistant response was missing required fields. Please try again.",
      },
    };
  }

  if (typeof parsed.reply !== "string" || !Array.isArray(parsed.actions)) {
    return {
      ok: false,
      error: {
        code: "INVALID_SHAPE",
        message:
          "The assistant response was missing reply or actions. Please try again.",
      },
    };
  }

  const menuIds = new Set(menuItems.map((item) => item.id));
  const actions = parsed.actions.filter((action) =>
    validateAction(action, menuIds)
  );

  return {
    ok: true,
    data: {
      reply: parsed.reply,
      actions,
    },
  };
}

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", menuItemCount: defaultMenuItems.length });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message, cart, menuItems: requestMenuItems } = req.body ?? {};

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        error: {
          code: "INVALID_REQUEST",
          message: "A non-empty message string is required.",
        },
      });
    }

    if (!process.env.ANTHROPIC_API_KEY && process.env.CHAT_MOCK !== "1") {
      return res.status(503).json({
        error: {
          code: "MISSING_API_KEY",
          message:
            "The server is not configured with an Anthropic API key. Add ANTHROPIC_API_KEY to server/.env.",
        },
      });
    }

    const menuItems = Array.isArray(requestMenuItems) && requestMenuItems.length > 0
      ? requestMenuItems
      : defaultMenuItems;

    const cartState = Array.isArray(cart) ? cart : [];

    let rawText;

    // Set CHAT_MOCK=1 locally to verify /api/chat without an API key.
    if (process.env.CHAT_MOCK === "1") {
      rawText = JSON.stringify({
        reply:
          "Done — two Spicy Crispy Chicken Sandwiches are in your cart. Anything else?",
        actions: [
          { type: "ADD_ITEM", itemId: "mains-001", quantity: 2 },
          { type: "ADD_ITEM", itemId: "drinks-004", quantity: 1 },
        ],
      });
    } else {
      const response = await anthropic.messages.create({
        model: MODEL,
        max_tokens: 1024,
        system: buildSystemPrompt(menuItems, cartState),
        messages: [{ role: "user", content: message.trim() }],
      });

      const textBlock = response.content.find((block) => block.type === "text");
      rawText = textBlock?.text ?? "";
    }

    const parsed = parseAssistantResponse(rawText, menuItems);

    if (!parsed.ok) {
      return res.status(502).json({ error: parsed.error });
    }

    return res.json(parsed.data);
  } catch (error) {
    const status = error?.status ?? 500;
    return res.status(status >= 400 && status < 600 ? status : 500).json({
      error: {
        code: "CHAT_FAILED",
        message:
          "Something went wrong while talking to the assistant. Please try again.",
      },
    });
  }
});

app.use((_req, res) => {
  res.status(404).json({
    error: {
      code: "NOT_FOUND",
      message: "Route not found.",
    },
  });
});

app.use((err, _req, res, _next) => {
  res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "An unexpected server error occurred.",
    },
  });
});

app.listen(PORT);
