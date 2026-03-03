import type { ReactNode } from "react";

import type { HeaderBaseProps } from "../types";
import { headerStyles } from "./Header.css";

export const Header = ({ children }: HeaderBaseProps): ReactNode => {
  return <header className={headerStyles}>{children}</header>;
};
