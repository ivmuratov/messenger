import type { ReactNode } from "react";
import { useMemo } from "react";
import { ScrollView, View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";

import { useThemedNativeStyles } from "@/shared/hooks";

import type {
  DrawerLayoutAsideBaseProps,
  DrawerLayoutMainBaseProps,
  DrawerLayoutRootBaseProps,
} from "../types";
import { DrawerLayoutContext, useDrawerLayoutContext } from "./context";
import { drawerLayoutStyles } from "./DrawerLayout.styles";
import { useDrawerLayoutRootMotion } from "./useDrawerLayoutRootMotion";

const DrawerLayoutAside = ({ children }: DrawerLayoutAsideBaseProps): ReactNode => {
  const { asideColumnWidth, asidePanGesture, isOpened } = useDrawerLayoutContext();
  const { border, background } = useThemedNativeStyles();

  return (
    <GestureDetector gesture={asidePanGesture}>
      <View
        accessibilityRole="menu"
        accessibilityState={{ expanded: isOpened }}
        style={[{ width: asideColumnWidth }]}
      >
        <ScrollView
          style={[
            drawerLayoutStyles.aside,
            {
              backgroundColor: background.secondary,
              borderRightColor: border.primary,
            },
          ]}
        >
          {children}
        </ScrollView>
      </View>
    </GestureDetector>
  );
};

const DrawerLayoutMain = ({ children }: DrawerLayoutMainBaseProps): ReactNode => {
  const { mainColumnWidth, mainPanGesture } = useDrawerLayoutContext();

  return (
    <GestureDetector gesture={mainPanGesture}>
      <View style={[drawerLayoutStyles.main, { width: mainColumnWidth }]}>{children}</View>
    </GestureDetector>
  );
};

interface DrawerLayoutRootProps extends DrawerLayoutRootBaseProps {
  onOpen: (isOpened: boolean) => void;
}

const DrawerLayoutRoot = ({
  children,
  isOpened = false,
  onOpen,
}: DrawerLayoutRootProps): ReactNode => {
  const { asideColumnWidth, animatedRowStyle, asidePanGesture, mainPanGesture, screenWidth } =
    useDrawerLayoutRootMotion({ isOpened, onOpen });

  const context = useMemo(
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
    <DrawerLayoutContext.Provider value={context}>
      <Animated.View
        style={[
          drawerLayoutStyles.root,
          animatedRowStyle,
          { width: asideColumnWidth + screenWidth },
        ]}
      >
        {children}
      </Animated.View>
    </DrawerLayoutContext.Provider>
  );
};

export const DrawerLayout = Object.assign(DrawerLayoutRoot, {
  Aside: DrawerLayoutAside,
  Main: DrawerLayoutMain,
});
