import { type Meta, type StoryObj } from "@storybook/react";
import { Text } from "react-native";

import { DrawerLayout } from "./DrawerLayout";

const meta = {
  title: "Mobile/DrawerLayout",
  component: DrawerLayout,
} satisfies Meta<typeof DrawerLayout>;

export default meta;

type Story = StoryObj<typeof meta>;

const DrawerLayoutExample = ({ isOpened }: { isOpened: boolean }) => (
  <DrawerLayout isOpened={isOpened} onOpen={() => {}}>
    <DrawerLayout.Aside>
      <Text>Aside panel</Text>
    </DrawerLayout.Aside>
    <DrawerLayout.Main>
      <Text>Main content</Text>
    </DrawerLayout.Main>
  </DrawerLayout>
);

export const Open: Story = {
  args: {
    onOpen: () => {},
  },
  render: () => <DrawerLayoutExample isOpened />,
};

export const Closed: Story = {
  args: {
    onOpen: () => {},
  },
  render: () => <DrawerLayoutExample isOpened={false} />,
};
