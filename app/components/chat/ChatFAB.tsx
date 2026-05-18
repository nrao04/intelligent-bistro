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
          right: 16,
          bottom: 88,
          zIndex: 50,
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.35,
          shadowRadius: 8,
          elevation: 8,
        },
      ]}
      className="h-14 w-14 items-center justify-center rounded-full bg-[#f59e0b]"
    >
      <MessageSquare color="#ffffff" size={24} strokeWidth={2} />
    </AnimatedPressable>
  );
}
