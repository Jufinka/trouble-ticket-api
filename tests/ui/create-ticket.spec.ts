import { expect, test } from "@playwright/test";

import { loginAs } from "./helpers.js";
import { uniqueExternalId } from "../api/helpers.js";

test.describe("UI create ticket", () => {
  test("creates ticket from form and redirects to details", async ({
    page,
  }) => {
    const externalId = uniqueExternalId("E2E-UI-CREATE");

    await loginAs(page, "alpha");
    await page.getByRole("button", { name: "Nowe zgłoszenie" }).click();

    await expect(page).toHaveURL(/\/tickets\/new$/);

    await page.getByLabel("ID zewnętrzny").fill(externalId);
    await page.getByLabel("ID usługi").fill("100002");
    await page.getByLabel("Opis").fill("UI create ticket scenario description");
    await page
      .getByLabel("Notatka inicjalna (opcjonalna)")
      .fill("UI create ticket initial note");

    await page.getByRole("button", { name: "Utwórz zgłoszenie" }).click();

    await expect(page).toHaveURL(new RegExp(`/tickets/${externalId}$`));
    await expect(page.getByText("Zgłoszenie zostało utworzone")).toBeVisible();
    await expect(page.getByRole("heading", { name: externalId })).toBeVisible();
  });
});
