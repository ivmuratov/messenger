import { type ComponentType } from "react";
import { View, type ViewProps } from "react-native";

const AnimatedView = View as ComponentType<ViewProps>;

const Animated = {
  View: AnimatedView,
};

const createAnimatedComponent = <T>(component: T): T => component;

export default Animated;
export { createAnimatedComponent };

export const useSharedValue = <T>(initial: T): { value: T } => ({ value: initial });

export const useAnimatedStyle = <T extends object>(updater: () => T): T => updater();

export const withTiming = <T>(
  toValue: T,
  _config?: unknown,
  callback?: (finished: boolean) => void
): T => {
  callback?.(true);
  return toValue;
};

export const cancelAnimation = (_value?: unknown): void => {};
