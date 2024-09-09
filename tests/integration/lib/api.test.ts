import { GithubApi } from "../../../src/lib/githubApi";
import { EventType, GitEvent } from "../../../src/types";

describe(`GithubApi: Real github requests`, () => {
  let api: GithubApi;
  beforeAll(() => {
    api = new GithubApi("https://api.github.com");
  });
  afterAll(() => {
    jest.clearAllMocks();
  });
  it(`bad request, 404, 403`, async () => {
    const response = await api.getEvents("fjashdfkjhjasdkjfhasdf");
    expect(response.status).toEqual(404 || 403);
    expect(typeof (response.data as any).message).toEqual("string");
  });
  it(`good request, 200`, async () => {
    const response = await api.getEvents("optcond");
    expect(response.status).toEqual(200);
    expect(Array.isArray(response.data as GitEvent[])).toBe(true);
    expect(typeof (response.data as GitEvent[])[0].id).toEqual("string");
    expect(Object.values(EventType)).toContain(
      (response.data as GitEvent[])[0].type
    );
  });
});
