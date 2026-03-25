import type { ReactNode } from "react";
import { useMemo } from "react";
import { View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";

import type {
  AppLayoutAsideBaseProps,
  AppLayoutMainBaseProps,
  AppLayoutRootBaseProps,
} from "../types";
import { appLayoutStyles } from "./AppLayout.styles";
import { AppLayoutContext, useAppLayoutContext } from "./context";
import { useAppLayoutRootMotion } from "./useAppLayoutRootMotion";

const AppLayoutAside = ({ children }: AppLayoutAsideBaseProps): ReactNode => {
  const { asideColumnWidth, asidePanGesture, isOpened } = useAppLayoutContext();

  return (
    <GestureDetector gesture={asidePanGesture}>
      <View
        accessibilityRole="menu"
        accessibilityState={{ expanded: isOpened }}
        style={[appLayoutStyles.aside, { width: asideColumnWidth }]}
      >
        {children}
      </View>
    </GestureDetector>
  );
};

const AppLayoutMain = ({ children }: AppLayoutMainBaseProps): ReactNode => {
  const { mainColumnWidth, mainPanGesture } = useAppLayoutContext();

  return (
    <GestureDetector gesture={mainPanGesture}>
      <View style={[appLayoutStyles.main, { width: mainColumnWidth }]}>{children}</View>
    </GestureDetector>
  );
};

const AppLayoutRoot = ({
  children,
  isOpened = false,
  onOpen,
}: AppLayoutRootBaseProps): ReactNode => {
  const { asideColumnWidth, animatedRowStyle, asidePanGesture, mainPanGesture, screenWidth } =
    useAppLayoutRootMotion({ isOpened, onOpen });

  const layoutContext = useMemo(
    () => ({
      asideColumnWidth,
      mainColumnWidth: screenWidth,
      isOpened,
      onOpen,
      mainPanGesture,
      asidePanGesture,
    }),
    [asideColumnWidth, screenWidth, isOpened, onOpen, mainPanGesture, asidePanGesture]
  );

  return (
    <AppLayoutContext.Provider value={layoutContext}>
      <Animated.View
        style={[appLayoutStyles.root, animatedRowStyle, { width: asideColumnWidth + screenWidth }]}
      >
        {children}
      </Animated.View>
    </AppLayoutContext.Provider>
  );
};

export const AppLayout = Object.assign(AppLayoutRoot, {
  Aside: AppLayoutAside,
  Main: AppLayoutMain,
});
