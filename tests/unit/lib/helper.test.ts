import { ApiResponse, BadResponse, GitEvent } from "../../../src/types";
import { isBadResponse, isGitEventsResponse } from "../../../src/lib/helper";

describe(`Helpers test`, () => {
  it(`isGetEventsOkResponse`, () => {
    const responseOk: ApiResponse<GitEvent[]> = {
      status: 200,
      data: [],
    };
    const responseBad: ApiResponse<BadResponse> = {
      status: 404,
      data: {} as any,
    };
    expect(isGitEventsResponse(responseOk)).toBe(true);
    expect(isGitEventsResponse(responseBad)).toBe(false);
  });
  it(`isBadResponse`, () => {
    const responseBad: ApiResponse<GitEvent[]> = {
      status: 200,
      data: [],
    };
    const responseOk: ApiResponse<BadResponse> = {
      status: 404,
      data: {} as any,
    };
    expect(isBadResponse(responseOk)).toBe(true);
    expect(isBadResponse(responseBad)).toBe(false);
  });
});
