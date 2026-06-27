import { expect, test } from "@playwright/test";

import { authHeaders } from "../fixtures/auth.js";
import { apiUrl, createTicketPayload, uniqueExternalId } from "./helpers.js";

test.describe("SC-API-02 Note not allowed for closed ticket", () => {
  test("should return 400 NOTE_ADDITION_NOT_ALLOWED for closed ticket", async ({
    request,
  }) => {
    const externalId = uniqueExternalId("E2E-NOTE-CLOSED");
    const headers = await authHeaders("alpha", request);

    const createResponse = await request.post(apiUrl("troubleTicket"), {
      headers,
      data: createTicketPayload(externalId),
    });

    expect(createResponse.status()).toBe(201);

    const closeResponse = await request.patch(
      apiUrl(`troubleTicket/${externalId}`),
      {
        headers,
        data: { status: "closed" },
      },
    );

    expect(closeResponse.status()).toBe(200);

    const noteResponse = await request.post(
      apiUrl(`troubleTicket/${externalId}/note`),
      {
        headers,
        data: { text: "This should be blocked" },
      },
    );

    expect(noteResponse.status()).toBe(400);
    const errorBody = await noteResponse.json();
    expect(errorBody.code).toBe("NOTE_ADDITION_NOT_ALLOWED");
    expect(errorBody.requestId).toBeTruthy();
  });
});
