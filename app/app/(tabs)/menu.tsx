import { BottomSheetModal } from "@gorhom/bottom-sheet";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { ShoppingCart } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FlatList, Pressable, ScrollView, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { CartBadge } from "../../components/CartBadge";
import { CustomizationSheet } from "../../components/CustomizationSheet";
import { MenuItemCard } from "../../components/MenuItemCard";
import { MenuSkeletonList } from "../../components/MenuSkeletonList";
import { useCart } from "../../context/CartContext";
import { colors, fabOffset, spacing, typography } from "../../lib/theme";
import { menuItems, type MenuCategory, type MenuItem } from "@shared/menuItems";

type CategoryFilter = "all" | MenuCategory;

const CATEGORIES: { key: CategoryFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "mains", label: "Mains" },
  { key: "sides", label: "Sides" },
  { key: "drinks", label: "Drinks" },
];

export default function MenuScreen() {
  const router = useRouter();
  const { itemCount, addItem } = useCart();

  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [pendingItem, setPendingItem] = useState<MenuItem | null>(null);

  const sheetRef = useRef<BottomSheetModal>(null);
  const skeletonOpacity = useSharedValue(1);
  const contentOpacity = useSharedValue(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      skeletonOpacity.value = withTiming(0, { duration: 320 });
      contentOpacity.value = withTiming(1, { duration: 320 });
    }, 800);

    return () => clearTimeout(timer);
  }, [contentOpacity, skeletonOpacity]);

  const filteredItems = useMemo(() => {
    if (selectedCategory === "all") {
      return menuItems;
    }
    return menuItems.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  const skeletonStyle = useAnimatedStyle(() => ({
    opacity: skeletonOpacity.value,
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  const addWithHaptic = useCallback(
    (item: MenuItem, customization?: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      addItem(item, 1, customization);
    },
    [addItem]
  );

  const handleAddPress = useCallback(
    (item: MenuItem) => {
      if (item.customizations.length > 0) {
        setPendingItem(item);
        sheetRef.current?.present();
        return;
      }
      addWithHaptic(item);
    },
    [addWithHaptic]
  );

  const handleCustomizationSelect = useCallback(
    (customization: string) => {
      if (!pendingItem) return;
      addWithHaptic(pendingItem, customization);
      setPendingItem(null);
      sheetRef.current?.dismiss();
    },
    [addWithHaptic, pendingItem]
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.base }} edges={["top"]}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: spacing.lg,
          paddingBottom: spacing.lg,
          paddingTop: spacing.sm,
        }}
      >
        <Text style={[typography.heading, { color: colors.textPrimary }]}>
          The Intelligent Bistro
        </Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open cart"
          onPress={() => router.push("/cart")}
          style={{ position: "relative", padding: spacing.sm }}
        >
          <ShoppingCart color={colors.textPrimary} size={24} strokeWidth={2} />
          <CartBadge count={itemCount} />
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingBottom: spacing.lg,
          gap: spacing.sm,
          alignItems: "flex-start",
        }}
      >
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category.key;
          return (
            <Pressable
              key={category.key}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              onPress={() => setSelectedCategory(category.key)}
              style={{
                marginRight: spacing.sm,
                borderRadius: 999,
                borderWidth: 1,
                borderColor: isSelected ? colors.accent : colors.borderMuted,
                backgroundColor: isSelected ? colors.accent : "transparent",
                paddingHorizontal: spacing.lg,
                paddingVertical: spacing.sm,
              }}
            >
              <Text
                style={[
                  typography.label,
                  {
                    color: isSelected ? colors.iconOnAccent : colors.textSecondary,
                  },
                ]}
              >
                {category.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={{ position: "relative", flex: 1 }}>
        {isLoading ? (
          <Animated.View style={[skeletonStyle, { position: "absolute", inset: 0 }]}>
            <MenuSkeletonList />
          </Animated.View>
        ) : null}

        <Animated.View
          style={[
            contentStyle,
            { flex: 1 },
            isLoading ? { position: "absolute", inset: 0 } : null,
          ]}
          pointerEvents={isLoading ? "none" : "auto"}
        >
          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <MenuItemCard item={item} onAdd={handleAddPress} />
            )}
            contentContainerStyle={{
              paddingHorizontal: spacing.lg,
              paddingBottom: fabOffset + spacing.xl,
            }}
            showsVerticalScrollIndicator={false}
          />
        </Animated.View>
      </View>

      <CustomizationSheet
        ref={sheetRef}
        item={pendingItem}
        onSelect={handleCustomizationSelect}
      />
    </SafeAreaView>
  );
}
