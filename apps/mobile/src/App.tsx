import { useState } from "react";
import { AppLayout, Flex, Page, Sidebar, ThemeProvider, ThemeSwitcher, Typography } from "ui";

export default function App() {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <ThemeProvider defaultTheme="light">
      <AppLayout isOpened={openSidebar} onOpen={setOpenSidebar}>
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
