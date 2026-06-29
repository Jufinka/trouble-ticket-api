import { test } from "@playwright/test";

import { createTicketForTenant } from "./helpers.js";
import { LoginPage } from "./pages/LoginPage.js";
import { TicketDetailPage } from "./pages/TicketDetailPage.js";
import { TicketListPage } from "./pages/TicketListPage.js";
import { ApiTestData, TestUsers, UiTestData } from "../shared/testData.js";

test.describe("SC-UI-04 UI ticket details", () => {
  test("opens ticket details and displays notes", async ({ page, request }) => {
    const loginPage = new LoginPage(page);
    const ticketListPage = new TicketListPage(page);
    const ticketDetailPage = new TicketDetailPage(page);

    const { externalId } = await createTicketForTenant(
      request,
      TestUsers.alpha,
      UiTestData.detailPrefix,
    );

    await loginPage.open();
    await loginPage.loginIfNeeded(TestUsers.alpha);
    await ticketListPage.openTicket(externalId);

    await ticketDetailPage.assertLoaded(externalId);
    await ticketDetailPage.assertNotesSectionVisible();
    await ticketDetailPage.assertNoteVisible(ApiTestData.defaultNote);
    await ticketDetailPage.assertAddNoteSectionVisible();
  });
});
