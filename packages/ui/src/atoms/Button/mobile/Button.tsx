import type { FC } from "react";
import { Pressable, type PressableProps, StyleSheet, Text } from "react-native";

import { buttonToken } from "../tokens";
import type { ButtonBaseProps } from "../types";

const styles = StyleSheet.create({
  button: {
    backgroundColor: buttonToken.backgroundColor,
  },
});

type ButtonProps = ButtonBaseProps & Omit<PressableProps, "children">;

export const Button: FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <Pressable style={styles.button} {...props}>
      <Text>{children}</Text>
    </Pressable>
  );
};
