import { useCallback } from "react";
import { Pressable, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { colors, spacing, typography } from "../lib/theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type PlaceOrderButtonProps = {
  onPress: () => void;
  disabled?: boolean;
};

export function PlaceOrderButton({ onPress, disabled }: PlaceOrderButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.97, { damping: 12, stiffness: 320 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 10, stiffness: 260 });
  }, [scale]);

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel="Place order"
      disabled={disabled}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        animatedStyle,
        {
          marginTop: spacing.lg,
          width: "100%",
          alignItems: "center",
          borderRadius: spacing.md,
          paddingVertical: spacing.lg,
          backgroundColor: disabled ? `${colors.accentMuted}80` : colors.accent,
        },
      ]}
    >
      <Text style={[typography.bodyMedium, { color: colors.iconOnAccent }]}>
        Place Order
      </Text>
    </AnimatedPressable>
  );
}
