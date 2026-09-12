import { defineConfig } from "@playwright/test";

const port = Number(process.env.WEB_PORT) || 3000;
const host = "127.0.0.1";
const baseURL = `http://${host}:${port}`;

export default defineConfig({
  testDir: "./e2e",
  reporter: "list",
  retries: 0,
  use: {
    baseURL,
  },
  webServer: {
    command: `pnpm exec vite --host ${host}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
  },
});
