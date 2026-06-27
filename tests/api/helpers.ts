export function uniqueExternalId(prefix: string): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1_000_000)
    .toString()
    .padStart(6, "0");
  return `${prefix}-${timestamp}-${random}`;
}

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:8080/api/v1";

export function apiUrl(path: string): string {
  return `${API_BASE_URL}/${path.replace(/^\/+/, "")}`;
}

export function createTicketPayload(externalId: string, serviceId = 100002) {
  return {
    externalId,
    serviceId,
    description: `E2E API ticket ${externalId}`,
    status: "new",
    note: "Created by E2E API scenario",
  };
}
