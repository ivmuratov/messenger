import { type Meta, type StoryObj } from "@storybook/react";

import { Typography } from "./Typography";

const meta = {
  title: "Mobile/Typography",
  component: Typography,
  tags: ["autodocs"],
  args: {
    children: "Typography sample",
    t: "16_24",
    fontWeight: "regular",
  },
  argTypes: {
    t: {
      control: "select",
      options: ["10_14", "12_16", "14_20", "16_24", "18_28", "20_28", "24_32", "32_40"],
    },
    fontWeight: {
      control: "select",
      options: ["regular", "medium", "semibold", "bold"],
    },
  },
} satisfies Meta<typeof Typography>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <>
      <Typography t="10_14">10_14</Typography>
      <Typography t="12_16">12_16</Typography>
      <Typography t="14_20">14_20</Typography>
      <Typography t="16_24">16_24</Typography>
      <Typography t="18_28">18_28</Typography>
      <Typography t="20_28">20_28</Typography>
      <Typography t="24_32">24_32</Typography>
      <Typography t="32_40">32_40</Typography>
    </>
  ),
};
