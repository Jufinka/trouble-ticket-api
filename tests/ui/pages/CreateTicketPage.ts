import { expect, type Page } from "@playwright/test";
import type { CreateTicketFormData } from "../../shared/testData.js";
import { UiText } from "../../shared/testData.js";

export class CreateTicketPage {
  constructor(private readonly page: Page) {}

  async assertLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/tickets\/new$/);
    await expect(
      this.page.getByRole("heading", { name: UiText.createTicketHeading }),
    ).toBeVisible();
  }

  async fillForm(data: CreateTicketFormData): Promise<void> {
    await this.page.getByLabel("ID zewnętrzny").fill(data.externalId);
    await this.page.getByLabel("ID usługi").fill(data.serviceId);
    await this.page.getByLabel("Opis").fill(data.description);

    if (data.note) {
      await this.page
        .getByLabel("Notatka inicjalna (opcjonalna)")
        .fill(data.note);
    }
  }

  async submit(): Promise<void> {
    await this.page
      .getByRole("button", { name: UiText.createTicketSubmitButton })
      .click();
  }

  async assertCreated(externalId: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(`/tickets/${externalId}$`));
    await expect(this.page.getByText(UiText.ticketCreatedToast)).toBeVisible();
    await expect(
      this.page.getByRole("heading", { name: externalId }),
    ).toBeVisible();
  }
}
