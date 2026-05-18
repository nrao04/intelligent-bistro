import { ShoppingCart } from "lucide-react-native";
import { Text, View } from "react-native";

export function CartEmptyState() {
  return (
    <View className="flex-1 items-center justify-center px-8">
      <ShoppingCart color="#737373" size={48} strokeWidth={1.75} />
      <Text className="mt-6 text-xl font-semibold text-white">
        Your cart is empty
      </Text>
      <Text className="mt-2 text-center text-sm leading-6 text-neutral-400">
        Browse the menu or ask the assistant to add something.
      </Text>
    </View>
  );
}
