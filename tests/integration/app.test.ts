import { BadResponse, EventType, GitEvent } from "../../src/types";
import { App } from "../../src/app";
import { GithubApi } from "../../src/lib/githubApi";

describe(`App integration test`, () => {
  let api: GithubApi;
  let eventsSpy: jest.SpyInstance;
  let app: App;
  let logSpy: jest.SpyInstance;
  beforeEach(() => {
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    api = new GithubApi(`url`);
    eventsSpy = jest.spyOn(api, "getEvents");
    app = new App(api);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it(`process wih empty username`, async () => {
    await app.process({ username: `` });

    expect(logSpy).toHaveBeenCalledWith(`Bad username provided`);
  });
  it(`process exception`, async () => {
    eventsSpy.mockImplementationOnce(() => {
      throw new Error(`catch me`);
    });
    await app.process({ username: `abracadabra` });
    expect(logSpy).toHaveBeenCalledWith(`API error: catch me`);
  });
  it(`process bad response`, async () => {
    eventsSpy.mockReturnValue({
      status: 404,
      data: {
        message: "Not found",
      } as BadResponse,
    });

    await app.process({ username: `abracadabra` });

    expect(logSpy).toHaveBeenCalledWith(`Bad response received: Not found`);
  });
  it(`process with events`, async () => {
    const events = [
      {
        type: EventType.PushEvent,
        repo: {
          url: "test-url",
        },
        payload: {
          repository_id: 1,
          commits: [{}, {}, {}],
        },
      },
      {
        type: EventType.CreateEvent,
        repo: {
          url: "test-url",
        },
        payload: {
          ref: "main",
          ref_type: "branch",
        },
      },
      {
        type: "UnknownEvent",
        payload: {
          something: "some value",
        },
      },
    ] as GitEvent[];
    eventsSpy.mockReturnValue({
      status: 200,
      data: events,
    });

    await app.process({ username: `abracadabra` });

    expect(eventsSpy).toHaveBeenCalledWith(`abracadabra`);
    expect(logSpy).toHaveBeenNthCalledWith(1, `Pushed 3 commits to test-url`);
    expect(logSpy).toHaveBeenNthCalledWith(2, `Created branch in test-url`);
    expect(logSpy).toHaveBeenNthCalledWith(
      3,
      `UnknownEvent, no format instructions:\n ${JSON.stringify(events[2])}`
    );
  });
  it(`process with raw response`, async () => {
    const response = {
      status: 500,
      data: {
        something: "test",
      },
    };
    eventsSpy.mockReturnValue(response);

    await app.process({ username: `abracadabra` });
    expect(logSpy).toHaveBeenCalledWith(`Raw response: ${response}`);
  });
});
