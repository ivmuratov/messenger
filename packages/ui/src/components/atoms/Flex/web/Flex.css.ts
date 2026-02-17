import { recipe } from "@vanilla-extract/recipes";

import { flexVariantsToken } from "../tokens";

export const flexVariants = recipe({
  base: {
    display: "flex",
  },
  variants: flexVariantsToken,
});
