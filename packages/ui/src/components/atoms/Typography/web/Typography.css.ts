import { styleVariants } from "@vanilla-extract/css";

import { fontWeightToken, textSizeToken } from "@/tokens";

export const textSizeStyles = styleVariants(textSizeToken, ({ fontSize, lineHeight }) => ({
  fontSize: `${fontSize}px`,
  lineHeight: `${lineHeight}px`,
}));

export const fontWeightStyles = styleVariants(fontWeightToken, (value) => ({
  fontWeight: value,
}));
