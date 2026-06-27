import { test } from "@playwright/test";

import { createTicketForTenant } from "./helpers.js";
import { LoginPage } from "./pages/LoginPage.js";
import { TicketDetailPage } from "./pages/TicketDetailPage.js";
import { TestUsers, UiTestData } from "../shared/testData.js";

test.describe("UI close ticket", () => {
  test("closes ticket and hides close/note actions", async ({
    page,
    request,
  }) => {
    const loginPage = new LoginPage(page);
    const ticketDetailPage = new TicketDetailPage(page);

    const { externalId } = await createTicketForTenant(
      request,
      TestUsers.alpha,
      UiTestData.closePrefix,
    );

    await loginPage.open();
    await loginPage.loginIfNeeded(TestUsers.alpha);
    await ticketDetailPage.open(externalId);

    await ticketDetailPage.closeTicket();
    await ticketDetailPage.assertClosedState();
  });
});
