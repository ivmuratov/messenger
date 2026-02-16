import { createNativeSprinkles, defineNativeProperties } from "@/libs";
import { spacingToken } from "@/tokens";

const spacingNativeProperties = defineNativeProperties({
  properties: {
    marginTop: spacingToken,
    marginRight: spacingToken,
    marginBottom: spacingToken,
    marginLeft: spacingToken,
    paddingTop: spacingToken,
    paddingRight: spacingToken,
    paddingBottom: spacingToken,
    paddingLeft: spacingToken,
    gap: spacingToken,
  },
  shorthands: {
    m: ["marginTop", "marginRight", "marginBottom", "marginLeft"],
    mx: ["marginRight", "marginLeft"],
    my: ["marginTop", "marginBottom"],
    mt: ["marginTop"],
    mr: ["marginRight"],
    mb: ["marginBottom"],
    ml: ["marginLeft"],
    p: ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"],
    px: ["paddingRight", "paddingLeft"],
    py: ["paddingTop", "paddingBottom"],
    pt: ["paddingTop"],
    pr: ["paddingRight"],
    pb: ["paddingBottom"],
    pl: ["paddingLeft"],
  },
});

export const spacingNativeSprinkles = createNativeSprinkles(spacingNativeProperties);
