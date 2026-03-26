import type { PropsWithChildren } from "react";

export type DrawerLayoutAsideBaseProps = PropsWithChildren;
export type DrawerLayoutMainBaseProps = PropsWithChildren;

export interface DrawerLayoutRootBaseProps extends PropsWithChildren {
  isOpened?: boolean;
}
