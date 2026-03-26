import { useCallback, useEffect, useMemo, useRef } from "react";
import { useWindowDimensions } from "react-native";
import { Gesture } from "react-native-gesture-handler";
import {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { runOnJS } from "react-native-worklets";

/** Минимальный горизонтальный сдвиг пальца (px), после которого жест считается pan по оси X. */
const ASIDE_PAN_HORIZONTAL_ACTIVATION_OFFSET = 12;

/** Порог вертикального сдвига (px): если превышен, горизонтальный pan отменяется (скролл и т.д.). */
const ASIDE_PAN_VERTICAL_CANCEL_OFFSET = 15;

/** Скорость жеста (px/s): выше — считаем «рёв» в сторону открытия, ниже — закрытия. */
const ASIDE_SNAP_FLING_VELOCITY_THRESHOLD = 400;

/** Длительность доводки положения шторки после отпускания или смены `isOpened`. */
const ASIDE_SNAP_ANIMATION_DURATION_MS = 100;

export type UseDrawerLayoutRootMotionParams = {
  isOpened: boolean;
  onOpen?: (isOpened: boolean) => void;
};

export const useDrawerLayoutRootMotion = ({
  isOpened,
  onOpen,
}: UseDrawerLayoutRootMotionParams) => {
  const isFirstRender = useRef(true);
  const isGestureActiveRef = useRef(false);
  const isSnapAnimatingRef = useRef(false);
  const skipNextIsOpenedEffectRef = useRef(false);

  const { width: screenWidth } = useWindowDimensions();
  const asideColumnWidth = screenWidth * 0.8;

  const translateX = useSharedValue(isOpened ? 0 : -asideColumnWidth);
  const startTranslateX = useSharedValue(0);
  const asideColumnWidthShared = useSharedValue(asideColumnWidth);

  const animatedRowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const startGesture = useCallback(() => {
    isGestureActiveRef.current = true;
  }, []);

  const endGesture = useCallback(() => {
    isGestureActiveRef.current = false;
  }, []);

  const startSnap = useCallback(() => {
    isSnapAnimatingRef.current = true;
  }, []);

  const snapComplete = useCallback(
    (finished: boolean, shouldOpen: boolean) => {
      isSnapAnimatingRef.current = false;
      if (finished) {
        skipNextIsOpenedEffectRef.current = true;
        onOpen?.(shouldOpen);
      }
    },
    [onOpen]
  );

  const configureAsidePan = useCallback(
    (pan: ReturnType<typeof Gesture.Pan>) => {
      return pan
        .onBegin(() => {
          "worklet";
          cancelAnimation(translateX);
          startTranslateX.value = translateX.value;
          runOnJS(startGesture)();
        })
        .onUpdate((e) => {
          "worklet";
          const minX = -asideColumnWidthShared.value;
          const maxX = 0;
          const next = startTranslateX.value + e.translationX;
          translateX.value = Math.max(minX, Math.min(maxX, next));
        })
        .onEnd((e) => {
          "worklet";
          const minX = -asideColumnWidthShared.value;
          const maxX = 0;
          const vx = e.velocityX;
          const x = translateX.value;

          let shouldOpen = x > minX / 2;

          if (vx > ASIDE_SNAP_FLING_VELOCITY_THRESHOLD) {
            shouldOpen = true;
          }

          if (vx < -ASIDE_SNAP_FLING_VELOCITY_THRESHOLD) {
            shouldOpen = false;
          }

          const target = shouldOpen ? maxX : minX;
          runOnJS(startSnap)();
          translateX.value = withTiming(
            target,
            { duration: ASIDE_SNAP_ANIMATION_DURATION_MS },
            (finished) => {
              "worklet";
              runOnJS(snapComplete)(Boolean(finished), shouldOpen);
            }
          );
        })
        .onFinalize(() => {
          "worklet";
          runOnJS(endGesture)();
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- asideColumnWidthShared is stable
    [startGesture, endGesture, snapComplete, startSnap, startTranslateX, translateX]
  );

  const mainPanGesture = useMemo(() => {
    const pan = Gesture.Pan()
      .activeOffsetX([
        -ASIDE_PAN_HORIZONTAL_ACTIVATION_OFFSET,
        ASIDE_PAN_HORIZONTAL_ACTIVATION_OFFSET,
      ])
      .failOffsetY([-ASIDE_PAN_VERTICAL_CANCEL_OFFSET, ASIDE_PAN_VERTICAL_CANCEL_OFFSET]);
    return configureAsidePan(pan);
  }, [configureAsidePan]);

  const asidePanGesture = useMemo(() => {
    const pan = Gesture.Pan()
      .enabled(isOpened)
      .activeOffsetX([
        -ASIDE_PAN_HORIZONTAL_ACTIVATION_OFFSET,
        ASIDE_PAN_HORIZONTAL_ACTIVATION_OFFSET,
      ])
      .failOffsetY([-ASIDE_PAN_VERTICAL_CANCEL_OFFSET, ASIDE_PAN_VERTICAL_CANCEL_OFFSET]);
    return configureAsidePan(pan);
  }, [configureAsidePan, isOpened]);

  useEffect(() => {
    asideColumnWidthShared.value = asideColumnWidth;
  }, [asideColumnWidth, asideColumnWidthShared]);

  useEffect(() => {
    const target = isOpened ? 0 : -asideColumnWidth;

    if (asideColumnWidth <= 0) return;

    if (isFirstRender.current) {
      translateX.value = target;
      isFirstRender.current = false;
      return;
    }

    if (skipNextIsOpenedEffectRef.current) {
      skipNextIsOpenedEffectRef.current = false;
      return;
    }

    if (isGestureActiveRef.current || isSnapAnimatingRef.current) {
      return;
    }

    translateX.value = withTiming(target, { duration: ASIDE_SNAP_ANIMATION_DURATION_MS });
  }, [isOpened, asideColumnWidth, translateX]);

  return {
    asideColumnWidth,
    animatedRowStyle,
    asidePanGesture,
    mainPanGesture,
    screenWidth,
  };
};
