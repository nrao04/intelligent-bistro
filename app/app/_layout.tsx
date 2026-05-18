import "../global.css";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { AppToast } from "../components/AppToast";
import { CartProvider } from "../context/CartContext";

export default function RootLayout() {
  return (
    <GestureHandlerRootView className="flex-1 bg-[#1a1a1a]">
      <CartProvider>
        <BottomSheetModalProvider>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "#1a1a1a" },
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" />
          </Stack>
          <AppToast />
        </BottomSheetModalProvider>
      </CartProvider>
    </GestureHandlerRootView>
  );
}
