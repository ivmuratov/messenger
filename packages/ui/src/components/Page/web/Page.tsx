import { type ReactNode } from "react";

import { Flex } from "@/components/Flex/web";

import { type PageBodyBaseProps, type PageHeaderBaseProps, type PageRootBaseProps } from "../types";
import { pageBodyStyles, pageHeaderStyles, pageRootStyles } from "./Page.css";

const PageHeader = ({ children }: PageHeaderBaseProps): ReactNode => {
  return (
    <header className={pageHeaderStyles}>
      <Flex alignItems="center" direction="row" gap="sm">
        {children}
      </Flex>
    </header>
  );
};

const PageBody = ({ children }: PageBodyBaseProps): ReactNode => (
  <div className={pageBodyStyles}>{children}</div>
);

const PageRoot = ({ children }: PageRootBaseProps): ReactNode => (
  <div className={pageRootStyles}>{children}</div>
);

export const Page = Object.assign(PageRoot, {
  Header: PageHeader,
  Body: PageBody,
});
