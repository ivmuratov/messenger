import type { FC } from "react";

import type { ButtonBaseProps } from "../types";
import { buttonStyles } from "./Button.css";

interface ButtonProps extends ButtonBaseProps {
  onClick?: VoidFunction;
}

export const Button: FC<ButtonProps> = ({ onClick, children }) => {
  return (
    <button type="button" className={buttonStyles} onClick={onClick}>
      {children}
    </button>
  );
};
