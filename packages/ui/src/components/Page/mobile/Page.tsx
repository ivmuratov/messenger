import { type ReactNode } from "react";
import { ScrollView, View } from "react-native";

import { Flex } from "@/components/Flex/mobile";
import { useThemedNativeStyles } from "@/shared/hooks";

import { type PageBodyBaseProps, type PageHeaderBaseProps, type PageRootBaseProps } from "../types";
import { pageStyles } from "./Page.styles";

const PageHeader = ({ children }: PageHeaderBaseProps): ReactNode => {
  const { background, border } = useThemedNativeStyles();

  return (
    <View
      accessibilityRole="header"
      style={[
        pageStyles.header,
        {
          backgroundColor: background.secondary,
          borderBottomColor: border.primary,
        },
      ]}
    >
      <Flex alignItems="center" direction="row" gap="sm">
        {children}
      </Flex>
    </View>
  );
};

const PageBody = ({ children }: PageBodyBaseProps): ReactNode => {
  const { background } = useThemedNativeStyles();

  return (
    <ScrollView
      accessibilityLabel="Page content"
      style={[pageStyles.body, { backgroundColor: background.primary }]}
    >
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
