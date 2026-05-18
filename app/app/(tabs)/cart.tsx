import { useMemo } from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import { CartEmptyState } from "../../components/CartEmptyState";
import { CartLineItem } from "../../components/CartLineItem";
import { PlaceOrderButton } from "../../components/PlaceOrderButton";
import { useCart, type CartItem } from "../../context/CartContext";
import { formatPrice } from "../../lib/format";

const TAX_RATE = 0.08;

function lineId(item: CartItem) {
  return `${item.itemId}::${item.customization ?? ""}`;
}

export default function CartScreen() {
  const { items, clearCart, removeItem, updateQuantity } = useCart();

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const tax = useMemo(() => subtotal * TAX_RATE, [subtotal]);
  const total = useMemo(() => subtotal + tax, [subtotal, tax]);

  const handlePlaceOrder = () => {
    clearCart();
    Toast.show({
      type: "success",
      text1: "Order placed successfully",
    });
  };

  if (items.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-[#1a1a1a]" edges={["top"]}>
        <View className="px-4 pb-4 pt-2">
          <Text className="text-2xl font-semibold text-white">Cart</Text>
        </View>
        <CartEmptyState />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#1a1a1a]" edges={["top"]}>
      <View className="px-4 pb-2 pt-2">
        <Text className="text-2xl font-semibold text-white">Cart</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => lineId(item)}
        renderItem={({ item }) => (
          <CartLineItem
            item={item}
            onDecrease={() => {
              if (item.quantity <= 1) return;
              updateQuantity(
                item.itemId,
                item.quantity - 1,
                item.customization
              );
            }}
            onIncrease={() =>
              updateQuantity(
                item.itemId,
                item.quantity + 1,
                item.customization
              )
            }
            onRemove={() => removeItem(item.itemId, item.customization)}
          />
        )}
        contentContainerClassName="px-4 pt-2"
        showsVerticalScrollIndicator={false}
      />

      <View className="border-t border-[#2e2e2e] bg-[#1a1a1a] px-4 pb-4 pt-4">
        <View className="rounded-xl border border-[#2e2e2e] bg-[#222222] p-4">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-sm text-neutral-400">Subtotal</Text>
            <Text className="text-sm font-medium text-white">
              {formatPrice(subtotal)}
            </Text>
          </View>

          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-sm text-neutral-400">Tax (8%)</Text>
            <Text className="text-sm font-medium text-white">
              {formatPrice(tax)}
            </Text>
          </View>

          <View className="flex-row items-center justify-between border-t border-[#2e2e2e] pt-3">
            <Text className="text-base font-semibold text-white">Total</Text>
            <Text className="text-lg font-bold text-white">
              {formatPrice(total)}
            </Text>
          </View>
        </View>

        <PlaceOrderButton onPress={handlePlaceOrder} />
      </View>
    </SafeAreaView>
  );
}
