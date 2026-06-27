import "dotenv/config";
import { defineConfig } from "@playwright/test";
import { Timing } from "./shared/testData.js";

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:8080/api/v1";
const FRONTEND_BASE_URL =
  process.env.FRONTEND_BASE_URL ?? "http://localhost:3000";

export default defineConfig({
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
      },
    },
  ],
});
