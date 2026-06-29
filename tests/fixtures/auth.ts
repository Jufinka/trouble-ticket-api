import {
  request,
  type APIRequestContext,
  type Browser,
  type BrowserContext,
} from "@playwright/test";
import { Env } from "../shared/env.js";
import { Timing, UiSelectors } from "../shared/testData.js";

export { getRequiredEnv } from "../shared/env.js";

export type TenantUser = "alpha" | "beta" | "gamma";

type TokenResponse = {
  access_token: string;
};

export function resolveTenantUsername(user: TenantUser): string {
  switch (user) {
    case "alpha":
      return Env.keycloakUsernameAlpha;
    case "beta":
      return Env.keycloakUsernameBeta;
    case "gamma":
      return Env.keycloakUsernameGamma;
  }
}

function tokenUrl(): string {
  return `${Env.keycloakBaseUrl}/realms/${Env.keycloakRealm}/protocol/openid-connect/token`;
}

export async function getAccessToken(
  user: TenantUser,
  apiContext?: APIRequestContext,
): Promise<string> {
  const ownedContext = apiContext ?? (await request.newContext());
  const username = resolveTenantUsername(user);

  try {
    const response = await ownedContext.post(tokenUrl(), {
      form: {
        grant_type: "password",
        client_id: Env.keycloakClientId,
        username,
        password: Env.keycloakPassword,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      timeout: Timing.apiTokenTimeoutMs,
    });

    if (!response.ok()) {
      const body = await response.text();
      throw new Error(`Token request failed (${response.status()}): ${body}`);
    }

    const payload = (await response.json()) as TokenResponse;
    if (!payload.access_token) {
      throw new Error("Token response does not contain access_token");
    }

    return payload.access_token;
  } finally {
    if (!apiContext) {
      await ownedContext.dispose();
    }
  }
}

export async function authHeaders(
  user: TenantUser,
  apiContext?: APIRequestContext,
): Promise<Record<string, string>> {
  const token = await getAccessToken(user, apiContext);
  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function createStorageState(
  browser: Browser,
  user: TenantUser,
  outputPath: string,
): Promise<void> {
  const context: BrowserContext = await browser.newContext();
  const page = await context.newPage();
  const username = resolveTenantUsername(user);

  await page.goto(Env.frontendBaseUrl);
  await page.locator(UiSelectors.usernameInput).first().fill(username);
  await page
    .locator(UiSelectors.passwordInput)
    .first()
    .fill(Env.keycloakPassword);
  await page.locator(UiSelectors.keycloakLoginButton).click();
  await page.waitForURL("**/");
  await context.storageState({ path: outputPath });
  await context.close();
}
