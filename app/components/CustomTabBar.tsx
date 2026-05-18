import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { UtensilsCrossed, ShoppingCart } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ACTIVE = "#f59e0b";
const INACTIVE = "#737373";
const BAR_BG = "#1a1a1a";
const BORDER = "#2e2e2e";

export function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-row border-t"
      style={{
        backgroundColor: BAR_BG,
        borderTopColor: BORDER,
        paddingBottom: Math.max(insets.bottom, 8),
        paddingTop: 8,
      }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.title ?? route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const color = isFocused ? ACTIVE : INACTIVE;
        const Icon = route.name === "menu" ? UtensilsCrossed : ShoppingCart;

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={label}
            onPress={onPress}
            className="flex-1 items-center justify-center py-2"
          >
            <Icon color={color} size={22} strokeWidth={isFocused ? 2.25 : 2} />
            <Text
              className="mt-1 text-xs font-medium"
              style={{ color }}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
