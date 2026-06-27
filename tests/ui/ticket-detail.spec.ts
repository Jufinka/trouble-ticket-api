import { expect, test } from "@playwright/test";

import { createTicketForTenant, loginAs } from "./helpers.js";

test.describe("UI ticket details", () => {
  test("opens ticket details and displays notes", async ({ page, request }) => {
    const { externalId } = await createTicketForTenant(
      request,
      "alpha",
      "E2E-UI-DETAIL",
    );

    await loginAs(page, "alpha");

    const ticketRow = page.locator("tr", { hasText: externalId });
    await ticketRow.click();

    await expect(page).toHaveURL(new RegExp(`/tickets/${externalId}$`));
    await expect(page.getByRole("heading", { name: externalId })).toBeVisible();
    await expect(page.getByText(/^Notatki \(/)).toBeVisible();
    await expect(page.getByText("Created by E2E API scenario")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Dodaj notatkę" }),
    ).toBeVisible();
  });
});
