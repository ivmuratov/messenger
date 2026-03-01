import { createContext, type Dispatch, type SetStateAction } from "react";

import type { Theme } from "./types";

export const ThemeContext = createContext<Theme>("light");
export const SetThemeContext = createContext<Dispatch<SetStateAction<Theme>>>(() => {});
