import {
  Beef,
  Citrus,
  Coffee,
  CookingPot,
  CupSoda,
  Drumstick,
  Fish,
  Flame,
  GlassWater,
  Salad,
  Sandwich,
  Utensils,
  Wheat,
  type LucideIcon,
} from "lucide-react-native";

const iconMap: Record<string, LucideIcon> = {
  sandwich: Sandwich,
  beef: Beef,
  fish: Fish,
  utensils: Utensils,
  drumstick: Drumstick,
  "cooking-pot": CookingPot,
  salad: Salad,
  wheat: Wheat,
  flame: Flame,
  "glass-water": GlassWater,
  coffee: Coffee,
  citrus: Citrus,
  "cup-soda": CupSoda,
};

export function getMenuIcon(iconName: string): LucideIcon {
  return iconMap[iconName] ?? Utensils;
}
