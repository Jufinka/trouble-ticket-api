import { expect, test } from "@playwright/test";

import { createTicketForTenant, loginAs } from "./helpers.js";

test.describe("UI ticket list", () => {
  test("shows list with created ticket and status chip", async ({
    page,
    request,
  }) => {
    const { externalId } = await createTicketForTenant(
      request,
      "alpha",
      "E2E-UI-LIST",
    );

    await loginAs(page, "alpha");
    await page.reload();

    await expect(
      page.getByRole("heading", { name: "Zgłoszenia" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Nowe zgłoszenie" }),
    ).toBeVisible();

    const ticketRow = page.locator("tr", { hasText: externalId });
    await expect(ticketRow).toBeVisible();
    await expect(ticketRow).toContainText("Przyjęte");
  });
});
