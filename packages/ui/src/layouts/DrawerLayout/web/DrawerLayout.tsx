import type { ReactNode } from "react";

import type {
  DrawerLayoutAsideBaseProps,
  DrawerLayoutMainBaseProps,
  DrawerLayoutRootBaseProps,
} from "../types";
import {
  drawerLayoutAsideStyles,
  drawerLayoutMainStyles,
  drawerLayoutRootStyles,
} from "./DrawerLayout.css";

const DrawerLayoutAside = ({ children }: DrawerLayoutAsideBaseProps): ReactNode => {
  return <aside className={drawerLayoutAsideStyles}>{children}</aside>;
};

const DrawerLayoutMain = ({ children }: DrawerLayoutMainBaseProps): ReactNode => {
  return <div className={drawerLayoutMainStyles}>{children}</div>;
};

const DrawerLayoutRoot = ({ children }: DrawerLayoutRootBaseProps): ReactNode => {
  return <div className={drawerLayoutRootStyles}>{children}</div>;
};

export const DrawerLayout = Object.assign(DrawerLayoutRoot, {
  Aside: DrawerLayoutAside,
  Main: DrawerLayoutMain,
});
