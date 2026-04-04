import { Platform } from "react-native";

export const fonts = {
  heading: {
    family: Platform.select({
      ios: "PlayfairDisplay-Bold",
      android: "PlayfairDisplay-Bold",
      default: "PlayfairDisplay-Bold",
    }),
    regular: Platform.select({
      ios: "PlayfairDisplay-Regular",
      android: "PlayfairDisplay-Regular",
      default: "PlayfairDisplay-Regular",
    }),
  },
  body: {
    family: Platform.select({
      ios: "Lato-Regular",
      android: "Lato-Regular",
      default: "Lato-Regular",
    }),
    familyBold: Platform.select({
      ios: "Lato-Bold",
      android: "Lato-Bold",
      default: "Lato-Bold",
    }),
    bold: Platform.select({
      ios: "Lato-Bold",
      android: "Lato-Bold",
      default: "Lato-Bold",
    }),
    light: Platform.select({
      ios: "Lato-Light",
      android: "Lato-Light",
      default: "Lato-Light",
    }),
  },
} as const;

export const fontSizes = {
  xs: 10,
  sm: 12,
  md: 14,
  base: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 28,
  "4xl": 32,
  "5xl": 40,
} as const;

export const lineHeights = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.7,
} as const;

export const letterSpacing = {
  tight: -0.5,
  normal: 0,
  wide: 0.5,
  wider: 1,
  widest: 2,
  button: 1.3,
} as const;
