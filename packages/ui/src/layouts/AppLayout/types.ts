import type { PropsWithChildren } from "react";

export type AppLayoutAsideBaseProps = PropsWithChildren;
export type AppLayoutMainBaseProps = PropsWithChildren;

export interface AppLayoutRootBaseProps extends PropsWithChildren {
  isOpened?: boolean;
  onOpen?: (isOpened: boolean) => void;
}
