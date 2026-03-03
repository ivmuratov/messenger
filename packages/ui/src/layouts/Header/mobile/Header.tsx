import type { ReactNode } from "react";
import { View } from "react-native";

import { useThemedNativeStyles } from "@/themes/index.native";

import type { HeaderBaseProps, HeaderSectionProps } from "../types";
import { headerStyles } from "./Header.styles";

const HeaderLeftSide = ({ children }: HeaderSectionProps): ReactNode => {
  return <View style={headerStyles.left}>{children}</View>;
};

const HeaderCenterSide = ({ children }: HeaderSectionProps): ReactNode => {
  return <View style={headerStyles.center}>{children}</View>;
};

const HeaderRightSide = ({ children }: HeaderSectionProps): ReactNode => {
  return <View style={headerStyles.right}>{children}</View>;
};

const HeaderRoot = ({ children }: HeaderBaseProps): ReactNode => {
  const { secondary, primary } = useThemedNativeStyles();

  return (
    <View
      style={[
        headerStyles.header,
        { backgroundColor: secondary.backgroundColor, borderBottomColor: primary.borderColor },
      ]}
    >
      {children}
    </View>
  );
};

export const Header = Object.assign(HeaderRoot, {
  LeftSide: HeaderLeftSide,
  CenterSide: HeaderCenterSide,
  RightSide: HeaderRightSide,
});
