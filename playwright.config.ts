import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  use: {
    baseURL: "http://127.0.0.1:3107",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run start -- -p 3107",
    url: "http://127.0.0.1:3107",
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
