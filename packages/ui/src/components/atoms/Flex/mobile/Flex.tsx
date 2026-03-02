import type { ComponentType, ReactNode } from "react";
import { type StyleProp, View, type ViewProps, type ViewStyle } from "react-native";

import { spacingNativeSprinkles } from "@/sprinkles";

import type { FlexPropsBase } from "../types";
import { flexVariants } from "./Flex.styles";

interface FlexProps extends FlexPropsBase {
  as?: ComponentType<ViewProps>;
  style?: StyleProp<ViewStyle>;
}

export const Flex = ({
  direction = "column",
  justifyContent = "start",
  alignItems = "start",
  alignContent = "start",
  alignSelf = "stretch",
  as: Component = View,
  style,
  children,
  ...spaceProps
}: FlexProps): ReactNode => {
  return (
    <Component
      style={[
        flexVariants({
          direction,
          justifyContent,
          alignItems,
          alignContent,
          alignSelf,
        }),
        spacingNativeSprinkles(spaceProps),
        style,
      ]}
    >
      {children}
    </Component>
  );
};
