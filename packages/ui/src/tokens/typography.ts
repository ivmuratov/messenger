import type { FontWeightScale, TextSizeScale } from "@/types";

export const textSizeToken = {
  "10_14": { fontSize: 10, lineHeight: 14 },
  "12_16": { fontSize: 12, lineHeight: 16 },
  "14_20": { fontSize: 14, lineHeight: 20 },
  "16_24": { fontSize: 16, lineHeight: 24 },
  "18_28": { fontSize: 18, lineHeight: 28 },
  "20_28": { fontSize: 20, lineHeight: 28 },
  "24_32": { fontSize: 24, lineHeight: 32 },
  "32_40": { fontSize: 32, lineHeight: 40 },
} as const satisfies Record<TextSizeScale, { fontSize: number; lineHeight: number }>;

export const fontWeightToken = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const satisfies Record<FontWeightScale, number>;
