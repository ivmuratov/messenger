import { createNativeSprinkles, defineNativeProperties } from "@/libs";
import { spacingToken } from "@/tokens";

const marginNativeProperties = defineNativeProperties({
  properties: {
    marginTop: spacingToken,
    marginRight: spacingToken,
    marginBottom: spacingToken,
    marginLeft: spacingToken,
  },
  shorthands: {
    m: ["marginTop", "marginRight", "marginBottom", "marginLeft"],
    mx: ["marginRight", "marginLeft"],
    my: ["marginTop", "marginBottom"],
    mt: ["marginTop"],
    mr: ["marginRight"],
    mb: ["marginBottom"],
    ml: ["marginLeft"],
  },
});

const paddingNativeProperties = defineNativeProperties({
  properties: {
    paddingTop: spacingToken,
    paddingRight: spacingToken,
    paddingBottom: spacingToken,
    paddingLeft: spacingToken,
  },
  shorthands: {
    p: ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"],
    px: ["paddingRight", "paddingLeft"],
    py: ["paddingTop", "paddingBottom"],
    pt: ["paddingTop"],
    pr: ["paddingRight"],
    pb: ["paddingBottom"],
    pl: ["paddingLeft"],
  },
});

const gapNativeProperties = defineNativeProperties({
  properties: {
    gap: spacingToken,
  },
});

export const marginNativeSprinkles = createNativeSprinkles(marginNativeProperties);
export const paddingNativeSprinkles = createNativeSprinkles(paddingNativeProperties);
export const gapNativeSprinkles = createNativeSprinkles(gapNativeProperties);
export const spacingNativeSprinkles = createNativeSprinkles(
  marginNativeProperties,
  paddingNativeProperties,
  gapNativeProperties
);
