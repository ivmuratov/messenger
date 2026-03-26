import { useState } from "react";
import { DrawerLayout, Flex, Page, ThemeProvider, ThemeSwitcher, Typography } from "ui";

export default function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <ThemeProvider defaultTheme="light">
      <DrawerLayout isOpened={isDrawerOpen} onOpen={setIsDrawerOpen}>
        <DrawerLayout.Aside>
          {Array.from({ length: 100 }).map((_, index) => (
            <Flex key={index}>
              <Typography>Hello</Typography>
              <Typography>Sidebar</Typography>
            </Flex>
          ))}
        </DrawerLayout.Aside>
        <DrawerLayout.Main>
          <Page>
            <Page.Header>
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
    </ThemeProvider>
  );
}
