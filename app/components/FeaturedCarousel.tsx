import { Plus } from "lucide-react-native";
import { useCallback } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";

import { formatPrice } from "../lib/format";
import { getMenuIcon } from "../lib/menuIcon";
import { colors, spacing, typography } from "../lib/theme";
import { menuItems, type MenuItem } from "@shared/menuItems";

const FEATURED = menuItems.filter((item) => item.isPopular);

type FeaturedCarouselProps = {
  onAdd: (item: MenuItem) => void;
};

function FeaturedCard({
  item,
  onAdd,
}: {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
}) {
  const Icon = getMenuIcon(item.icon);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = useCallback(() => {
    scale.value = withSequence(
      withSpring(0.95, { damping: 14, stiffness: 320 }),
      withSpring(1, { damping: 12, stiffness: 260 })
    );
    onAdd(item);
  }, [item, onAdd, scale]);

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          width: 148,
          marginRight: spacing.md,
          borderRadius: 16,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
          overflow: "hidden",
        },
      ]}
    >
      <View
        style={{
          height: 88,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#231a00",
          borderBottomWidth: 1,
          borderBottomColor: "#3a2c00",
        }}
      >
        <Icon color={colors.accent} size={34} strokeWidth={1.5} />
      </View>

      <View style={{ padding: spacing.md, gap: spacing.xs }}>
        <Text
          style={[typography.bodyMedium, { color: colors.textPrimary, lineHeight: 18 }]}
          numberOfLines={2}
        >
          {item.name}
        </Text>
        <Text style={[typography.bodyMedium, { color: colors.accent }]}>
          {formatPrice(item.price)}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Add ${item.name} to cart`}
          onPress={handlePress}
          style={{
            marginTop: spacing.xs,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: spacing.xs,
            backgroundColor: colors.accent,
            borderRadius: spacing.sm,
            paddingVertical: spacing.sm,
          }}
        >
          <Plus color={colors.iconOnAccent} size={13} strokeWidth={2.5} />
          <Text style={[typography.label, { color: colors.iconOnAccent }]}>Add</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

export function FeaturedCarousel({ onAdd }: FeaturedCarouselProps) {
  if (FEATURED.length === 0) return null;

  return (
    <View style={{ marginBottom: spacing.lg }}>
      <Text
        style={[
          typography.label,
          {
            color: colors.textMuted,
            textTransform: "uppercase",
            letterSpacing: 1,
            paddingHorizontal: spacing.lg,
            marginBottom: spacing.md,
          },
        ]}
      >
        Popular right now
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: spacing.lg }}
      >
        {FEATURED.map((item) => (
          <FeaturedCard key={item.id} item={item} onAdd={onAdd} />
        ))}
      </ScrollView>
    </View>
  );
}
