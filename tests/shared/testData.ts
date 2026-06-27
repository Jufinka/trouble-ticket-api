export const TestUsers = {
  alpha: "alpha",
  beta: "beta",
  gamma: "gamma",
} as const;

export const HttpStatus = {
  ok: 200,
  created: 201,
  badRequest: 400,
  notFound: 404,
} as const;

export const ApiErrorCodes = {
  ticketNotFound: "TROUBLE_TICKET_NOT_FOUND",
  noteAdditionNotAllowed: "NOTE_ADDITION_NOT_ALLOWED",
} as const;

export const ApiPaths = {
  troubleTicket: "troubleTicket",
} as const;

export const ApiTestData = {
  defaultServiceId: 100002,
  defaultNote: "Created by E2E API scenario",
  newStatus: "new",
  closeBlockedNote: "This should be blocked",
  tenantIsolationPrefix: "E2E-TENANT",
  noteNotAllowedPrefix: "E2E-NOTE-CLOSED",
  closeStatus: "closed",
} as const;

export const UiTestData = {
  listPrefix: "E2E-UI-LIST",
  detailPrefix: "E2E-UI-DETAIL",
  closePrefix: "E2E-UI-CLOSE",
  createPrefix: "E2E-UI-CREATE",
  createDescription: "UI create ticket scenario description",
  createInitialNote: "UI create ticket initial note",
} as const;

export const UiText = {
  ticketsHeading: "Zgłoszenia",
  createTicketButton: "Nowe zgłoszenie",
  createTicketHeading: "Nowe zgłoszenie",
  createTicketSubmitButton: "Utwórz zgłoszenie",
  ticketCreatedToast: "Zgłoszenie zostało utworzone",
  notesHeadingPrefixRegex: /^Notatki \(/,
  addNoteHeading: "Dodaj notatkę",
  ticketClosedToast: "Zgłoszenie zostało zamknięte",
  closeTicketButton: "Zamknij zgłoszenie",
  acknowledgedStatusLabel: "Przyjęte",
} as const;

export const UiSelectors = {
  usernameInput: "input[name='username'], #username",
  passwordInput: "input[name='password'], #password",
  keycloakLoginButtonName: /sign in|log in|zaloguj/i,
} as const;

export const Timing = {
  shortVisibleTimeoutMs: 3_000,
  appReadyTimeoutMs: 15_000,
  apiTokenTimeoutMs: 10_000,
  testTimeoutMs: 30_000,
  expectTimeoutMs: 5_000,
} as const;

export type CreateTicketFormData = {
  externalId: string;
  serviceId: string;
  description: string;
  note?: string;
};

export function buildUiCreateTicketForm(
  externalId: string,
): CreateTicketFormData {
  return {
    externalId,
    serviceId: String(ApiTestData.defaultServiceId),
    description: UiTestData.createDescription,
    note: UiTestData.createInitialNote,
  };
}
