import { createContext, useContext } from "react";
import type { GestureType } from "react-native-gesture-handler";

export const DrawerLayoutContext = createContext<{
  asideColumnWidth: number;
  mainColumnWidth: number;
  isOpened: boolean;
  onOpen?: (open: boolean) => void;
  mainPanGesture: GestureType;
  asidePanGesture: GestureType;
} | null>(null);

export const useDrawerLayoutContext = () => {
  const ctx = useContext(DrawerLayoutContext);

  if (!ctx) {
    throw new Error("DrawerLayout.Aside and DrawerLayout.Main must be used within DrawerLayout");
  }

  return ctx;
};
