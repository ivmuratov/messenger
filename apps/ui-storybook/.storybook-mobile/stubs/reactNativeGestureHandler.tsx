import { type ReactNode } from "react";
import { View, type ViewProps } from "react-native";

export const GestureHandlerRootView = ({ children, style, ...rest }: ViewProps): ReactNode => (
  <View style={[{ flex: 1 }, style]} {...rest}>
    {children}
  </View>
);

export const GestureDetector = ({
  children,
}: {
  children: ReactNode;
  gesture?: unknown;
}): ReactNode => children;

type PanGestureChain = {
  enabled: (value: boolean) => PanGestureChain;
  activeOffsetX: (value: number | number[]) => PanGestureChain;
  failOffsetY: (value: number | number[]) => PanGestureChain;
  onBegin: (handler: () => void) => PanGestureChain;
  onUpdate: (handler: (event: { translationX: number }) => void) => PanGestureChain;
  onEnd: (handler: (event: { velocityX: number }) => void) => PanGestureChain;
  onFinalize: (handler: () => void) => PanGestureChain;
};

const createPanGesture = (): PanGestureChain => {
  const chain: PanGestureChain = {
    enabled: () => chain,
    activeOffsetX: () => chain,
    failOffsetY: () => chain,
    onBegin: () => chain,
    onUpdate: () => chain,
    onEnd: () => chain,
    onFinalize: () => chain,
  };
  return chain;
};

export const Gesture = {
  Pan: createPanGesture,
};
