import { createContext, useContext } from "react";

export const AppLayoutContext = createContext<{
  asideColumnWidth: number;
  mainColumnWidth: number;
} | null>(null);

export const useAppLayoutContext = () => {
  const ctx = useContext(AppLayoutContext);

  if (!ctx) {
    throw new Error("AppLayout.Aside and AppLayout.Main must be used within AppLayout");
  }

  return ctx;
};
