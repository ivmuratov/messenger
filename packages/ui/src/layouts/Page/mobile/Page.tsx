import type { ReactNode } from "react";
import { ScrollView } from "react-native";

import { useThemedNativeStyles } from "@/themes/index.native";

import type { PageBaseProps } from "../types";
import { pageStyles } from "./Page.styles";

export const Page = ({ children }: PageBaseProps): ReactNode => {
  const { primary } = useThemedNativeStyles();

  return (
    <ScrollView style={[pageStyles.page, { backgroundColor: primary.backgroundColor }]}>
      {children}
    </ScrollView>
  );
};
