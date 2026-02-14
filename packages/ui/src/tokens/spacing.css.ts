import { createSprinkles, defineProperties } from "@vanilla-extract/sprinkles";

import { spacingToken } from "./spacing";

type SpacingToken = typeof spacingToken;
type SpacingTokenWithPx = {
  [SpacingKey in keyof SpacingToken]: `${SpacingToken[SpacingKey]}px`;
};

const spacingTokenWithPx = Object.entries(spacingToken).reduce(
  (acc, [key, value]) => ({ ...acc, [key]: `${value}px` }),
  {} as SpacingTokenWithPx
);

const spacingProperties = defineProperties({
  properties: {
    marginTop: spacingTokenWithPx,
    marginRight: spacingTokenWithPx,
    marginBottom: spacingTokenWithPx,
    marginLeft: spacingTokenWithPx,
    paddingTop: spacingTokenWithPx,
    paddingRight: spacingTokenWithPx,
    paddingBottom: spacingTokenWithPx,
    paddingLeft: spacingTokenWithPx,
    gap: spacingTokenWithPx,
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

export const spacingSprinkles = createSprinkles(spacingProperties);
