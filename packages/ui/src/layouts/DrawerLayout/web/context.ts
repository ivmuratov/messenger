import { createContext, useContext } from "react";

export const DrawerLayoutContext = createContext<{
  isOpened: boolean;
} | null>(null);

export const useDrawerLayoutContext = () => {
  const ctx = useContext(DrawerLayoutContext);

  if (!ctx) {
    throw new Error("DrawerLayout.Aside and DrawerLayout.Main must be used within DrawerLayout");
  }

  return ctx;
};
