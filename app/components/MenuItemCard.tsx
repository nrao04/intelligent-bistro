import { Plus } from "lucide-react-native";
import { useCallback } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { formatPrice } from "../lib/format";
import { getMenuIcon } from "../lib/menuIcon";
import { colors, spacing, typography } from "../lib/theme";
import type { MenuItem } from "@shared/menuItems";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type MenuItemCardProps = {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
};

export function MenuItemCard({ item, onAdd }: MenuItemCardProps) {
  const Icon = getMenuIcon(item.icon);
  const cardScale = useSharedValue(1);
  const confirmOpacity = useSharedValue(0);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  const confirmAnimatedStyle = useAnimatedStyle(() => ({
    opacity: confirmOpacity.value,
  }));

  const handleAdd = useCallback(() => {
    cardScale.value = withSequence(
      withSpring(0.98, { damping: 14, stiffness: 320 }),
      withSpring(1, { damping: 12, stiffness: 260 })
    );
    confirmOpacity.value = withSequence(
      withTiming(1, { duration: 120 }),
      withTiming(0, { duration: 480 })
    );
    onAdd(item);
  }, [cardScale, confirmOpacity, item, onAdd]);

  return (
    <Animated.View
      style={[
        cardAnimatedStyle,
        {
          marginBottom: spacing.md,
          flexDirection: "row",
          borderRadius: 12,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.surface,
          padding: spacing.lg,
        },
      ]}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          confirmAnimatedStyle,
          {
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: colors.accent,
          },
        ]}
      />

      <View
        style={{
          marginRight: spacing.lg,
          height: spacing.xxl + spacing.lg,
          width: spacing.xxl + spacing.lg,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: spacing.sm,
          backgroundColor: colors.border,
        }}
      >
        <Icon color={colors.accent} size={24} strokeWidth={2} />
      </View>

      <View style={{ flex: 1, paddingRight: spacing.md }}>
        <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: spacing.sm }}>
          <Text
            style={[typography.bodyMedium, { color: colors.textPrimary, flexShrink: 1 }]}
          >
            {item.name}
          </Text>
          {item.isPopular ? (
            <Text style={[typography.label, { color: colors.accent }]}>Popular</Text>
          ) : null}
        </View>

        <Text
          style={[
            typography.caption,
            { color: colors.textSecondary, marginTop: spacing.xs },
          ]}
          numberOfLines={2}
        >
          {item.description}
        </Text>

        <View
          style={{
            marginTop: spacing.sm,
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.md,
          }}
        >
          <Text style={[typography.bodyMedium, { color: colors.textPrimary }]}>
            {formatPrice(item.price)}
          </Text>
          <Text style={[typography.caption, { color: colors.textMuted }]}>
            {item.calories} cal
          </Text>
        </View>
      </View>

      <AnimatedPressable
        accessibilityRole="button"
        accessibilityLabel={`Add ${item.name} to cart`}
        onPress={handleAdd}
        style={{
          height: spacing.xl + spacing.sm,
          alignSelf: "center",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: spacing.sm,
          backgroundColor: colors.accent,
          paddingHorizontal: spacing.lg,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
          <Plus color={colors.iconOnAccent} size={16} strokeWidth={2.5} />
          <Text style={[typography.label, { color: colors.iconOnAccent }]}>Add</Text>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
}
