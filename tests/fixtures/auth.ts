import {
  request,
  type APIRequestContext,
  type Browser,
  type BrowserContext,
} from "@playwright/test";

export type TenantUser = "alpha" | "beta" | "gamma";

type TokenResponse = {
  access_token: string;
};

const KEYCLOAK_BASE_URL =
  process.env.KEYCLOAK_BASE_URL ?? "http://localhost:8180";
const KEYCLOAK_REALM = process.env.KEYCLOAK_REALM ?? "ttapi";
const KEYCLOAK_CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID ?? "ttapi-client";
const KEYCLOAK_PASSWORD = process.env.KEYCLOAK_PASSWORD ?? "Test1234!";

function tokenUrl(): string {
  return `${KEYCLOAK_BASE_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`;
}

export async function getAccessToken(
  username: TenantUser,
  apiContext?: APIRequestContext,
): Promise<string> {
  const ownedContext = apiContext ?? (await request.newContext());

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
      timeout: 10_000,
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
  username: TenantUser,
  apiContext?: APIRequestContext,
): Promise<Record<string, string>> {
  const token = await getAccessToken(username, apiContext);
  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function createStorageState(
  browser: Browser,
  username: TenantUser,
  outputPath: string,
): Promise<void> {
  const context: BrowserContext = await browser.newContext();
  const page = await context.newPage();

  await page.goto("http://localhost:3000");
  await page.getByLabel(/username/i).fill(username);
  await page.getByLabel(/password/i).fill(KEYCLOAK_PASSWORD);
  await page.getByRole("button", { name: /sign in|log in|zaloguj/i }).click();
  await page.waitForURL("**/");
  await context.storageState({ path: outputPath });
  await context.close();
}
