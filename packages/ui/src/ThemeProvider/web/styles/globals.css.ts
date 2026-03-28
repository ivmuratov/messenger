import { globalStyle, keyframes } from "@vanilla-extract/css";

import { theme } from "@/shared/styles/themes.css";
import {
  borderRadiusToken,
  borderWidthToken,
  spacingToken,
  transitionsToken,
} from "@/shared/tokens";

import { themeLayer } from "./layers.css";

const circleExpand = keyframes({
  from: {
    clipPath: "circle(0% at var(--view-transition-x, 50%) var(--view-transition-y, 50%))",
  },
  to: {
    clipPath: "circle(150% at var(--view-transition-x, 50%) var(--view-transition-y, 50%))",
  },
});

const circleCollapse = keyframes({
  from: {
    clipPath: "circle(150% at var(--view-transition-x, 50%) var(--view-transition-y, 50%))",
  },
  to: {
    clipPath: "circle(0% at var(--view-transition-x, 50%) var(--view-transition-y, 50%))",
  },
});

globalStyle(":root[data-theme-transition='to-dark']::view-transition-old(root)", {
  animation: "none",
  zIndex: 1,
});

globalStyle(":root[data-theme-transition='to-light']::view-transition-new(root)", {
  animation: "none",
  zIndex: 1,
});

globalStyle(":root[data-theme-transition='to-dark']::view-transition-new(root)", {
  animation: `${circleExpand} ${transitionsToken.durationMs}ms ease-out`,
  zIndex: 2,
});

globalStyle(":root[data-theme-transition='to-light']::view-transition-old(root)", {
  animation: `${circleCollapse} ${transitionsToken.durationMs}ms ease-in forwards`,
  zIndex: 2,
});

globalStyle("body", {
  "@layer": {
    [themeLayer]: {
      overflow: "hidden",
      backgroundColor: theme.background.primary,
      color: theme.foreground.primary,
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
    },
  },
});

globalStyle("::-webkit-scrollbar", {
  "@layer": {
    [themeLayer]: {
      width: `${spacingToken.sm}px`,
      height: `${spacingToken.sm}px`,
    },
  },
});

globalStyle("::-webkit-scrollbar-track", {
  "@layer": {
    [themeLayer]: {
      backgroundColor: "transparent",
    },
  },
});

globalStyle("::-webkit-scrollbar-thumb", {
  "@layer": {
    [themeLayer]: {
      backgroundColor: theme.border.primary,
      borderRadius: `${borderRadiusToken.md}px`,
      border: `${borderWidthToken.sm}px solid ${theme.background.primary}`,
    },
  },
});

globalStyle("::-webkit-scrollbar-thumb:hover", {
  "@layer": {
    [themeLayer]: {
      backgroundColor: theme.foreground.secondary,
    },
  },
});
