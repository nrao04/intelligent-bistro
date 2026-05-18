import { ShoppingCart } from "lucide-react-native";
import { Text, View } from "react-native";

import { colors, spacing, typography } from "../lib/theme";

export function CartEmptyState() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: spacing.xl,
      }}
    >
      <ShoppingCart color={colors.textMuted} size={48} strokeWidth={1.75} />
      <Text
        style={[
          typography.title,
          { color: colors.textPrimary, marginTop: spacing.xl },
        ]}
      >
        Your cart is empty
      </Text>
      <Text
        style={[
          typography.caption,
          {
            color: colors.textSecondary,
            marginTop: spacing.sm,
            textAlign: "center",
            lineHeight: spacing.lg,
          },
        ]}
      >
        Browse the menu or ask the assistant to add something.
      </Text>
    </View>
  );
}
