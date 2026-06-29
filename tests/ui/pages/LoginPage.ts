import { expect, type Page } from "@playwright/test";

import {
  getRequiredEnv,
  resolveTenantUsername,
  type TenantUser,
} from "../../fixtures/auth.js";
import { Timing, UiSelectors, UiText } from "../../shared/testData.js";

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
      const password = getRequiredEnv("KEYCLOAK_PASSWORD");
      await this.page.locator(UiSelectors.passwordInput).first().fill(password);
      await this.page.locator(UiSelectors.keycloakLoginButton).click();
    }

    await expect(
      this.page.getByRole("heading", { name: UiText.ticketsHeading }),
    ).toBeVisible({ timeout: Timing.appReadyTimeoutMs });
  }
}
