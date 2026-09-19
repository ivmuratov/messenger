import { type ReactNode } from "react";
import { View, type ViewProps } from "react-native";

export const SafeAreaProvider = ({ children }: { children: ReactNode }): ReactNode => children;

export const SafeAreaView = ({ children, style, ...rest }: ViewProps): ReactNode => (
  <View style={[{ flex: 1 }, style]} {...rest}>
    {children}
  </View>
);

export const useSafeAreaInsets = (): {
  top: number;
  right: number;
  bottom: number;
  left: number;
} => ({
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
});
