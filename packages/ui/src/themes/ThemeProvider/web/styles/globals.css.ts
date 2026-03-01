import { globalStyle } from "@vanilla-extract/css";

import { theme } from "../themes.css";
import { themeLayer } from "./layers.css";

globalStyle("body", {
  "@layer": {
    [themeLayer]: {
      backgroundColor: theme.background.primary,
      color: theme.foreground.primary,
      lineHeight: 1.5,
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
    },
  },
});

// Cтили для скроллбаров (WebKit)
globalStyle("::-webkit-scrollbar", {
  "@layer": {
    [themeLayer]: {
      width: "8px",
      height: "8px",
    },
  },
});
