import { expect, test } from "@playwright/test";

import { authHeaders } from "../fixtures/auth.js";
import { apiUrl, createTicketPayload, uniqueExternalId } from "./helpers.js";

test.describe("SC-API-01 Tenant isolation", () => {
  test("alpha creates ticket and beta cannot read it (404)", async ({
    request,
  }) => {
    const externalId = uniqueExternalId("E2E-TENANT");

    const alphaHeaders = await authHeaders("alpha", request);
    const createResponse = await request.post(apiUrl("troubleTicket"), {
      headers: alphaHeaders,
      data: createTicketPayload(externalId),
    });

    expect(createResponse.status()).toBe(201);
    const createdTicket = await createResponse.json();
    expect(createdTicket.externalId).toBe(externalId);

    const betaHeaders = await authHeaders("beta", request);
    const readByBetaResponse = await request.get(
      apiUrl(`troubleTicket/${externalId}`),
      {
        headers: betaHeaders,
      },
    );

    expect(readByBetaResponse.status()).toBe(404);
    const errorBody = await readByBetaResponse.json();
    expect(errorBody.code).toBe("TROUBLE_TICKET_NOT_FOUND");
    expect(errorBody.requestId).toBeTruthy();
  });
});
