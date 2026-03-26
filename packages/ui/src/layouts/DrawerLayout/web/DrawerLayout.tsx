import clsx from "clsx";
import { type ReactNode, useMemo } from "react";

import type {
  DrawerLayoutAsideBaseProps,
  DrawerLayoutMainBaseProps,
  DrawerLayoutRootBaseProps,
} from "../types";
import { DrawerLayoutContext, useDrawerLayoutContext } from "./context";
import {
  drawerLayoutAsideCollapsedStyles,
  drawerLayoutAsideStyles,
  drawerLayoutMainStyles,
  drawerLayoutRootStyles,
} from "./DrawerLayout.css";

const DrawerLayoutAside = ({ children }: DrawerLayoutAsideBaseProps): ReactNode => {
  const { isOpened } = useDrawerLayoutContext();

  return (
    <aside
      aria-hidden={!isOpened}
      className={clsx(drawerLayoutAsideStyles, !isOpened && drawerLayoutAsideCollapsedStyles)}
    >
      {children}
    </aside>
  );
};

const DrawerLayoutMain = ({ children }: DrawerLayoutMainBaseProps): ReactNode => {
  return <main className={drawerLayoutMainStyles}>{children}</main>;
};

const DrawerLayoutRoot = ({ children, isOpened = false }: DrawerLayoutRootBaseProps): ReactNode => {
  const context = useMemo(
    () => ({
      isOpened,
    }),
    [isOpened]
  );

  return (
    <DrawerLayoutContext.Provider value={context}>
      <div className={drawerLayoutRootStyles}>{children}</div>
    </DrawerLayoutContext.Provider>
  );
};

export const DrawerLayout = Object.assign(DrawerLayoutRoot, {
  Aside: DrawerLayoutAside,
  Main: DrawerLayoutMain,
});
