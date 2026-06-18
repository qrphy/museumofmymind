import { defineConfig } from "@playwright/test";

const remoteBaseUrl = process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  use: {
    baseURL: remoteBaseUrl ?? "http://127.0.0.1:3107",
    trace: "retain-on-failure",
  },
  webServer: remoteBaseUrl
    ? undefined
    : {
        command: "npm run start -- -p 3107",
        url: "http://127.0.0.1:3107",
        reuseExistingServer: false,
        timeout: 60_000,
      },
});
