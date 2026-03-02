import type { ReactNode } from "react";
import { View } from "react-native";

import { useThemedNativeStyles } from "@/themes/index.native";

import type { HeaderBaseProps } from "../types";
import { headerStyles } from "./Header.styles";

export const Header = ({ children }: HeaderBaseProps): ReactNode => {
  const { secondary } = useThemedNativeStyles();

  return (
    <View style={[headerStyles.header, { backgroundColor: secondary.backgroundColor }]}>
      {children}
    </View>
  );
};
