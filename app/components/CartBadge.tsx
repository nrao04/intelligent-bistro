import { useEffect, useRef } from "react";
import { Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";

import { colors, spacing, typography } from "../lib/theme";

type CartBadgeProps = {
  count: number;
};

export function CartBadge({ count }: CartBadgeProps) {
  const scale = useSharedValue(1);
  const previousCount = useRef(count);

  useEffect(() => {
    if (previousCount.current !== count) {
      scale.value = withSequence(
        withSpring(1.28, { damping: 8, stiffness: 320 }),
        withSpring(1, { damping: 10, stiffness: 260 })
      );
      previousCount.current = count;
    }
  }, [count, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (count <= 0) {
    return null;
  }

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          position: "absolute",
          right: -spacing.xs,
          top: -spacing.xs,
          minHeight: spacing.xl,
          minWidth: spacing.xl,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: spacing.lg,
          backgroundColor: colors.accent,
          paddingHorizontal: spacing.xs,
        },
      ]}
    >
      <Text style={[typography.label, { color: colors.iconOnAccent, fontSize: 10 }]}>
        {count > 99 ? "99+" : count}
      </Text>
    </Animated.View>
  );
}
