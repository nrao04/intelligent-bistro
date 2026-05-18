import { Text, View } from "react-native";

import { useCart } from "../../context/CartContext";

export default function MenuScreen() {
  const { itemCount } = useCart();

  return (
    <View className="flex-1 items-center justify-center bg-[#1a1a1a] px-6">
      <Text className="text-xl font-semibold text-white">Menu</Text>
      <Text className="mt-2 text-sm text-neutral-400">
        {itemCount} {itemCount === 1 ? "item" : "items"} in cart
      </Text>
    </View>
  );
}
