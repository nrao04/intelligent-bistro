import { Pressable, ScrollView, Text } from "react-native";

import { SUGGESTION_CHIPS } from "./types";

type SuggestionChipsProps = {
  onSelect: (text: string) => void;
};

export function SuggestionChips({ onSelect }: SuggestionChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="px-4 pb-3 gap-2"
    >
      {SUGGESTION_CHIPS.map((chip) => (
        <Pressable
          key={chip}
          accessibilityRole="button"
          onPress={() => onSelect(chip)}
          className="mr-2 rounded-full border border-[#404040] px-4 py-2"
        >
          <Text className="text-sm font-medium text-neutral-200">{chip}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
