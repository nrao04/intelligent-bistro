export type MenuCategory = "mains" | "sides" | "drinks";

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  icon: string;
  calories: number;
  isPopular: boolean;
  customizations: string[];
};

export const menuItems: MenuItem[] = [
  {
    id: "mains-001",
    name: "Spicy Crispy Chicken Sandwich",
    description:
      "Double-fried thigh, ghost pepper aioli, pickled slaw, brioche bun",
    price: 14.5,
    category: "mains",
    icon: "sandwich",
    calories: 720,
    isPopular: true,
    customizations: ["Regular", "Extra Spicy", "No Sauce"],
  },
  {
    id: "mains-002",
    name: "Wagyu Smash Burger",
    description:
      "Two seared patties, aged cheddar, caramelized onion jam, potato bun",
    price: 18.0,
    category: "mains",
    icon: "beef",
    calories: 890,
    isPopular: true,
    customizations: ["Medium", "Well Done", "No Onion"],
  },
  {
    id: "mains-003",
    name: "Grilled Atlantic Salmon",
    description:
      "Citrus herb butter, charred broccolini, lemon dill yogurt",
    price: 24.0,
    category: "mains",
    icon: "fish",
    calories: 540,
    isPopular: false,
    customizations: ["Medium", "Well Done"],
  },
  {
    id: "mains-004",
    name: "Wild Mushroom Risotto",
    description:
      "Arborio rice, porcini stock, parmesan crisp, truffle oil finish",
    price: 19.5,
    category: "mains",
    icon: "utensils",
    calories: 610,
    isPopular: false,
    customizations: [],
  },
  {
    id: "mains-005",
    name: "Korean BBQ Short Rib Bowl",
    description:
      "Braised galbi, jasmine rice, kimchi, sesame scallions, gochujang glaze",
    price: 21.0,
    category: "mains",
    icon: "drumstick",
    calories: 780,
    isPopular: true,
    customizations: ["Mild", "Spicy", "Extra Rice"],
  },
  {
    id: "sides-001",
    name: "Truffle Parmesan Fries",
    description:
      "Hand-cut russets, white truffle oil, pecorino, fresh chives",
    price: 8.5,
    category: "sides",
    icon: "cooking-pot",
    calories: 420,
    isPopular: true,
    customizations: [],
  },
  {
    id: "sides-002",
    name: "Charred Broccolini",
    description:
      "Blistered broccolini, garlic confit, chili flakes, lemon zest",
    price: 7.0,
    category: "sides",
    icon: "salad",
    calories: 180,
    isPopular: false,
    customizations: [],
  },
  {
    id: "sides-003",
    name: "Heritage Grain Caesar",
    description:
      "Little gem, farro croutons, white anchovy, aged parmesan dressing",
    price: 9.5,
    category: "sides",
    icon: "wheat",
    calories: 320,
    isPopular: false,
    customizations: ["Classic Dressing", "Light Dressing", "No Anchovy"],
  },
  {
    id: "sides-004",
    name: "House Pickles and Chili Oil",
    description:
      "Seasonal quick pickles, Sichuan chili crisp, toasted sesame",
    price: 6.0,
    category: "sides",
    icon: "flame",
    calories: 90,
    isPopular: false,
    customizations: [],
  },
  {
    id: "drinks-001",
    name: "Sparkling Mineral Water",
    description: "Chilled glass bottle, lime wheel on request",
    price: 4.0,
    category: "drinks",
    icon: "glass-water",
    calories: 0,
    isPopular: false,
    customizations: ["Regular", "Large"],
  },
  {
    id: "drinks-002",
    name: "Craft Cold Brew",
    description:
      "24-hour steep, single-origin Colombian, touch of oat milk",
    price: 5.5,
    category: "drinks",
    icon: "coffee",
    calories: 15,
    isPopular: true,
    customizations: ["Black", "Oat Milk", "Extra Shot"],
  },
  {
    id: "drinks-003",
    name: "Spiced Ginger Paloma",
    description:
      "Reposado tequila, fresh grapefruit, ginger syrup, smoked salt rim",
    price: 13.0,
    category: "drinks",
    icon: "citrus",
    calories: 210,
    isPopular: false,
    customizations: ["Regular", "Less Sweet", "No Salt Rim"],
  },
  {
    id: "drinks-004",
    name: "Diet Cola",
    description: "Fountain pour over pebble ice, lemon optional",
    price: 3.5,
    category: "drinks",
    icon: "cup-soda",
    calories: 0,
    isPopular: true,
    customizations: [],
  },
];
