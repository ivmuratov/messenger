import { nativeVariants } from "@/libs/index.native";
import { fontWeightToken, textSizeToken } from "@/tokens";

export const textSizeVariants = nativeVariants(textSizeToken);

export const fontWeightVariants = nativeVariants(fontWeightToken, (value) => ({
  fontWeight: value,
}));
