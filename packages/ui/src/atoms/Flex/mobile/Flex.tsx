import type { FC } from "react";
import { View } from "react-native";

import type { FlexPropsBase } from "../types";
import {
  alignContentVariants,
  alignItemsVariants,
  alignSelfVariants,
  directionVariants,
  justifyContentVariants,
} from "./Flex.styles";

export const Flex: FC<FlexPropsBase> = ({
  direction = "column",
  justifyContent = "start",
  alignItems = "start",
  alignContent = "start",
  alignSelf = "start",
  children,
}) => {
  return (
    <View
      style={[
        directionVariants[direction],
        justifyContentVariants[justifyContent],
        alignItemsVariants[alignItems],
        alignContentVariants[alignContent],
        alignSelfVariants[alignSelf],
      ]}
    >
      {children}
    </View>
  );
};
