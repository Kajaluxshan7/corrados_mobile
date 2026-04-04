export const colors = {
  primary: {
    main: "#BE5953",
    light: "#D4817C",
    dark: "#8E3830",
  },
  secondary: {
    main: "#2C5530",
    light: "#4A7A4F",
    dark: "#1A3A1E",
  },
  background: {
    default: "#FDF8F4",
    paper: "#FFFFFF",
    cream: "#F5EDE4",
    dark: "#2D2926",
  },
  text: {
    primary: "#2D2926",
    secondary: "#5C524D",
    light: "#FFFFFF",
    muted: "#8A8380",
  },
  custom: {
    cream: "#F5EDE4",
    gold: "#C9A96E",
    sage: "#8B9D77",
    wine: "#722F37",
    warmGray: "#E8E0D8",
    ivory: "#FDF8F4",
    charcoal: "#2D2926",
    navy: "#243A7D",
  },
  status: {
    success: "#4CAF50",
    warning: "#FF9800",
    error: "#F44336",
    info: "#2196F3",
  },
  border: {
    light: "#E8E0D8",
    main: "#D4CCC4",
    dark: "#B0A8A0",
  },
} as const;

export type Colors = typeof colors;
