import type { ReactNode } from "react";
import { useEffect, useMemo, useRef } from "react";
import { useWindowDimensions, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { transitionsToken } from "@/tokens";

import type {
  AppLayoutAsideBaseProps,
  AppLayoutMainBaseProps,
  AppLayoutRootBaseProps,
} from "../types";
import { appLayoutStyles } from "./AppLayout.styles";
import { AppLayoutContext, useAppLayoutContext } from "./context";

const AppLayoutAside = ({ children }: AppLayoutAsideBaseProps): ReactNode => {
  const { asideColumnWidth } = useAppLayoutContext();

  return <View style={[appLayoutStyles.aside, { width: asideColumnWidth }]}>{children}</View>;
};

const AppLayoutMain = ({ children }: AppLayoutMainBaseProps): ReactNode => {
  const { mainColumnWidth } = useAppLayoutContext();

  return <View style={[appLayoutStyles.main, { width: mainColumnWidth }]}>{children}</View>;
};

const AppLayoutRoot = ({
  children,
  isOpened = false,
  sidebarWidthRatio = 0.8,
}: AppLayoutRootBaseProps): ReactNode => {
  const isFirstRender = useRef(true);

  const { width } = useWindowDimensions();
  const asideColumnWidth = width * sidebarWidthRatio;

  const translateX = useSharedValue(isOpened ? 0 : -asideColumnWidth);

  const animatedRowStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateX: translateX.value }],
    }),
    [translateX]
  );

  const layoutContext = useMemo(
    () => ({ asideColumnWidth, mainColumnWidth: width }),
    [asideColumnWidth, width]
  );

  useEffect(() => {
    const target = isOpened ? 0 : -asideColumnWidth;

    if (asideColumnWidth <= 0) return;

    if (isFirstRender.current) {
      translateX.value = target;
      isFirstRender.current = false;
      return;
    }

    translateX.value = withTiming(target, { duration: transitionsToken.durationMs });
  }, [isOpened, asideColumnWidth, translateX]);

  return (
    <AppLayoutContext.Provider value={layoutContext}>
      <View style={appLayoutStyles.root}>
        <Animated.View
          style={[appLayoutStyles.row, animatedRowStyle, { width: asideColumnWidth + width }]}
        >
          {children}
        </Animated.View>
      </View>
    </AppLayoutContext.Provider>
  );
};

export const AppLayout = Object.assign(AppLayoutRoot, {
  Aside: AppLayoutAside,
  Main: AppLayoutMain,
});
