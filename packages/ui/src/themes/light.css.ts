import { createTheme } from "@vanilla-extract/css";

import { theme } from "./theme.css";
import { lightToken } from "./tokens";

export const light = createTheme(theme, lightToken);
