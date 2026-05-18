# The Intelligent Bistro

The Intelligent Bistro is a mobile restaurant ordering app built with Expo and React Native. Guests browse an upscale casual menu, manage their cart with taps or natural language, and place orders through a polished dark-themed interface powered by Claude.

## Prerequisites

- Node.js 18 or newer
- npm
- Expo Go on a physical device, or Xcode / Android Studio for simulators
- An [Anthropic API key](https://console.anthropic.com/)

## Project structure

```
intelligent-bistro/
├── app/          Expo React Native client
├── server/       Express API with Claude integration
└── shared/       Shared menu data (menuItems.ts)
```

## Backend setup

```bash
cd server
npm install
```

Create `server/.env` (never commit this file):

```env
ANTHROPIC_API_KEY=your_key_here
PORT=3001
```

Start the API:

```bash
npm start
```

The server listens on port 3001. Confirm it is running:

```bash
curl http://localhost:3001/health
```

## Frontend setup

```bash
cd app
npm install
```

Create `app/.env`:

```env
EXPO_PUBLIC_API_URL=http://localhost:3001
```

Use your computer's LAN IP instead of `localhost` when testing on a physical phone, for example `http://192.168.1.42:3001`.

Start the app:

```bash
npx expo start
```

Scan the QR code with Expo Go, or press `i` / `a` for a simulator.

## AI integration

The assistant flow uses a strict JSON contract across three layers:

1. **App** sends `POST /api/chat` with `{ message, cart, menuItems }`.
2. **Server** builds a system prompt from the menu and cart, calls Claude (`claude-sonnet-4-20250514`), parses the model response, and returns `{ reply, actions }`.
3. **App** displays `reply` in the chat and runs each action through `applyAIActions`.

Supported action types:

| Type | Payload |
|------|---------|
| `ADD_ITEM` | `{ type, itemId, quantity }` |
| `REMOVE_ITEM` | `{ type, itemId }` |
| `UPDATE_QUANTITY` | `{ type, itemId, quantity }` |
| `CLEAR_CART` | `{ type }` |

If Claude returns invalid JSON, the server responds with a structured error the chat UI can display without crashing.

## Demo

Screenshots and a short demo video: coming soon.

## License

See [LICENSE](LICENSE).
