import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DrawerLayout, Flex, Page, ThemeSwitcher } from "ui";

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
            <h1>Hello</h1>
            <h1>Sidebar</h1>
            <h1>Hello</h1>
            <h1>Sidebar</h1>
            <h1>Hello</h1>
            <h1>Sidebar</h1>
          </Flex>
        ))}
      </DrawerLayout.Aside>
      <DrawerLayout.Main>
        <Page>
          <Page.Header>
            <button onClick={handleToggleDrawer}>Toggle Drawer</button>
            <ThemeSwitcher />
          </Page.Header>
          <Page.Body>
            {Array.from({ length: 100 }).map((_, index) => (
              <Flex key={index}>
                <h1>Hello</h1>
                <h1>Web App!</h1>
              </Flex>
            ))}
          </Page.Body>
        </Page>
      </DrawerLayout.Main>
    </DrawerLayout>
  );
}
