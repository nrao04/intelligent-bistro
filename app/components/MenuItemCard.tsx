import { Plus } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import { formatPrice } from "../lib/format";
import { getMenuIcon } from "../lib/menuIcon";
import type { MenuItem } from "@shared/menuItems";

type MenuItemCardProps = {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
};

export function MenuItemCard({ item, onAdd }: MenuItemCardProps) {
  const Icon = getMenuIcon(item.icon);

  return (
    <View className="mb-3 flex-row rounded-xl border border-[#2e2e2e] bg-[#222222] p-4">
      <View className="mr-4 h-12 w-12 items-center justify-center rounded-lg bg-[#2e2e2e]">
        <Icon color="#f59e0b" size={24} strokeWidth={2} />
      </View>

      <View className="flex-1 pr-3">
        <View className="flex-row flex-wrap items-center gap-2">
          <Text className="flex-shrink text-base font-semibold text-white">
            {item.name}
          </Text>
          {item.isPopular ? (
            <Text className="text-xs font-medium text-[#f59e0b]">Popular</Text>
          ) : null}
        </View>

        <Text
          className="mt-1 text-sm leading-5 text-neutral-400"
          numberOfLines={2}
        >
          {item.description}
        </Text>

        <View className="mt-2 flex-row items-center gap-3">
          <Text className="text-sm font-medium text-white">
            {formatPrice(item.price)}
          </Text>
          <Text className="text-sm text-neutral-500">{item.calories} cal</Text>
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Add ${item.name} to cart`}
        onPress={() => onAdd(item)}
        className="h-9 items-center justify-center self-center rounded-lg bg-[#f59e0b] px-4"
      >
        <View className="flex-row items-center gap-1">
          <Plus color="#ffffff" size={16} strokeWidth={2.5} />
          <Text className="text-sm font-semibold text-white">Add</Text>
        </View>
      </Pressable>
    </View>
  );
}
