import { globalStyle } from "@vanilla-extract/css";

import { theme } from "../themes.css";
import { themeLayer } from "./layers.css";

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
      width: "8px",
      height: "8px",
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
      borderRadius: "4px",
      border: `2px solid ${theme.background.primary}`,
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
