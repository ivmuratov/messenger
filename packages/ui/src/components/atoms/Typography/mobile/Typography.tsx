import type { ReactNode } from "react";
import { Text, type TextProps } from "react-native";

import { useThemedStyles } from "@/themes/ThemeProvider/index.native";

import type { TypographyBaseProps } from "../types";
import { fontWeightVariants, textSizeVariants } from "./Typography.styles";

type TypographyProps = TypographyBaseProps & Omit<TextProps, "children">;

export const Typography = ({
  children,
  t = "16_24",
  fontWeight = "regular",
  ...props
}: TypographyProps): ReactNode => {
  const { defaultColor } = useThemedStyles();

  return (
    <Text
      style={[{ color: defaultColor }, textSizeVariants[t], fontWeightVariants[fontWeight]]}
      {...props}
    >
      {children}
    </Text>
  );
};
