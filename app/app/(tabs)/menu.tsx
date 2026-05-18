import { BottomSheetModal } from "@gorhom/bottom-sheet";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { Coffee, LayoutGrid, Salad, ShoppingCart, UtensilsCrossed } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CartBadge } from "../../components/CartBadge";
import { CustomizationSheet } from "../../components/CustomizationSheet";
import { FeaturedCarousel } from "../../components/FeaturedCarousel";
import { MenuItemCard } from "../../components/MenuItemCard";
import { MenuSkeletonList } from "../../components/MenuSkeletonList";
import { useCart } from "../../context/CartContext";
import { colors, fabOffset, spacing, typography } from "../../lib/theme";
import { menuItems, type MenuCategory, type MenuItem } from "@shared/menuItems";

type CategoryFilter = "all" | MenuCategory;

const CATEGORY_ICONS = {
  all: LayoutGrid,
  mains: UtensilsCrossed,
  sides: Salad,
  drinks: Coffee,
} as const;

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

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const filteredItems = useMemo(() => {
    if (selectedCategory === "all") return menuItems;
    return menuItems.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

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
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: spacing.lg,
          paddingBottom: spacing.md,
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

      {/* Category pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingBottom: spacing.md,
          gap: spacing.sm,
          alignItems: "flex-start",
        }}
      >
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category.key;
          const PillIcon = CATEGORY_ICONS[category.key];
          return (
            <Pressable
              key={category.key}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              onPress={() => setSelectedCategory(category.key)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.xs,
                borderRadius: 999,
                borderWidth: 1,
                borderColor: isSelected ? colors.accent : colors.borderMuted,
                backgroundColor: isSelected ? colors.accent : "transparent",
                paddingHorizontal: spacing.md,
                paddingVertical: 7,
              }}
            >
              <PillIcon
                size={13}
                strokeWidth={2}
                color={isSelected ? colors.iconOnAccent : colors.textSecondary}
              />
              <Text
                style={[
                  typography.label,
                  { color: isSelected ? colors.iconOnAccent : colors.textSecondary },
                ]}
              >
                {category.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Main content */}
      <View style={{ flex: 1 }}>
        {isLoading ? (
          <MenuSkeletonList />
        ) : (
          <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: fabOffset + spacing.xl }}
          >
            {selectedCategory === "all" && (
              <FeaturedCarousel onAdd={handleAddPress} />
            )}

            {selectedCategory !== "all" && (
              <Text
                style={[
                  typography.title,
                  {
                    color: colors.textPrimary,
                    paddingHorizontal: spacing.lg,
                    paddingBottom: spacing.md,
                  },
                ]}
              >
                {CATEGORIES.find((c) => c.key === selectedCategory)?.label}
              </Text>
            )}

            {filteredItems.map((item, index) => (
              <View key={item.id} style={{ paddingHorizontal: spacing.lg }}>
                <MenuItemCard item={item} onAdd={handleAddPress} index={index} />
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      <CustomizationSheet
        ref={sheetRef}
        item={pendingItem}
        onSelect={handleCustomizationSelect}
      />
    </SafeAreaView>
  );
}
