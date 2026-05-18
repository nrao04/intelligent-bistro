import "./global.css";

import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-neutral-900">
      <Text className="text-lg font-semibold text-amber-500">
        The Intelligent Bistro
      </Text>
      <StatusBar style="light" />
    </View>
  );
}
