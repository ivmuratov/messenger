import type { VariantsTokenMap } from "@/shared/types";

import type { FlexVariants } from "./types";

export const flexVariantsToken = {
  direction: {
    row: {
      flexDirection: "row",
    },
    column: {
      flexDirection: "column",
    },
    rowReverse: {
      flexDirection: "row-reverse",
    },
    columnReverse: {
      flexDirection: "column-reverse",
    },
  },
  justifyContent: {
    center: {
      justifyContent: "center",
    },
    end: {
      justifyContent: "flex-end",
    },
    start: {
      justifyContent: "flex-start",
    },
    spaceBetween: {
      justifyContent: "space-between",
    },
    spaceAround: {
      justifyContent: "space-around",
    },
    spaceEvenly: {
      justifyContent: "space-evenly",
    },
  },
  alignItems: {
    center: {
      alignItems: "center",
    },
    end: {
      alignItems: "flex-end",
    },
    start: {
      alignItems: "flex-start",
    },
    stretch: {
      alignItems: "stretch",
    },
    baseline: {
      alignItems: "baseline",
    },
  },
  alignContent: {
    center: {
      alignContent: "center",
    },
    start: {
      alignContent: "flex-start",
    },
    end: {
      alignContent: "flex-end",
    },
    spaceBetween: {
      alignContent: "space-between",
    },
    spaceAround: {
      alignContent: "space-around",
    },
    spaceEvenly: {
      alignContent: "space-evenly",
    },
    stretch: {
      alignContent: "stretch",
    },
  },
  alignSelf: {
    center: {
      alignSelf: "center",
    },
    start: {
      alignSelf: "flex-start",
    },
    stretch: {
      alignSelf: "stretch",
    },
    end: {
      alignSelf: "flex-end",
    },
    baseline: {
      alignSelf: "baseline",
    },
  },
  flexWrap: {
    nowrap: {
      flexWrap: "nowrap",
    },
    wrap: {
      flexWrap: "wrap",
    },
    wrapReverse: {
      flexWrap: "wrap-reverse",
    },
  },
} as const satisfies VariantsTokenMap<FlexVariants>;
