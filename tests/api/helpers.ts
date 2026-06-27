import { ApiTestData } from "../shared/testData.js";

const RANDOM_SUFFIX_MAX = 1_000_000;
const RANDOM_SUFFIX_WIDTH = String(RANDOM_SUFFIX_MAX - 1).length;
const RANDOM_SUFFIX_PAD_CHAR = "0";

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function uniqueExternalId(prefix: string): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * RANDOM_SUFFIX_MAX)
    .toString()
    .padStart(RANDOM_SUFFIX_WIDTH, RANDOM_SUFFIX_PAD_CHAR);
  return `${prefix}-${timestamp}-${random}`;
}

const API_BASE_URL = getRequiredEnv("API_BASE_URL");

export function apiUrl(path: string): string {
  return `${API_BASE_URL}/${path.replace(/^\/+/, "")}`;
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
