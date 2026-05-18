import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { menuItems, type MenuItem } from "@shared/menuItems";

export type CartItem = {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  customization?: string;
};

export type AIAction =
  | { type: "ADD_ITEM"; itemId: string; quantity: number }
  | { type: "REMOVE_ITEM"; itemId: string }
  | { type: "UPDATE_QUANTITY"; itemId: string; quantity: number }
  | { type: "CLEAR_CART" };

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  addItem: (item: MenuItem, quantity: number, customization?: string) => void;
  removeItem: (itemId: string, customization?: string) => void;
  updateQuantity: (
    itemId: string,
    quantity: number,
    customization?: string
  ) => void;
  clearCart: () => void;
  applyAIActions: (actions: AIAction[]) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function lineKey(itemId: string, customization?: string) {
  return `${itemId}::${customization ?? ""}`;
}

function findMenuItem(itemId: string): MenuItem | undefined {
  return menuItems.find((item) => item.id === itemId);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const addItem = useCallback(
    (item: MenuItem, quantity: number, customization?: string) => {
      if (quantity <= 0) return;

      setItems((current) => {
        const key = lineKey(item.id, customization);
        const index = current.findIndex(
          (line) => lineKey(line.itemId, line.customization) === key
        );

        if (index === -1) {
          return [
            ...current,
            {
              itemId: item.id,
              name: item.name,
              price: item.price,
              quantity,
              customization,
            },
          ];
        }

        return current.map((line, i) =>
          i === index ? { ...line, quantity: line.quantity + quantity } : line
        );
      });
    },
    []
  );

  const removeItem = useCallback((itemId: string, customization?: string) => {
    setItems((current) => {
      if (customization !== undefined) {
        const key = lineKey(itemId, customization);
        return current.filter(
          (line) => lineKey(line.itemId, line.customization) !== key
        );
      }
      return current.filter((line) => line.itemId !== itemId);
    });
  }, []);

  const updateQuantity = useCallback(
    (itemId: string, quantity: number, customization?: string) => {
      const key = lineKey(itemId, customization);

      if (quantity <= 0) {
        setItems((current) =>
          current.filter(
            (line) => lineKey(line.itemId, line.customization) !== key
          )
        );
        return;
      }

      setItems((current) => {
        const index = current.findIndex(
          (line) => lineKey(line.itemId, line.customization) === key
        );
        if (index === -1) return current;
        return current.map((line, i) =>
          i === index ? { ...line, quantity } : line
        );
      });
    },
    []
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const applyAIActions = useCallback(
    (actions: AIAction[]) => {
      actions.forEach((action) => {
        switch (action.type) {
          case "ADD_ITEM": {
            const item = findMenuItem(action.itemId);
            if (item) {
              addItem(item, action.quantity);
            }
            break;
          }
          case "REMOVE_ITEM":
            removeItem(action.itemId);
            break;
          case "UPDATE_QUANTITY":
            updateQuantity(action.itemId, action.quantity);
            break;
          case "CLEAR_CART":
            clearCart();
            break;
          default:
            break;
        }
      });
    },
    [addItem, clearCart, removeItem, updateQuantity]
  );

  const value = useMemo(
    () => ({
      items,
      itemCount,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      applyAIActions,
    }),
    [
      items,
      itemCount,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      applyAIActions,
    ]
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
