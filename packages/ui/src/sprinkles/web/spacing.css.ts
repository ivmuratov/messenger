import { createSprinkles, defineProperties } from "@vanilla-extract/sprinkles";

import { spacingToken } from "@/tokens";

type SpacingToken = typeof spacingToken;
type SpacingTokenWithPx = {
  [SpacingKey in keyof SpacingToken]: `${SpacingToken[SpacingKey]}px`;
};

const spacingTokenWithPx = Object.entries(spacingToken).reduce(
  (acc, [key, value]) => ({ ...acc, [key]: `${value}px` }),
  {} as SpacingTokenWithPx
);

const marginProperties = defineProperties({
  properties: {
    marginTop: spacingTokenWithPx,
    marginRight: spacingTokenWithPx,
    marginBottom: spacingTokenWithPx,
    marginLeft: spacingTokenWithPx,
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

const paddingProperties = defineProperties({
  properties: {
    paddingTop: spacingTokenWithPx,
    paddingRight: spacingTokenWithPx,
    paddingBottom: spacingTokenWithPx,
    paddingLeft: spacingTokenWithPx,
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

const gapProperties = defineProperties({
  properties: {
    gap: spacingTokenWithPx,
  },
});

export const marginSprinkles = createSprinkles(marginProperties);
export const paddingSprinkles = createSprinkles(paddingProperties);
export const gapSprinkles = createSprinkles(gapProperties);
export const spacingSprinkles = createSprinkles(marginProperties, paddingProperties, gapProperties);
