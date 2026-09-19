import { type Meta, type StoryObj } from "@storybook/react";

import { ThemeSwitcher } from "./ThemeSwitcher";

const meta = {
  title: "Mobile/ThemeSwitcher",
  component: ThemeSwitcher,
} satisfies Meta<typeof ThemeSwitcher>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
