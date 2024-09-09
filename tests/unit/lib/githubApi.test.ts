import { GithubApi } from "../../../src/lib/githubApi";
import { BadResponse, EventType, GitEvent } from "../../../src/types";

describe(`Github API connect test`, () => {
  let api: GithubApi;
  beforeEach(() => {
    api = new GithubApi("");
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it(`Test successful response`, async () => {
    const mockedResponse = new Response(
      JSON.stringify([
        { id: "123", type: EventType.CreateEvent } as any,
      ] as GitEvent[]),
      {
        status: 200,
      }
    );

    const fetchSpy = jest
      .spyOn(GithubApi.prototype as any, "_processRequest")
      .mockReturnValue(mockedResponse);
    const result = await api.getEvents("user");

    expect(fetchSpy).toHaveBeenCalledWith("users/user/events");
    expect(result.status).toEqual(200);
    expect((result.data as GitEvent[])[0].id).toEqual("123");
    expect((result.data as GitEvent[])[0].type).toEqual(EventType.CreateEvent);
  });
  it(`Test not found response`, async () => {
    const mockedResponse = new Response(
      JSON.stringify({
        message: "Not Found",
        documentation_url:
          "https://docs.github.com/rest/activity/events#list-events-for-the-authenticated-user",
        status: "404",
      } as BadResponse),
      {
        status: 404,
      }
    );

    const fetchSpy = jest
      .spyOn(GithubApi.prototype as any, "_processRequest")
      .mockReturnValue(mockedResponse);
    const result = await api.getEvents("abracadabra");

    expect(fetchSpy).toHaveBeenCalledWith("users/abracadabra/events");
    expect(result.status).toEqual(404);
    expect((result.data as BadResponse).message).toEqual("Not Found");
  });
  it(`Test rate limited response`, async () => {
    const mockedResponse = new Response(
      JSON.stringify({
        message:
          "API rate limit exceeded for 185.217.1.3. (But here's the good news: Authenticated requests get a higher rate limit. Check out the documentation for more details.)",
        documentation_url:
          "https://docs.github.com/rest/overview/resources-in-the-rest-api#rate-limiting",
      } as BadResponse),
      {
        status: 403,
      }
    );

    const fetchSpy = jest
      .spyOn(GithubApi.prototype as any, "_processRequest")
      .mockReturnValue(mockedResponse);
    const result = await api.getEvents("abracadabra");

    expect(fetchSpy).toHaveBeenCalledWith("users/abracadabra/events");
    expect(result.status).toEqual(403);
    expect(typeof (result.data as BadResponse).message).toEqual("string");
  });
});
