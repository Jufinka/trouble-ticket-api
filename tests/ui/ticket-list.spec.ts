import { test } from "@playwright/test";

import { createCloseableTicketForTenant } from "./helpers.js";
import { LoginPage } from "./pages/LoginPage.js";
import { TicketListPage } from "./pages/TicketListPage.js";
import { TestUsers, UiTestData, UiText } from "../shared/testData.js";

test.describe("SC-UI-03 UI ticket list", () => {
  test("shows list with created ticket and status chip", async ({
    page,
    request,
  }) => {
    const loginPage = new LoginPage(page);
    const ticketListPage = new TicketListPage(page);

    const { externalId } = await createCloseableTicketForTenant(
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
