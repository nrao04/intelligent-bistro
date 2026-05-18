import { useEffect, useRef } from "react";
import { Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";

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
      style={animatedStyle}
      className="absolute -right-1 -top-1 min-h-5 min-w-5 items-center justify-center rounded-full bg-[#f59e0b] px-1"
    >
      <Text className="text-[10px] font-semibold text-white">
        {count > 99 ? "99+" : count}
      </Text>
    </Animated.View>
  );
}
