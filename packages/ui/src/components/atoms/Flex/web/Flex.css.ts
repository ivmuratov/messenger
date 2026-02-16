import { recipe } from "@vanilla-extract/recipes";

import { flexVariantsToken } from "../tokens";

export const flexStyles = recipe({
  base: {
    display: "flex",
  },
  variants: flexVariantsToken,
});
