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

test.describe("SC-API-02 Note not allowed for closed ticket", () => {
  test("should return 400 NOTE_ADDITION_NOT_ALLOWED for closed ticket", async ({
    request,
  }) => {
    const externalId = uniqueExternalId(ApiTestData.noteNotAllowedPrefix);
    const headers = await authHeaders(TestUsers.alpha, request);

    const createResponse = await request.post(apiUrl(ApiPaths.troubleTicket), {
      headers,
      data: createTicketPayload(externalId, ApiTestData.closeableServiceId),
    });

    expect(createResponse.status()).toBe(HttpStatus.created);

    const closeResponse = await request.patch(
      apiUrl(`${ApiPaths.troubleTicket}/${externalId}`),
      {
        headers,
        data: { status: ApiTestData.closeStatus },
      },
    );

    expect(closeResponse.status()).toBe(HttpStatus.ok);

    const noteResponse = await request.post(
      apiUrl(`${ApiPaths.troubleTicket}/${externalId}/note`),
      {
        headers,
        data: { text: ApiTestData.closeBlockedNote },
      },
    );

    expect(noteResponse.status()).toBe(HttpStatus.badRequest);
    const errorBody = await noteResponse.json();
    expect(errorBody.code).toBe(ApiErrorCodes.noteAdditionNotAllowed);
    expect(errorBody.requestId).toBeTruthy();
  });
});
