import { Minus, Plus, Trash2 } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import type { CartItem } from "../context/CartContext";
import { formatPrice } from "../lib/format";
import { colors, spacing, typography } from "../lib/theme";

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
    <View
      style={{
        marginBottom: spacing.lg,
        flexDirection: "row",
        alignItems: "flex-start",
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        paddingBottom: spacing.lg,
      }}
    >
      <View style={{ flex: 1, paddingRight: spacing.md }}>
        <Text style={[typography.bodyMedium, { color: colors.textPrimary }]}>
          {item.name}
        </Text>
        {item.customization ? (
          <Text
            style={[
              typography.caption,
              { color: colors.textSecondary, marginTop: spacing.xs },
            ]}
          >
            {item.customization}
          </Text>
        ) : null}

        <View
          style={{
            marginTop: spacing.md,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Decrease quantity of ${item.name}`}
            onPress={onDecrease}
            style={{
              height: spacing.xl,
              width: spacing.xl,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: spacing.sm,
              borderWidth: 1,
              borderColor: colors.borderMuted,
            }}
          >
            <Minus color={colors.textPrimary} size={16} strokeWidth={2} />
          </Pressable>

          <Text
            style={[
              typography.bodyMedium,
              {
                color: colors.textPrimary,
                marginHorizontal: spacing.lg,
                minWidth: spacing.lg,
                textAlign: "center",
              },
            ]}
          >
            {item.quantity}
          </Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Increase quantity of ${item.name}`}
            onPress={onIncrease}
            style={{
              height: spacing.xl,
              width: spacing.xl,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: spacing.sm,
              borderWidth: 1,
              borderColor: colors.borderMuted,
            }}
          >
            <Plus color={colors.textPrimary} size={16} strokeWidth={2} />
          </Pressable>
        </View>
      </View>

      <View style={{ alignItems: "flex-end" }}>
        <Text style={[typography.bodyMedium, { color: colors.textPrimary }]}>
          {formatPrice(lineTotal)}
        </Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Remove ${item.name} from cart`}
          onPress={onRemove}
          style={{ marginTop: spacing.md, padding: spacing.xs }}
        >
          <Trash2 color={colors.textSecondary} size={20} strokeWidth={2} />
        </Pressable>
      </View>
    </View>
  );
}
