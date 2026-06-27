import { expect, type Locator, type Page } from "@playwright/test";
import { UiText } from "../../shared/testData.js";

export class TicketDetailPage {
  constructor(private readonly page: Page) {}

  async open(externalId: string): Promise<void> {
    await this.page.goto(`/tickets/${externalId}`);
  }

  async assertLoaded(externalId: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(`/tickets/${externalId}$`));
    await expect(
      this.page.getByRole("heading", { name: externalId }),
    ).toBeVisible();
  }

  async assertNotesSectionVisible(): Promise<void> {
    await expect(
      this.page.getByRole("heading", { name: UiText.notesHeadingPrefixRegex }),
    ).toBeVisible();
  }

  async assertNoteVisible(text: string): Promise<void> {
    await expect(this.page.getByText(text)).toBeVisible();
  }

  async assertAddNoteSectionVisible(): Promise<void> {
    await expect(
      this.page.getByRole("heading", { name: UiText.addNoteHeading }),
    ).toBeVisible();
  }

  async closeTicket(): Promise<void> {
    await expect(this.closeButton).toBeVisible();
    await this.closeButton.click();
  }

  async assertClosedState(): Promise<void> {
    await expect(this.page.getByText(UiText.ticketClosedToast)).toBeVisible();
    await expect(this.closeButton).not.toBeVisible();
    await expect(
      this.page.getByRole("heading", { name: UiText.addNoteHeading }),
    ).not.toBeVisible();
  }

  private get closeButton(): Locator {
    return this.page.getByRole("button", { name: UiText.closeTicketButton });
  }
}
