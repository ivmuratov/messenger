import type { ReactNode } from "react";
import { ScrollView, View } from "react-native";

import { useThemedNativeStyles } from "@/shared/hooks";

import type { PageBodyBaseProps, PageHeaderBaseProps, PageRootBaseProps } from "../types";
import { pageStyles } from "./Page.styles";

const PageHeader = ({ children }: PageHeaderBaseProps): ReactNode => {
  const { background, border } = useThemedNativeStyles();

  return (
    <View
      style={[
        pageStyles.header,
        {
          backgroundColor: background.secondary,
          borderBottomColor: border.primary,
        },
      ]}
    >
      {children}
    </View>
  );
};

const PageBody = ({ children }: PageBodyBaseProps): ReactNode => {
  const { background } = useThemedNativeStyles();

  return (
    <ScrollView style={[pageStyles.body, { backgroundColor: background.primary }]}>
      {children}
    </ScrollView>
  );
};

const PageRoot = ({ children }: PageRootBaseProps): ReactNode => {
  return <View style={pageStyles.root}>{children}</View>;
};

export const Page = Object.assign(PageRoot, {
  Header: PageHeader,
  Body: PageBody,
});
