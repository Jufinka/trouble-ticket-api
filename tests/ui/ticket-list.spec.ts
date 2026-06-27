import { test } from "@playwright/test";

import { createTicketForTenant } from "./helpers.js";
import { LoginPage } from "./pages/LoginPage.js";
import { TicketListPage } from "./pages/TicketListPage.js";
import { TestUsers, UiTestData, UiText } from "../shared/testData.js";

test.describe("UI ticket list", () => {
  test("shows list with created ticket and status chip", async ({
    page,
    request,
  }) => {
    const loginPage = new LoginPage(page);
    const ticketListPage = new TicketListPage(page);

    const { externalId } = await createTicketForTenant(
      request,
      TestUsers.alpha,
      UiTestData.listPrefix,
    );

    await loginPage.open();
    await loginPage.loginIfNeeded(TestUsers.alpha);
    await ticketListPage.reload();

    await ticketListPage.assertLoaded();
    await ticketListPage.assertTicketVisibleWithStatus(
      externalId,
      UiText.acknowledgedStatusLabel,
    );
  });
});
