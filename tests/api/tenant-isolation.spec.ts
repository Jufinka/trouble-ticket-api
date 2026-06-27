import { expect, test } from "@playwright/test";

import { authHeaders } from "../fixtures/auth.js";
import { apiUrl, createTicketPayload, uniqueExternalId } from "./helpers.js";
import {
  ApiErrorCodes,
  ApiPaths,
  ApiTestData,
  HttpStatus,
  TestUsers,
} from "../shared/testData.js";

test.describe("SC-API-01 Tenant isolation", () => {
  test("alpha creates ticket and beta cannot read it (404)", async ({
    request,
  }) => {
    const externalId = uniqueExternalId(ApiTestData.tenantIsolationPrefix);

    const alphaHeaders = await authHeaders(TestUsers.alpha, request);
    const createResponse = await request.post(apiUrl(ApiPaths.troubleTicket), {
      headers: alphaHeaders,
      data: createTicketPayload(externalId),
    });

    expect(createResponse.status()).toBe(HttpStatus.created);
    const createdTicket = await createResponse.json();
    expect(createdTicket.externalId).toBe(externalId);

    const betaHeaders = await authHeaders(TestUsers.beta, request);
    const readByBetaResponse = await request.get(
      apiUrl(`${ApiPaths.troubleTicket}/${externalId}`),
      {
        headers: betaHeaders,
      },
    );

    expect(readByBetaResponse.status()).toBe(HttpStatus.notFound);
    const errorBody = await readByBetaResponse.json();
    expect(errorBody.code).toBe(ApiErrorCodes.ticketNotFound);
    expect(errorBody.requestId).toBeTruthy();
  });
});
