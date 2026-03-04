import type { ReactNode } from "react";
import { Animated, type TextProps } from "react-native";

import { useThemedNativeStyles } from "@/themes/index.native";

import type { TypographyBaseProps } from "../types";
import { fontWeightVariants, textSizeVariants } from "./Typography.styles";

type TypographyProps = TypographyBaseProps & Omit<TextProps, "children">;

export const Typography = ({
  children,
  t = "16_24",
  fontWeight = "regular",
  ...props
}: TypographyProps): ReactNode => {
  const { primary } = useThemedNativeStyles();

  return (
    <Animated.Text
      style={[{ color: primary.color }, textSizeVariants[t], fontWeightVariants[fontWeight]]}
      {...props}
    >
      {children}
    </Animated.Text>
  );
};
