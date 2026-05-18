import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { forwardRef, useCallback, useMemo } from "react";
import { Pressable, Text, View } from "react-native";

import { colors, spacing, springSheet, typography } from "../lib/theme";
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
      animationConfigs={springSheet}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: colors.surface }}
      handleIndicatorStyle={{
        backgroundColor: colors.textMuted,
        width: spacing.xxl + spacing.sm,
      }}
    >
      <BottomSheetView style={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl }}>
        <Text style={[typography.title, { color: colors.textPrimary }]}>
          {item?.name}
        </Text>
        <Text
          style={[
            typography.caption,
            { color: colors.textSecondary, marginTop: spacing.xs },
          ]}
        >
          Select an option
        </Text>

        <View style={{ marginTop: spacing.lg, gap: spacing.md }}>
          {item?.customizations.map((option) => (
            <Pressable
              key={option}
              accessibilityRole="button"
              onPress={() => onSelect(option)}
              style={{
                borderRadius: spacing.sm,
                borderWidth: 1,
                borderColor: colors.borderMuted,
                backgroundColor: colors.base,
                paddingVertical: spacing.md,
              }}
            >
              <Text
                style={[
                  typography.bodyMedium,
                  { color: colors.textPrimary, textAlign: "center" },
                ]}
              >
                {option}
              </Text>
            </Pressable>
          ))}
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});
