import { Moon, Sun } from "lucide-react";
import type { ReactNode } from "react";

import { marginSprinkles } from "@/sprinkles";

import type { ThemeSwitcherBaseProps } from "../types";
import { useThemeSwitcher } from "../useThemeSwitcher";

export const ThemeSwitcher = (props: ThemeSwitcherBaseProps): ReactNode => {
  const { theme, handleToggleTheme } = useThemeSwitcher();

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      className={marginSprinkles(props)}
      onClick={handleToggleTheme}
    >
      {theme === "light" ? <Sun /> : <Moon />}
    </button>
  );
};
