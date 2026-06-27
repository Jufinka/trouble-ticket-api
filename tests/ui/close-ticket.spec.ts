import { expect, test } from "@playwright/test";

import { createTicketForTenant, loginAs } from "./helpers.js";

test.describe("UI close ticket", () => {
  test("closes ticket and hides close/note actions", async ({
    page,
    request,
  }) => {
    const { externalId } = await createTicketForTenant(
      request,
      "alpha",
      "E2E-UI-CLOSE",
    );

    await loginAs(page, "alpha");
    await page.goto(`/tickets/${externalId}`);

    const closeButton = page.getByRole("button", {
      name: "Zamknij zgłoszenie",
    });
    await expect(closeButton).toBeVisible();
    await closeButton.click();

    await expect(page.getByText("Zgłoszenie zostało zamknięte")).toBeVisible();
    await expect(page.getByText("Zamknięte", { exact: true })).toBeVisible();
    await expect(closeButton).not.toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Dodaj notatkę" }),
    ).not.toBeVisible();
  });
});
