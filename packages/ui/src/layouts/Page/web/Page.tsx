import type { ReactNode } from "react";

import type { PageBaseProps } from "../types";
import { pageStyles } from "./Page.css";

export const Page = ({ children }: PageBaseProps): ReactNode => (
  <main className={pageStyles}>{children}</main>
);
