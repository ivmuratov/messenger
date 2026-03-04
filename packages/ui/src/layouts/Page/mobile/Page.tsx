import type { ReactNode } from "react";
import { Animated, View } from "react-native";

import { useThemedNativeStyles } from "@/themes/index.native";

import type { PageBodyBaseProps, PageHeaderBaseProps, PageRootBaseProps } from "../types";
import { pageStyles } from "./Page.styles";

const PageHeader = ({ children }: PageHeaderBaseProps): ReactNode => {
  const { secondary, primary } = useThemedNativeStyles();

  return (
    <Animated.View
      style={[
        pageStyles.header,
        {
          backgroundColor: secondary.backgroundColor,
          borderBottomColor: primary.borderColor,
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

const PageBody = ({ children }: PageBodyBaseProps): ReactNode => {
  const { primary } = useThemedNativeStyles();

  return (
    <Animated.ScrollView style={[pageStyles.body, { backgroundColor: primary.backgroundColor }]}>
      {children}
    </Animated.ScrollView>
  );
};

const PageRoot = ({ children }: PageRootBaseProps): ReactNode => {
  return <View style={pageStyles.root}>{children}</View>;
};

export const Page = Object.assign(PageRoot, {
  Header: PageHeader,
  Body: PageBody,
});
