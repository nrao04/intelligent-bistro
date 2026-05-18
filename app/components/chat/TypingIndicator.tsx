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

import { colors, spacing, typography } from "../../lib/theme";

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
      style={[
        style,
        {
          marginHorizontal: spacing.xs / 2,
          height: spacing.sm,
          width: spacing.sm,
          borderRadius: spacing.xs,
          backgroundColor: colors.textSecondary,
        },
      ]}
    />
  );
}

export function TypingIndicator() {
  return (
    <View
      style={{
        marginBottom: spacing.lg,
        flexDirection: "row",
        alignItems: "flex-end",
        paddingHorizontal: spacing.lg,
      }}
    >
      <View style={{ marginRight: spacing.sm, width: spacing.xl }}>
        <Text
          style={[
            typography.label,
            {
              color: colors.textMuted,
              textTransform: "uppercase",
              letterSpacing: 0.8,
            },
          ]}
        >
          AI
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderRadius: spacing.lg,
          borderBottomLeftRadius: spacing.xs,
          backgroundColor: colors.surfaceRaised,
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
        }}
      >
        <TypingDot delay={0} />
        <TypingDot delay={180} />
        <TypingDot delay={360} />
      </View>
    </View>
  );
}
