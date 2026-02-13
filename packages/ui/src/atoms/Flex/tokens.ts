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
  },
  alignContent: {
    center: {
      alignContent: "center",
    },
    start: {
      alignContent: "flex-start",
    },
  },
  alignSelf: {
    center: {
      alignSelf: "center",
    },
    start: {
      alignSelf: "flex-start",
    },
  },
} as const satisfies VariantsTokenMap<FlexVariants>;
