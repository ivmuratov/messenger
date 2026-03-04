import type { ReactNode } from "react";
import { View } from "react-native";

import type {
  AppLayoutAsideBaseProps,
  AppLayoutMainBaseProps,
  AppLayoutRootBaseProps,
} from "../types";
import { appLayoutStyles } from "./AppLayout.styles";

const AppLayoutAside = ({ children }: AppLayoutAsideBaseProps): ReactNode => {
  return <View style={appLayoutStyles.aside}>{children}</View>;
};

const AppLayoutMain = ({ children }: AppLayoutMainBaseProps): ReactNode => {
  return <View style={appLayoutStyles.main}>{children}</View>;
};

const AppLayoutRoot = ({ children }: AppLayoutRootBaseProps): ReactNode => {
  return <View style={appLayoutStyles.root}>{children}</View>;
};

export const AppLayout = Object.assign(AppLayoutRoot, {
  Aside: AppLayoutAside,
  Main: AppLayoutMain,
});
