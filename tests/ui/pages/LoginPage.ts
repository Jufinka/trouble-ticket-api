import { expect, type Page } from "@playwright/test";

import {
  getRequiredEnv,
  resolveTenantUsername,
  type TenantUser,
} from "../../fixtures/auth.js";
import { Timing, UiSelectors, UiText } from "../../shared/testData.js";

const TEST_PASSWORD = getRequiredEnv("KEYCLOAK_PASSWORD");

export class LoginPage {
  constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto("/");
  }

  async loginIfNeeded(username: TenantUser): Promise<void> {
    const loginName = resolveTenantUsername(username);
    const usernameInput = this.page.locator(UiSelectors.usernameInput).first();

    const requiresLogin = await usernameInput
      .isVisible({ timeout: Timing.shortVisibleTimeoutMs })
      .catch(() => false);

    if (requiresLogin) {
      await usernameInput.fill(loginName);
      await this.page
        .locator(UiSelectors.passwordInput)
        .first()
        .fill(TEST_PASSWORD);
      await this.page
        .getByRole("button", { name: UiSelectors.keycloakLoginButtonName })
        .click();
    }

    await expect(
      this.page.getByRole("heading", { name: UiText.ticketsHeading }),
    ).toBeVisible({ timeout: Timing.appReadyTimeoutMs });
  }
}
