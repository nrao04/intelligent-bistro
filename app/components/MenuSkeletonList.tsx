import { useEffect } from "react";
import { FlatList, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { colors, spacing } from "../lib/theme";

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
      style={[
        pulseStyle,
        {
          marginBottom: spacing.md,
          flexDirection: "row",
          borderRadius: spacing.md,
          backgroundColor: colors.surfaceRaised,
          padding: spacing.lg,
        },
      ]}
    >
      <View
        style={{
          marginRight: spacing.lg,
          height: spacing.xxl + spacing.lg,
          width: spacing.xxl + spacing.lg,
          borderRadius: spacing.sm,
          backgroundColor: colors.border,
        }}
      />
      <View style={{ flex: 1 }}>
        <View
          style={{
            marginBottom: spacing.sm,
            height: spacing.lg,
            width: "60%",
            borderRadius: spacing.xs,
            backgroundColor: colors.border,
          }}
        />
        <View
          style={{
            marginBottom: spacing.sm,
            height: spacing.md,
            width: "100%",
            borderRadius: spacing.xs,
            backgroundColor: colors.border,
          }}
        />
        <View
          style={{
            height: spacing.md,
            width: "80%",
            borderRadius: spacing.xs,
            backgroundColor: colors.border,
          }}
        />
        <View
          style={{
            marginTop: spacing.md,
            height: spacing.md,
            width: "33%",
            borderRadius: spacing.xs,
            backgroundColor: colors.border,
          }}
        />
      </View>
      <View
        style={{
          marginLeft: spacing.md,
          height: spacing.xl + spacing.sm,
          width: spacing.xxl + spacing.lg,
          borderRadius: spacing.sm,
          backgroundColor: colors.border,
        }}
      />
    </Animated.View>
  );
}

export function MenuSkeletonList() {
  return (
    <FlatList
      data={[1, 2, 3, 4, 5, 6]}
      keyExtractor={(item) => String(item)}
      renderItem={() => <SkeletonCard />}
      contentContainerStyle={{
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.xxl,
        paddingTop: spacing.sm,
      }}
      scrollEnabled={false}
    />
  );
}
