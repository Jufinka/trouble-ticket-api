import "dotenv/config";
import { defineConfig } from "@playwright/test";
import { Timing } from "./shared/testData.js";

const API_BASE_URL = process.env.API_BASE_URL;
const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL;

export default defineConfig({
  globalSetup: "./fixtures/globalSetup.ts",
  retries: 1,
  timeout: Timing.testTimeoutMs,
  expect: {
    timeout: Timing.expectTimeoutMs,
  },
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "api",
      testDir: "./api",
      use: {
        baseURL: API_BASE_URL,
      },
    },
    {
      name: "ui",
      testDir: "./ui",
      use: {
        baseURL: FRONTEND_BASE_URL,
        storageState: ".auth/alpha.json",
      },
    },
  ],
});
