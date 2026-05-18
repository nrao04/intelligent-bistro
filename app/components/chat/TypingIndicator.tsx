import { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

function TypingDot({ delay }: { delay: number }) {
  const opacity = useSharedValue(0.35);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 360 }),
          withTiming(0.35, { duration: 360 })
        ),
        -1,
        false
      )
    );
  }, [delay, opacity]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={style}
      className="mx-0.5 h-2 w-2 rounded-full bg-neutral-400"
    />
  );
}

export function TypingIndicator() {
  return (
    <View className="mb-4 flex-row items-end px-4">
      <View className="mr-2 w-6">
        <Text className="text-[10px] font-semibold uppercase tracking-wide text-neutral-500">
          AI
        </Text>
      </View>
      <View className="flex-row items-center rounded-2xl rounded-bl-sm bg-[#262626] px-4 py-3">
        <TypingDot delay={0} />
        <TypingDot delay={180} />
        <TypingDot delay={360} />
      </View>
    </View>
  );
}
