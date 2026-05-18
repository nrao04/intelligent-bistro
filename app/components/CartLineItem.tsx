import { Minus, Plus, Trash2 } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import { formatPrice } from "../lib/format";
import type { CartItem } from "../context/CartContext";

type CartLineItemProps = {
  item: CartItem;
  onDecrease: () => void;
  onIncrease: () => void;
  onRemove: () => void;
};

export function CartLineItem({
  item,
  onDecrease,
  onIncrease,
  onRemove,
}: CartLineItemProps) {
  const lineTotal = item.price * item.quantity;

  return (
    <View className="mb-4 flex-row items-start border-b border-[#2e2e2e] pb-4">
      <View className="flex-1 pr-3">
        <Text className="text-base font-semibold text-white">{item.name}</Text>
        {item.customization ? (
          <Text className="mt-1 text-sm text-neutral-400">
            {item.customization}
          </Text>
        ) : null}

        <View className="mt-3 flex-row items-center">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Decrease quantity of ${item.name}`}
            onPress={onDecrease}
            className="h-8 w-8 items-center justify-center rounded-lg border border-[#404040]"
          >
            <Minus color="#ffffff" size={16} strokeWidth={2} />
          </Pressable>

          <Text className="mx-4 min-w-6 text-center text-base font-medium text-white">
            {item.quantity}
          </Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Increase quantity of ${item.name}`}
            onPress={onIncrease}
            className="h-8 w-8 items-center justify-center rounded-lg border border-[#404040]"
          >
            <Plus color="#ffffff" size={16} strokeWidth={2} />
          </Pressable>
        </View>
      </View>

      <View className="items-end">
        <Text className="text-base font-medium text-white">
          {formatPrice(lineTotal)}
        </Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Remove ${item.name} from cart`}
          onPress={onRemove}
          className="mt-3 p-1"
        >
          <Trash2 color="#a3a3a3" size={20} strokeWidth={2} />
        </Pressable>
      </View>
    </View>
  );
}
