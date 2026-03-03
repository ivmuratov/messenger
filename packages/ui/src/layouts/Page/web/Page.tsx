import type { ReactNode } from "react";

import type { PageBaseProps } from "../types";
import { pageStyles, pageWrapperStyles } from "./Page.css";

export const Page = ({ children }: PageBaseProps): ReactNode => (
  <main className={pageWrapperStyles}>
    <div className={pageStyles}>{children}</div>
  </main>
);
