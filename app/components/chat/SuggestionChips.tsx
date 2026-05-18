import { Pressable, ScrollView, Text } from "react-native";

import { colors, spacing, typography } from "../../lib/theme";
import { SUGGESTION_CHIPS } from "./types";

type SuggestionChipsProps = {
  onSelect: (text: string) => void;
};

export function SuggestionChips({ onSelect }: SuggestionChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.md,
        gap: spacing.sm,
      }}
    >
      {SUGGESTION_CHIPS.map((chip) => (
        <Pressable
          key={chip}
          accessibilityRole="button"
          onPress={() => onSelect(chip)}
          style={{
            marginRight: spacing.sm,
            borderRadius: 999,
            borderWidth: 1,
            borderColor: colors.borderMuted,
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.sm,
          }}
        >
          <Text style={[typography.label, { color: colors.textSecondary }]}>
            {chip}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
