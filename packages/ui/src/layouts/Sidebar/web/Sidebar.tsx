import type { ReactNode } from "react";

import type { SidebarBaseProps } from "../types";
import { sidebarStyles } from "./Sidebar.css";

export const Sidebar = ({ children }: SidebarBaseProps): ReactNode => {
  return <aside className={sidebarStyles}>{children}</aside>;
};
