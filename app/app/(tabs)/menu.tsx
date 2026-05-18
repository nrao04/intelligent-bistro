import { BottomSheetModal } from "@gorhom/bottom-sheet";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { ShoppingCart } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
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
    <SafeAreaView className="flex-1 bg-[#1a1a1a]" edges={["top"]}>
      <View className="flex-row items-center justify-between px-4 pb-4 pt-2">
        <Text className="text-2xl font-semibold tracking-tight text-white">
          The Intelligent Bistro
        </Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open cart"
          onPress={() => router.push("/cart")}
          className="relative p-2"
        >
          <ShoppingCart color="#ffffff" size={24} strokeWidth={2} />
          <CartBadge count={itemCount} />
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="px-4 pb-4 gap-2"
      >
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category.key;
          return (
            <Pressable
              key={category.key}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              onPress={() => setSelectedCategory(category.key)}
              className={`mr-2 rounded-full border px-4 py-2 ${
                isSelected
                  ? "border-[#f59e0b] bg-[#f59e0b]"
                  : "border-[#404040] bg-transparent"
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  isSelected ? "text-white" : "text-neutral-400"
                }`}
              >
                {category.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View className="relative flex-1">
        {isLoading ? (
          <Animated.View style={skeletonStyle} className="absolute inset-0">
            <MenuSkeletonList />
          </Animated.View>
        ) : null}

        <Animated.View
          style={contentStyle}
          className={`flex-1 ${isLoading ? "absolute inset-0" : ""}`}
          pointerEvents={isLoading ? "none" : "auto"}
        >
          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <MenuItemCard item={item} onAdd={handleAddPress} />
            )}
            contentContainerClassName="px-4 pb-8"
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
