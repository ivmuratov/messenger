import { createFileRoute } from "@tanstack/react-router";
import { DrawerLayout, Flex, Page, ThemeSwitcher, Typography } from "@ui";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const [isDrawerOpened, setIsDrawerOpened] = useState(false);

  const handleToggleDrawer = () => {
    setIsDrawerOpened((opened) => !opened);
  };

  return (
    <DrawerLayout isOpened={isDrawerOpened}>
      <DrawerLayout.Aside>
        {Array.from({ length: 100 }).map((_, index) => (
          <Flex direction="row" key={index}>
            <Typography>Hello</Typography>
            <Typography>Sidebar</Typography>
            <Typography>Hello</Typography>
            <Typography>Sidebar</Typography>
            <Typography>Hello</Typography>
            <Typography>Sidebar</Typography>
          </Flex>
        ))}
      </DrawerLayout.Aside>
      <DrawerLayout.Main>
        <Page>
          <Page.Header>
            <button type="button" onClick={handleToggleDrawer}>
              Toggle Drawer
            </button>
            <ThemeSwitcher />
          </Page.Header>
          <Page.Body>
            {Array.from({ length: 100 }).map((_, index) => (
              <Flex key={index}>
                <Typography>Hello</Typography>
                <Typography>Web App!</Typography>
              </Flex>
            ))}
          </Page.Body>
        </Page>
      </DrawerLayout.Main>
    </DrawerLayout>
  );
}
