import type { ReactNode } from "react";

import type { HeaderBaseProps, HeaderSectionProps } from "../types";
import {
  headerCenterStyles,
  headerLeftStyles,
  headerRightStyles,
  headerRootStyles,
} from "./Header.css";

const HeaderLeftSide = ({ children }: HeaderSectionProps): ReactNode => {
  return <div className={headerLeftStyles}>{children}</div>;
};

const HeaderCenterSide = ({ children }: HeaderSectionProps): ReactNode => {
  return <div className={headerCenterStyles}>{children}</div>;
};

const HeaderRightSide = ({ children }: HeaderSectionProps): ReactNode => {
  return <div className={headerRightStyles}>{children}</div>;
};

const HeaderRoot = ({ children }: HeaderBaseProps): ReactNode => {
  return <header className={headerRootStyles}>{children}</header>;
};

export const Header = Object.assign(HeaderRoot, {
  LeftSide: HeaderLeftSide,
  CenterSide: HeaderCenterSide,
  RightSide: HeaderRightSide,
});
