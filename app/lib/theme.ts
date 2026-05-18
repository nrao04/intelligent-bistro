export const colors = {
  base: "#1a1a1a",
  surface: "#222222",
  surfaceRaised: "#262626",
  border: "#2e2e2e",
  borderMuted: "#404040",
  accent: "#f59e0b",
  accentMuted: "#92400e",
  textPrimary: "#ffffff",
  textSecondary: "#a3a3a3",
  textMuted: "#737373",
  iconOnAccent: "#ffffff",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const typography = {
  heading: {
    fontSize: 24,
    fontWeight: "600" as const,
    lineHeight: 32,
  },
  title: {
    fontSize: 18,
    fontWeight: "600" as const,
    lineHeight: 24,
  },
  body: {
    fontSize: 15,
    fontWeight: "400" as const,
    lineHeight: 20,
  },
  bodyMedium: {
    fontSize: 15,
    fontWeight: "500" as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 13,
    fontWeight: "400" as const,
    lineHeight: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: "500" as const,
    lineHeight: 16,
  },
};

export const springSheet = {
  damping: 18,
  stiffness: 200,
  mass: 0.85,
  overshootClamping: false,
};

export const fabOffset = 96;
