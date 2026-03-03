import { style } from "@vanilla-extract/css";

import { pageStylesToken } from "../tokens";

export const pageStyles = style({
  ...pageStylesToken,
  maxWidth: "800px",
  marginLeft: "auto",
  marginRight: "auto",
});
