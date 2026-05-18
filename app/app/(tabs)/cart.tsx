import { Text, View } from "react-native";

import { useCart } from "../../context/CartContext";

export default function CartScreen() {
  const { items } = useCart();

  return (
    <View className="flex-1 items-center justify-center bg-[#1a1a1a] px-6">
      <Text className="text-xl font-semibold text-white">Cart</Text>
      <Text className="mt-2 text-sm text-neutral-400">
        {items.length === 0
          ? "Your cart is empty"
          : `${items.length} line ${items.length === 1 ? "item" : "items"}`}
      </Text>
    </View>
  );
}
