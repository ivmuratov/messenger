import { createTheme } from "@vanilla-extract/css";

import { darkToken } from "../tokens";
import { theme } from "./theme.css";

export const dark = createTheme(theme, darkToken);
