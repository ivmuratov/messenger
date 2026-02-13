import type { FC } from "react";

import type { FlexPropsBase } from "../types";
import { flexStyles } from "./Flex.css";

export const Flex: FC<FlexPropsBase> = ({
  children,
  direction = "column",
  justifyContent = "start",
  alignItems = "start",
  alignContent = "start",
  alignSelf = "start",
}) => {
  return (
    <div
      className={flexStyles({
        direction,
        justifyContent,
        alignItems,
        alignContent,
        alignSelf,
      })}
    >
      {children}
    </div>
  );
};
