import { style } from "@vanilla-extract/css";

import {
  appLayoutAsideStylesToken,
  appLayoutMainStylesToken,
  appLayoutRootStylesToken,
} from "../tokens";

export const appLayoutRootStyles = style({
  ...appLayoutRootStylesToken,
  display: "flex",
  height: "100dvh",
});

export const appLayoutAsideStyles = style(appLayoutAsideStylesToken);

export const appLayoutMainStyles = style(appLayoutMainStylesToken);
