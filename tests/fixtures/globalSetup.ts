import { request, chromium, type FullConfig } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { authHeaders, createStorageState } from "./auth.js";
import { Env } from "../shared/env.js";
import { TestUsers, Timing } from "../shared/testData.js";

type Probe = {
  name: string;
  run: () => Promise<void>;
};

async function waitForProbe(probe: Probe): Promise<void> {
  const startedAt = Date.now();

  while (Date.now() - startedAt < Timing.envReadyTimeoutMs) {
    try {
      await probe.run();
      return;
    } catch {
      await new Promise((resolve) =>
        setTimeout(resolve, Timing.probeIntervalMs),
      );
    }
  }

  throw new Error(`Environment probe timed out: ${probe.name}`);
}

export default async function globalSetup(_config: FullConfig): Promise<void> {
  const apiOrigin = new URL(Env.apiBaseUrl).origin;

  await waitForProbe({
    name: "api-openapi",
    run: async () => {
      const response = await fetch(
        `${apiOrigin}/openapi/trouble-ticket-api.yaml`,
      );
      if (!response.ok) {
        throw new Error(`API not ready: ${response.status}`);
      }
    },
  });

  const apiContext = await request.newContext();
  try {
    await waitForProbe({
      name: "keycloak-token",
      run: async () => {
        await authHeaders(TestUsers.alpha, apiContext);
      },
    });
  } finally {
    await apiContext.dispose();
  }

  const browser = await chromium.launch();
  try {
    await mkdir(".auth", { recursive: true });
    await createStorageState(browser, TestUsers.alpha, ".auth/alpha.json");
  } finally {
    await browser.close();
  }
}
