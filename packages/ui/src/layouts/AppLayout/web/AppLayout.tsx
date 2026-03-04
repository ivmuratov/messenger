import type { ReactNode } from "react";

import type {
  AppLayoutAsideBaseProps,
  AppLayoutMainBaseProps,
  AppLayoutRootBaseProps,
} from "../types";
import { appLayoutAsideStyles, appLayoutMainStyles, appLayoutRootStyles } from "./AppLayout.css";

const AppLayoutAside = ({ children }: AppLayoutAsideBaseProps): ReactNode => {
  return <div className={appLayoutAsideStyles}>{children}</div>;
};

const AppLayoutMain = ({ children }: AppLayoutMainBaseProps): ReactNode => {
  return <div className={appLayoutMainStyles}>{children}</div>;
};

const AppLayoutRoot = ({ children }: AppLayoutRootBaseProps): ReactNode => {
  return <div className={appLayoutRootStyles}>{children}</div>;
};

export const AppLayout = Object.assign(AppLayoutRoot, {
  Aside: AppLayoutAside,
  Main: AppLayoutMain,
});
