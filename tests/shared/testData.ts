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
  closeableServiceId: 100002,
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
  requiredFieldError: "Pole wymagane",
  requiredPositiveNumberError: "Pole wymagane (liczba > 0)",
} as const;

export const UiSelectors = {
  usernameInput: "input[name='username'], #username",
  passwordInput: "input[name='password'], #password",
  keycloakLoginButton: "#kc-login",
} as const;

export const Timing = {
  shortVisibleTimeoutMs: 3_000,
  appReadyTimeoutMs: 15_000,
  apiTokenTimeoutMs: 10_000,
  testTimeoutMs: 30_000,
  expectTimeoutMs: 5_000,
  envReadyTimeoutMs: 60_000,
  probeIntervalMs: 2_000,
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
