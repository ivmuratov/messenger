import { createContext, useContext } from "react";
import type { GestureType } from "react-native-gesture-handler";

export const AppLayoutContext = createContext<{
  asideColumnWidth: number;
  mainColumnWidth: number;
  isOpened: boolean;
  onOpen?: (open: boolean) => void;
  mainPanGesture: GestureType;
  asidePanGesture: GestureType;
} | null>(null);

export const useAppLayoutContext = () => {
  const ctx = useContext(AppLayoutContext);

  if (!ctx) {
    throw new Error("AppLayout.Aside and AppLayout.Main must be used within AppLayout");
  }

  return ctx;
};
