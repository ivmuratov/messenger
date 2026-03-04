import { createContext } from "react";
import { type Animated } from "react-native";

export type AnimatedThemeStyles = {
  primary: {
    backgroundColor: Animated.AnimatedInterpolation<string>;
    color: Animated.AnimatedInterpolation<string>;
    borderColor: Animated.AnimatedInterpolation<string>;
  };
  secondary: {
    backgroundColor: Animated.AnimatedInterpolation<string>;
    color: Animated.AnimatedInterpolation<string>;
    borderColor: Animated.AnimatedInterpolation<string>;
  };
};

export const AnimatedThemeContext = createContext<AnimatedThemeStyles | null>(null);
