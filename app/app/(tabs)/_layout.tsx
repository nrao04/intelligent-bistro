import { Tabs } from "expo-router";

import { CustomTabBar } from "../../components/CustomTabBar";

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: "#1a1a1a" },
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
  );
}
