import { useEffect } from "react";
import { FlatList, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

function SkeletonCard() {
  const opacity = useSharedValue(0.45);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.85, { duration: 900 }),
      -1,
      true
    );
  }, [opacity]);

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={pulseStyle}
      className="mb-3 flex-row rounded-xl bg-[#262626] p-4"
    >
      <View className="mr-4 h-12 w-12 rounded-lg bg-[#333333]" />
      <View className="flex-1">
        <View className="mb-2 h-4 w-3/5 rounded bg-[#333333]" />
        <View className="mb-2 h-3 w-full rounded bg-[#333333]" />
        <View className="h-3 w-4/5 rounded bg-[#333333]" />
        <View className="mt-3 h-3 w-1/3 rounded bg-[#333333]" />
      </View>
      <View className="ml-3 h-9 w-16 rounded-lg bg-[#333333]" />
    </Animated.View>
  );
}

export function MenuSkeletonList() {
  return (
    <FlatList
      data={[1, 2, 3, 4, 5, 6]}
      keyExtractor={(item) => String(item)}
      renderItem={() => <SkeletonCard />}
      contentContainerClassName="px-4 pb-8 pt-2"
      scrollEnabled={false}
    />
  );
}
