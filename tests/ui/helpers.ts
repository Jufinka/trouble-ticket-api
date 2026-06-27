import { expect, type APIRequestContext, type Page } from "@playwright/test";

import {
  apiUrl,
  createTicketPayload,
  uniqueExternalId,
} from "../api/helpers.js";
import { authHeaders, type TenantUser } from "../fixtures/auth.js";

const TEST_PASSWORD = process.env.KEYCLOAK_PASSWORD ?? "Test1234!";

export async function loginAs(
  page: Page,
  username: TenantUser = "alpha",
): Promise<void> {
  await page.goto("/");

  const usernameInput = page
    .locator("input[name='username'], #username")
    .first();
  const requiresLogin = await usernameInput
    .isVisible({ timeout: 3_000 })
    .catch(() => false);

  if (requiresLogin) {
    await usernameInput.fill(username);
    await page
      .locator("input[name='password'], #password")
      .first()
      .fill(TEST_PASSWORD);
    await page.getByRole("button", { name: /sign in|log in|zaloguj/i }).click();
  }

  await expect(page.getByRole("heading", { name: "Zgłoszenia" })).toBeVisible({
    timeout: 15_000,
  });
}

export async function createTicketForTenant(
  request: APIRequestContext,
  tenant: TenantUser,
  prefix: string,
  serviceId = 100002,
): Promise<{ externalId: string }> {
  const externalId = uniqueExternalId(prefix);
  const headers = await authHeaders(tenant, request);

  const response = await request.post(apiUrl("troubleTicket"), {
    headers,
    data: createTicketPayload(externalId, serviceId),
  });

  expect([200, 201]).toContain(response.status());
  return { externalId };
}
