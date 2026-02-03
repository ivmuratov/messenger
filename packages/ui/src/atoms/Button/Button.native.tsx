import type { FC } from "react";
import { Pressable, type PressableProps, Text } from "react-native";

import { styles } from "./styles.native";
import type { ButtonBaseProps } from "./types";

interface ButtonProps extends ButtonBaseProps, Omit<PressableProps, "children"> {}

export const Button: FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <Pressable style={styles.button} {...props}>
      <Text>{children}</Text>
    </Pressable>
  );
};
