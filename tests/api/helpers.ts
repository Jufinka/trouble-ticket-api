import { ApiTestData } from "../shared/testData.js";
import { Env } from "../shared/env.js";

const RANDOM_SUFFIX_MAX = 1_000_000;
const RANDOM_SUFFIX_WIDTH = String(RANDOM_SUFFIX_MAX - 1).length;
const RANDOM_SUFFIX_PAD_CHAR = "0";

export function uniqueExternalId(prefix: string): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * RANDOM_SUFFIX_MAX)
    .toString()
    .padStart(RANDOM_SUFFIX_WIDTH, RANDOM_SUFFIX_PAD_CHAR);
  return `${prefix}-${timestamp}-${random}`;
}

export function apiUrl(path: string): string {
  return `${Env.apiBaseUrl}/${path.replace(/^\/+/, "")}`;
}

export function createTicketPayload(
  externalId: string,
  serviceId = ApiTestData.defaultServiceId,
) {
  return {
    externalId,
    serviceId,
    description: `E2E API ticket ${externalId}`,
    status: ApiTestData.newStatus,
    note: ApiTestData.defaultNote,
  };
}
