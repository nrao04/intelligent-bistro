import { MessageSquare } from "lucide-react-native";
import { useEffect } from "react";
import { Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { colors, fabOffset, spacing } from "../../lib/theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ChatFABProps = {
  onPress: () => void;
  showPulse: boolean;
};

export function ChatFAB({ onPress, showPulse }: ChatFABProps) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (!showPulse) {
      scale.value = withTiming(1, { duration: 200 });
      return;
    }

    scale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 900 }),
        withTiming(1, { duration: 900 })
      ),
      -1,
      false
    );
  }, [showPulse, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel="Open AI assistant"
      onPress={onPress}
      style={[
        animatedStyle,
        {
          position: "absolute",
          right: spacing.lg,
          bottom: fabOffset,
          zIndex: 50,
          height: spacing.xxl + spacing.lg,
          width: spacing.xxl + spacing.lg,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: spacing.xxl + spacing.lg,
          backgroundColor: colors.accent,
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.35,
          shadowRadius: 8,
          elevation: 8,
        },
      ]}
    >
      <MessageSquare color={colors.iconOnAccent} size={24} strokeWidth={2} />
    </AnimatedPressable>
  );
}
