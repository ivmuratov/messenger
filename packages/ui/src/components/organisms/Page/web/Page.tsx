import type { ReactNode } from "react";

import { Flex } from "@/components/atoms/Flex";

import type { PageBaseProps } from "../types";
import { pageStyles } from "./Page.css";

export const Page = ({ children }: PageBaseProps): ReactNode => (
  <Flex as="main" className={pageStyles}>
    {children}
  </Flex>
);
