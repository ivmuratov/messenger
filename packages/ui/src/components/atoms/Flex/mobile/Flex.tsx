import type { ReactNode } from "react";
import { View } from "react-native";

import { spacingNativeSprinkles } from "@/sprinkles";

import type { FlexPropsBase } from "../types";
import { flexVariants } from "./Flex.styles";

export const Flex = ({
  direction = "column",
  justifyContent = "start",
  alignItems = "start",
  alignContent = "start",
  alignSelf = "start",
  children,
  ...spaceProps
}: FlexPropsBase): ReactNode => {
  return (
    <View
      style={[
        flexVariants({ direction, justifyContent, alignItems, alignContent, alignSelf }),
        spacingNativeSprinkles(spaceProps),
      ]}
    >
      {children}
    </View>
  );
};
