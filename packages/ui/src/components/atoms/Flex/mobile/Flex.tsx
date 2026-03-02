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
  children,
  as: Component = View,
  style,
  direction = "column",
  justifyContent,
  alignItems,
  alignContent,
  alignSelf,
  flexWrap,
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
          flexWrap,
        }),
        spacingNativeSprinkles(spaceProps),
        style,
      ]}
    >
      {children}
    </Component>
  );
};
