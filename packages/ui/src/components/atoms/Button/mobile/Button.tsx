import type { ReactNode } from "react";
import { Pressable, type PressableProps, Text } from "react-native";

import type { ButtonBaseProps } from "../types";
import { buttonStyles } from "./Button.styles";

type ButtonProps = ButtonBaseProps & Omit<PressableProps, "children">;

export const Button = ({ children, ...props }: ButtonProps): ReactNode => {
  return (
    <Pressable style={buttonStyles.button} {...props}>
      <Text>{children}</Text>
    </Pressable>
  );
};
