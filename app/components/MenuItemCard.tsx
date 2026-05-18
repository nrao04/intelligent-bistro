import { Plus } from "lucide-react-native";
import { useCallback, useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
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
  index?: number;
};

export function MenuItemCard({ item, onAdd, index = 0 }: MenuItemCardProps) {
  const Icon = getMenuIcon(item.icon);
  const cardScale = useSharedValue(1);
  const confirmOpacity = useSharedValue(0);
  const enterTranslateY = useSharedValue(16);

  useEffect(() => {
    enterTranslateY.value = withDelay(
      index * 55,
      withSpring(0, { damping: 20, stiffness: 240 })
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: cardScale.value },
      { translateY: enterTranslateY.value },
    ],
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
          borderRadius: 14,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.surface,
          padding: spacing.md,
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
            borderRadius: 14,
            borderWidth: 2,
            borderColor: colors.accent,
          },
        ]}
      />

      <View
        style={{
          marginRight: spacing.md,
          height: spacing.xxl + spacing.lg,
          width: spacing.xxl + spacing.lg,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: spacing.sm,
          backgroundColor: "#231a00",
        }}
      >
        <Icon color={colors.accent} size={22} strokeWidth={1.75} />
      </View>

      <View style={{ flex: 1, paddingRight: spacing.sm }}>
        <Text
          style={[typography.bodyMedium, { color: colors.textPrimary }]}
          numberOfLines={1}
        >
          {item.name}
        </Text>

        {item.isPopular ? (
          <View
            style={{
              alignSelf: "flex-start",
              marginTop: spacing.xs,
              marginBottom: spacing.xs,
              borderRadius: 99,
              backgroundColor: "#2e1f00",
              borderWidth: 1,
              borderColor: "#5a3d00",
              paddingHorizontal: spacing.sm,
              paddingVertical: 2,
            }}
          >
            <Text
              style={[typography.label, { color: colors.accent, fontSize: 10 }]}
            >
              Popular
            </Text>
          </View>
        ) : (
          <View style={{ marginTop: spacing.xs, marginBottom: spacing.xs, height: 16 }} />
        )}

        <Text
          style={[
            typography.caption,
            { color: colors.textSecondary },
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
          paddingHorizontal: spacing.md,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
          <Plus color={colors.iconOnAccent} size={15} strokeWidth={2.5} />
          <Text style={[typography.label, { color: colors.iconOnAccent }]}>Add</Text>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
}
