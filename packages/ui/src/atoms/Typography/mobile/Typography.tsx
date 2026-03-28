import type { ReactNode } from "react";
import { Text, type TextProps } from "react-native";

import { useThemedNativeStyles } from "@/shared/hooks";

import type { TypographyBaseProps } from "../types";
import { fontWeightVariants, textSizeVariants } from "./Typography.styles";

type TypographyProps = TypographyBaseProps & Omit<TextProps, "children">;

export const Typography = ({
  children,
  t = "16_24",
  fontWeight = "regular",
  ...props
}: TypographyProps): ReactNode => {
  const { foreground } = useThemedNativeStyles();

  return (
    <Text
      style={[{ color: foreground.primary }, textSizeVariants[t], fontWeightVariants[fontWeight]]}
      {...props}
    >
      {children}
    </Text>
  );
};
