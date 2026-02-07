import { createTheme } from "@vanilla-extract/css";

import { theme } from "./theme.css";
import { darkToken } from "./tokens";

export const dark = createTheme(theme, darkToken);
