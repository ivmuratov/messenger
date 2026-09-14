import { fontWeightToken, textSizeToken } from "@/shared/tokens";
import { nativeVariants } from "@/shared/utils";

export const textSizeVariants = nativeVariants(textSizeToken);

export const fontWeightVariants = nativeVariants(fontWeightToken, (value) => ({
  fontWeight: value,
}));
