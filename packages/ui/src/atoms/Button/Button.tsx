import type { FC } from "react";

import { buttonStyles } from "./styles.css";
import type { ButtonBaseProps } from "./types";

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
