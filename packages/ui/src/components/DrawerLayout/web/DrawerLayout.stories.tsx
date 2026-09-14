import { type Meta, type StoryObj } from "@storybook/react";

import { DrawerLayout } from "./DrawerLayout";

const meta = {
  title: "Components/DrawerLayout",
  component: DrawerLayout,
} satisfies Meta<typeof DrawerLayout>;

export default meta;

type Story = StoryObj<typeof meta>;

const DrawerLayoutExample = ({ isOpened }: { isOpened: boolean }) => (
  <DrawerLayout isOpened={isOpened}>
    <DrawerLayout.Aside>Aside panel</DrawerLayout.Aside>
    <DrawerLayout.Main>Main content</DrawerLayout.Main>
  </DrawerLayout>
);

export const Open: Story = {
  render: () => <DrawerLayoutExample isOpened />,
};

export const Closed: Story = {
  render: () => <DrawerLayoutExample isOpened={false} />,
};
