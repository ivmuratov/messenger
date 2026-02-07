import { createTheme } from "@vanilla-extract/css";

import { lightToken } from "../tokens";
import { theme } from "./theme.css";

export const light = createTheme(theme, lightToken);
