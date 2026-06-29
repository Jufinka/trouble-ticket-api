import { test } from "@playwright/test";

import { CreateTicketPage } from "./pages/CreateTicketPage.js";
import { LoginPage } from "./pages/LoginPage.js";
import { TicketListPage } from "./pages/TicketListPage.js";
import { TestUsers } from "../shared/testData.js";

test.describe("SC-UI-02 UI create ticket validation", () => {
  test("shows validation errors and stays on create page for empty form", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    const ticketListPage = new TicketListPage(page);
    const createTicketPage = new CreateTicketPage(page);

    await loginPage.open();
    await loginPage.loginIfNeeded(TestUsers.alpha);
    await ticketListPage.openCreateTicket();

    await createTicketPage.assertLoaded();
    await createTicketPage.submit();
    await createTicketPage.assertEmptyFormValidation();
  });
});
