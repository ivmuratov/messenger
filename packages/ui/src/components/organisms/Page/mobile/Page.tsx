import type { ReactNode } from "react";
import { ScrollView } from "react-native";

import { Flex } from "@/components/atoms/Flex/index.native";
import { useThemedNativeStyles } from "@/themes/index.native";

import type { PageBaseProps } from "../types";
import { pageStyles } from "./Page.styles";

export const Page = ({ children }: PageBaseProps): ReactNode => {
  const { primary } = useThemedNativeStyles();

  return (
    <Flex as={ScrollView} style={[pageStyles.page, { backgroundColor: primary.backgroundColor }]}>
      {children}
    </Flex>
  );
};
