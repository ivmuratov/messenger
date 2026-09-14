import { type Meta, type StoryObj } from "@storybook/react";

import { Flex } from "./Flex";

const meta = {
  title: "Layouts/Flex",
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
        <span>First item</span>
        <span>Second item</span>
        <span>Third item</span>
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
        <span>Left</span>
        <span>Center</span>
        <span>Right</span>
      </>
    ),
  },
};
