import type { ReactNode } from "react";

import type { PageBodyBaseProps, PageHeaderBaseProps, PageRootBaseProps } from "../types";
import { pageBodyStyles, pageHeaderStyles, pageRootStyles } from "./Page.css";

const PageHeader = ({ children }: PageHeaderBaseProps): ReactNode => {
  return <header className={pageHeaderStyles}>{children}</header>;
};

const PageBody = ({ children }: PageBodyBaseProps): ReactNode => (
  <main className={pageBodyStyles}>{children}</main>
);

const PageRoot = ({ children }: PageRootBaseProps): ReactNode => (
  <div className={pageRootStyles}>{children}</div>
);

export const Page = Object.assign(PageRoot, {
  Header: PageHeader,
  Body: PageBody,
});
