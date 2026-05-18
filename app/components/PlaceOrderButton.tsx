import { useCallback } from "react";
import { Pressable, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

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
      style={animatedStyle}
      className={`mt-4 w-full items-center rounded-xl py-4 ${
        disabled ? "bg-[#92400e]/50" : "bg-[#f59e0b]"
      }`}
    >
      <Text className="text-base font-semibold text-white">Place Order</Text>
    </AnimatedPressable>
  );
}
