import { Moon, Sun } from "lucide-react";
import type { MouseEvent, ReactNode } from "react";

import { marginSprinkles } from "@/shared/sprinkles/web";

import { useThemeSwitcher } from "../hooks";
import type { ThemeSwitcherBaseProps } from "../types";

const supportsViewTransitions = () =>
  typeof document !== "undefined" && "startViewTransition" in document;

export const ThemeSwitcher = (props: ThemeSwitcherBaseProps): ReactNode => {
  const { theme, handleSwitchTheme } = useThemeSwitcher();

  const handleSwitch = (e: MouseEvent<HTMLButtonElement>) => {
    if (!supportsViewTransitions()) {
      handleSwitchTheme();
      return;
    }

    const root = document.documentElement;
    root.style.setProperty("--view-transition-x", `${e.clientX}px`);
    root.style.setProperty("--view-transition-y", `${e.clientY}px`);

    const direction = theme === "light" ? "to-dark" : "to-light";
    root.dataset.themeTransition = direction;

    const transition = document.startViewTransition(handleSwitchTheme);

    void transition.finished.then(() => {
      delete root.dataset.themeTransition;
    });
  };

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      className={marginSprinkles(props)}
      onClick={handleSwitch}
    >
      {theme === "light" ? <Moon /> : <Sun />}
    </button>
  );
};
