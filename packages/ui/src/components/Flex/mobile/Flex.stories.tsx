import { type Meta, type StoryObj } from "@storybook/react";
import { Text } from "react-native";

import { Flex } from "./Flex";

const meta = {
  title: "Mobile/Flex",
  component: Flex,
} satisfies Meta<typeof Flex>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    direction: "column",
    gap: "md",
    p: "md",
    children: (
      <>
        <Text>First item</Text>
        <Text>Second item</Text>
        <Text>Third item</Text>
      </>
    ),
  },
};

export const Row: Story = {
  args: {
    direction: "row",
    gap: "sm",
    p: "md",
    alignItems: "center",
    children: (
      <>
        <Text>Left</Text>
        <Text>Center</Text>
        <Text>Right</Text>
      </>
    ),
  },
};
