import { test } from "@playwright/test";

import { uniqueExternalId } from "../api/helpers.js";
import { CreateTicketPage } from "./pages/CreateTicketPage.js";
import { LoginPage } from "./pages/LoginPage.js";
import { TicketListPage } from "./pages/TicketListPage.js";
import {
  TestUsers,
  UiTestData,
  buildUiCreateTicketForm,
} from "../shared/testData.js";

test.describe("UI create ticket", () => {
  test("creates ticket from form and redirects to details", async ({
    page,
  }) => {
    const externalId = uniqueExternalId(UiTestData.createPrefix);
    const loginPage = new LoginPage(page);
    const ticketListPage = new TicketListPage(page);
    const createTicketPage = new CreateTicketPage(page);

    await loginPage.open();
    await loginPage.loginIfNeeded(TestUsers.alpha);
    await ticketListPage.openCreateTicket();

    await createTicketPage.assertLoaded();

    await createTicketPage.fillForm(buildUiCreateTicketForm(externalId));

    await createTicketPage.submit();

    await createTicketPage.assertCreated(externalId);
  });
});
