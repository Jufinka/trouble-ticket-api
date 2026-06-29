import { expect, type APIRequestContext } from "@playwright/test";

import {
  apiUrl,
  createTicketPayload,
  uniqueExternalId,
} from "../api/helpers.js";
import { authHeaders, type TenantUser } from "../fixtures/auth.js";
import { ApiPaths, ApiTestData, HttpStatus } from "../shared/testData.js";

export async function createTicketForTenant(
  request: APIRequestContext,
  tenant: TenantUser,
  prefix: string,
  serviceId = ApiTestData.defaultServiceId,
): Promise<{ externalId: string }> {
  const externalId = uniqueExternalId(prefix);
  const headers = await authHeaders(tenant, request);

  const response = await request.post(apiUrl(ApiPaths.troubleTicket), {
    headers,
    data: createTicketPayload(externalId, serviceId),
  });

  expect([HttpStatus.ok, HttpStatus.created]).toContain(response.status());
  return { externalId };
}

export async function createCloseableTicketForTenant(
  request: APIRequestContext,
  tenant: TenantUser,
  prefix: string,
): Promise<{ externalId: string }> {
  return createTicketForTenant(
    request,
    tenant,
    prefix,
    ApiTestData.closeableServiceId,
  );
}
