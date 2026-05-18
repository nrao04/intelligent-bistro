# Intelligent Bistro — Build Plan

## Phase 1: Project Scaffold
- [x] Create monorepo with /app and /server folders
- [x] Initialize Expo project in /app with NativeWind
- [x] Initialize Node.js + Express project in /server
- [x] Set up .env files and .gitignore (never commit keys)
- [x] Stub out root README.md

## Phase 2: Menu Data
- [x] Create shared menuItems.ts with 12+ items across 3 categories
- [x] Categories: Mains, Sides, Drinks
- [x] Each item has: id, name, description, price, category, icon (string),
      calories, isPopular, customizations[]

## Phase 3: Backend
- [x] POST /api/chat endpoint built and working
- [x] Claude API integration with structured JSON response enforced
- [x] System prompt instructs Claude to return reply + actions[]
- [x] Action types: ADD_ITEM, REMOVE_ITEM, UPDATE_QUANTITY, CLEAR_CART
- [x] CORS, dotenv, and error handling all in place
- [x] Endpoint tested with curl before moving to frontend

## Phase 4: Frontend — Core Structure
- [x] Bottom tab navigator (Menu tab, Cart tab)
- [x] Global cart state via React Context
- [x] Cart operations: addItem, removeItem, updateQuantity, clearCart, applyAIActions

## Phase 5: Frontend — Menu Screen
- [x] Header with restaurant name and cart icon with item count badge
- [x] Horizontal category filter pills (All, Mains, Sides, Drinks)
- [x] Scrollable menu item cards (icon, name, description, price, calories, Popular label)
- [x] Loading skeleton on mount (800ms fake delay)
- [x] Add button goes direct to cart OR opens customization modal if item has options

## Phase 6: Frontend — Cart Screen
- [x] Cart item list with quantity stepper and remove button
- [x] Order summary: subtotal, 8% tax, total
- [x] Place Order button clears cart and shows success toast
- [x] Empty state with message and icon

## Phase 7: Frontend — AI Chat
- [ ] Floating action button (bottom-right, both tabs)
- [ ] Bottom sheet modal with chat message list
- [ ] User messages right-aligned, AI messages left-aligned with small label
- [ ] Typing indicator while waiting for response
- [ ] Starter suggestion chips: "What's popular?", "Add a combo meal", "Clear my cart"
- [ ] Auto-focus input when sheet opens
- [ ] POST to backend, apply returned actions to cart in real time

## Phase 8: Polish
- [ ] Reanimated animations on cart badge, item add confirmation, chat sheet open/close
- [ ] Haptic feedback on add-to-cart
- [ ] Dark charcoal theme (#1a1a1a base, #f59e0b amber accent) applied consistently
- [ ] Typography and spacing consistent across all screens (4pt grid)
- [ ] No placeholder text, no TODO comments, no console.log left in production code

## Phase 9: Final Check and README
- [ ] Manual walkthrough of all core flows passes
- [ ] README.md complete with accurate setup instructions
- [ ] .env confirmed in .gitignore, no keys hardcoded anywhere
- [ ] plan.md fully checked off
