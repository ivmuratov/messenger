import type { FC } from "react";
import { Pressable, type PressableProps, Text } from "react-native";

import type { ButtonBaseProps } from "../types";
import { buttonStyles } from "./Button.styles";

type ButtonProps = ButtonBaseProps & Omit<PressableProps, "children">;

export const Button: FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <Pressable style={buttonStyles.button} {...props}>
      <Text>{children}</Text>
    </Pressable>
  );
};
