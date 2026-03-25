import { useState } from "react";
import { Pressable } from "react-native";
import { AppLayout, Flex, Page, Sidebar, ThemeProvider, ThemeSwitcher, Typography } from "ui";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setSidebarOpen((prevOpen) => !prevOpen);
  };

  return (
    <ThemeProvider defaultTheme="light">
      <AppLayout isOpened={sidebarOpen}>
        <AppLayout.Aside>
          <Sidebar>
            {Array.from({ length: 100 }).map((_, index) => (
              <Flex key={index}>
                <Typography>Hello</Typography>
                <Typography>Sidebar</Typography>
              </Flex>
            ))}
          </Sidebar>
        </AppLayout.Aside>
        <AppLayout.Main>
          <Page>
            <Page.Header>
              <Pressable onPress={handleToggleSidebar}>
                <Typography>Toggle Sidebar</Typography>
              </Pressable>
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
        </AppLayout.Main>
      </AppLayout>
    </ThemeProvider>
  );
}
