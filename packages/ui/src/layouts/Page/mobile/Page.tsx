import type { ReactNode } from "react";
import { ScrollView, View } from "react-native";

import { useThemedNativeStyles } from "@/themes/index.native";

import type { PageBodyBaseProps, PageHeaderBaseProps, PageRootBaseProps } from "../types";
import { pageStyles } from "./Page.styles";

const PageHeader = ({ children }: PageHeaderBaseProps): ReactNode => {
  const { secondary, primary } = useThemedNativeStyles();

  return (
    <View
      style={[
        pageStyles.header,
        { backgroundColor: secondary.backgroundColor, borderBottomColor: primary.borderColor },
      ]}
    >
      {children}
    </View>
  );
};

const PageBody = ({ children }: PageBodyBaseProps): ReactNode => {
  const { primary } = useThemedNativeStyles();

  return (
    <ScrollView style={[pageStyles.body, { backgroundColor: primary.backgroundColor }]}>
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
