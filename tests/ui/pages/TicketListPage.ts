import { expect, type Page } from "@playwright/test";
import { UiText } from "../../shared/testData.js";

export class TicketListPage {
  constructor(private readonly page: Page) {}

  async assertLoaded(): Promise<void> {
    await expect(
      this.page.getByRole("heading", { name: UiText.ticketsHeading }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("button", { name: UiText.createTicketButton }),
    ).toBeVisible();
  }

  async reload(): Promise<void> {
    await this.page.reload();
  }

  async openCreateTicket(): Promise<void> {
    await this.page
      .getByRole("button", { name: UiText.createTicketButton })
      .click();
  }

  async openTicket(externalId: string): Promise<void> {
    await this.ticketRow(externalId).click();
  }

  async assertTicketVisibleWithStatus(
    externalId: string,
    statusLabel: string,
  ): Promise<void> {
    const row = this.ticketRow(externalId);
    await expect(row).toBeVisible();
    await expect(row).toContainText(statusLabel);
  }

  private ticketRow(externalId: string) {
    return this.page
      .locator("tbody tr")
      .filter({
        has: this.page.getByRole("cell", { name: externalId, exact: true }),
      })
      .first();
  }
}
