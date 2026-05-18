import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { forwardRef, useCallback, useMemo } from "react";
import { Pressable, Text, View } from "react-native";

import type { MenuItem } from "@shared/menuItems";

type CustomizationSheetProps = {
  item: MenuItem | null;
  onSelect: (customization: string) => void;
};

export const CustomizationSheet = forwardRef<
  BottomSheetModal,
  CustomizationSheetProps
>(function CustomizationSheet({ item, onSelect }, ref) {
  const snapPoints = useMemo(() => ["42%"], []);

  const renderBackdrop = useCallback(
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.65}
      />
    ),
    []
  );

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: "#222222" }}
      handleIndicatorStyle={{ backgroundColor: "#737373", width: 40 }}
    >
      <BottomSheetView className="px-4 pb-8">
        <Text className="text-lg font-semibold text-white">{item?.name}</Text>
        <Text className="mt-1 text-sm text-neutral-400">Select an option</Text>

        <View className="mt-4 gap-3">
          {item?.customizations.map((option) => (
            <Pressable
              key={option}
              accessibilityRole="button"
              onPress={() => onSelect(option)}
              className="rounded-lg border border-[#404040] bg-[#1a1a1a] py-3"
            >
              <Text className="text-center text-base font-medium text-white">
                {option}
              </Text>
            </Pressable>
          ))}
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});
