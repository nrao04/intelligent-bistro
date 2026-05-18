import { useMemo } from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import { CartEmptyState } from "../../components/CartEmptyState";
import { CartLineItem } from "../../components/CartLineItem";
import { PlaceOrderButton } from "../../components/PlaceOrderButton";
import { useCart, type CartItem } from "../../context/CartContext";
import { formatPrice } from "../../lib/format";
import { colors, spacing, typography } from "../../lib/theme";

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
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.base }} edges={["top"]}>
        <View
          style={{
            paddingHorizontal: spacing.lg,
            paddingBottom: spacing.lg,
            paddingTop: spacing.sm,
          }}
        >
          <Text style={[typography.heading, { color: colors.textPrimary }]}>Cart</Text>
        </View>
        <CartEmptyState />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.base }} edges={["top"]}>
      <View
        style={{
          paddingHorizontal: spacing.lg,
          paddingBottom: spacing.sm,
          paddingTop: spacing.sm,
        }}
      >
        <Text style={[typography.heading, { color: colors.textPrimary }]}>Cart</Text>
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
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.sm,
        }}
        showsVerticalScrollIndicator={false}
      />

      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: colors.border,
          backgroundColor: colors.base,
          paddingHorizontal: spacing.lg,
          paddingBottom: spacing.lg,
          paddingTop: spacing.lg,
        }}
      >
        <View
          style={{
            borderRadius: spacing.md,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.surface,
            padding: spacing.lg,
          }}
        >
          <View
            style={{
              marginBottom: spacing.md,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={[typography.caption, { color: colors.textSecondary }]}>
              Subtotal
            </Text>
            <Text style={[typography.bodyMedium, { color: colors.textPrimary }]}>
              {formatPrice(subtotal)}
            </Text>
          </View>

          <View
            style={{
              marginBottom: spacing.md,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={[typography.caption, { color: colors.textSecondary }]}>
              Tax (8%)
            </Text>
            <Text style={[typography.bodyMedium, { color: colors.textPrimary }]}>
              {formatPrice(tax)}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderTopWidth: 1,
              borderTopColor: colors.border,
              paddingTop: spacing.md,
            }}
          >
            <Text style={[typography.bodyMedium, { color: colors.textPrimary }]}>
              Total
            </Text>
            <Text
              style={[
                typography.title,
                { color: colors.textPrimary, fontSize: spacing.lg },
              ]}
            >
              {formatPrice(total)}
            </Text>
          </View>
        </View>

        <PlaceOrderButton onPress={handlePlaceOrder} />
      </View>
    </SafeAreaView>
  );
}
