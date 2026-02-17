import { styleVariants } from "@vanilla-extract/css";

import { fontWeightToken, textSizeToken } from "@/tokens";

export const textSizeVariants = styleVariants(textSizeToken, ({ fontSize, lineHeight }) => ({
  fontSize: `${fontSize}px`,
  lineHeight: `${lineHeight}px`,
}));

export const fontWeightVariants = styleVariants(fontWeightToken, (value) => ({
  fontWeight: value,
}));
