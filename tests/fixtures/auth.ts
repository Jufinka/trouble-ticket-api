import {
  request,
  type APIRequestContext,
  type Browser,
  type BrowserContext,
} from "@playwright/test";
import { Timing, UiSelectors } from "../shared/testData.js";

export type TenantUser = "alpha" | "beta" | "gamma";

type TokenResponse = {
  access_token: string;
};

export function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const KEYCLOAK_BASE_URL = getRequiredEnv("KEYCLOAK_BASE_URL");
const KEYCLOAK_REALM = getRequiredEnv("KEYCLOAK_REALM");
const KEYCLOAK_CLIENT_ID = getRequiredEnv("KEYCLOAK_CLIENT_ID");
const KEYCLOAK_PASSWORD = getRequiredEnv("KEYCLOAK_PASSWORD");
const FRONTEND_BASE_URL = getRequiredEnv("FRONTEND_BASE_URL");

const TENANT_USERNAMES: Record<TenantUser, string> = {
  alpha: getRequiredEnv("KEYCLOAK_USERNAME_ALPHA"),
  beta: getRequiredEnv("KEYCLOAK_USERNAME_BETA"),
  gamma: getRequiredEnv("KEYCLOAK_USERNAME_GAMMA"),
};

export function resolveTenantUsername(user: TenantUser): string {
  return TENANT_USERNAMES[user];
}

function tokenUrl(): string {
  return `${KEYCLOAK_BASE_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`;
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
        client_id: KEYCLOAK_CLIENT_ID,
        username,
        password: KEYCLOAK_PASSWORD,
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

  await page.goto(FRONTEND_BASE_URL);
  await page.locator(UiSelectors.usernameInput).first().fill(username);
  await page.locator(UiSelectors.passwordInput).first().fill(KEYCLOAK_PASSWORD);
  await page
    .getByRole("button", { name: UiSelectors.keycloakLoginButtonName })
    .click();
  await page.waitForURL("**/");
  await context.storageState({ path: outputPath });
  await context.close();
}
