import type { ReactNode } from "react";
import { ScrollView } from "react-native";

import { useThemedNativeStyles } from "@/themes/index.native";

import type { SidebarBaseProps } from "../types";
import { sidebarStyles } from "./Sidebar.styles";

export const Sidebar = ({ children }: SidebarBaseProps): ReactNode => {
  const { secondary, primary } = useThemedNativeStyles();

  return (
    <ScrollView
      style={[
        sidebarStyles.sidebar,
        { backgroundColor: secondary.backgroundColor, borderRightColor: primary.borderColor },
      ]}
    >
      {children}
    </ScrollView>
  );
};
