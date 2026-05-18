import { Tabs } from "expo-router";
import { View } from "react-native";

import { ChatOverlay } from "../../components/chat/ChatOverlay";
import { CustomTabBar } from "../../components/CustomTabBar";
import { colors } from "../../lib/theme";

export default function TabsLayout() {
  return (
    <View className="flex-1">
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          sceneStyle: { backgroundColor: colors.base },
        }}
      >
        <Tabs.Screen
          name="menu"
          options={{
            title: "Menu",
          }}
        />
        <Tabs.Screen
          name="cart"
          options={{
            title: "Cart",
          }}
        />
      </Tabs>
      <ChatOverlay />
    </View>
  );
}
