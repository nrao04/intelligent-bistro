import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { UtensilsCrossed, ShoppingCart } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useCart } from "../context/CartContext";
import { CartBadge } from "./CartBadge";
import { colors, spacing, typography } from "../lib/theme";

export function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { itemCount } = useCart();

  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: "#111111",
        borderTopColor: "#2a2a2a",
        borderTopWidth: 1,
        paddingBottom: Math.max(insets.bottom, spacing.sm),
        paddingTop: spacing.sm,
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

        const color = isFocused ? colors.accent : colors.textMuted;
        const Icon = route.name === "menu" ? UtensilsCrossed : ShoppingCart;
        const isCart = route.name === "cart";

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={label}
            onPress={onPress}
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: spacing.sm,
            }}
          >
            <View style={{ position: "relative" }}>
              <Icon color={color} size={22} strokeWidth={isFocused ? 2.25 : 2} />
              {isCart ? <CartBadge count={itemCount} /> : null}
            </View>
            <Text
              style={[
                typography.label,
                { color, marginTop: spacing.xs },
              ]}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
