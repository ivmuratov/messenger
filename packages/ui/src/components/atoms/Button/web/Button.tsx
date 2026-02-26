import type { ReactNode } from "react";

import type { ButtonBaseProps } from "../types";
import { buttonStyles } from "./Button.css";

interface ButtonProps extends ButtonBaseProps {
  onClick?: VoidFunction;
}

export const Button = ({ onClick, children }: ButtonProps): ReactNode => {
  return (
    <button type="button" className={buttonStyles} onClick={onClick}>
      {children}
    </button>
  );
};
