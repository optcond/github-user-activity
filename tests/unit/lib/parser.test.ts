import {
  CreateEvent,
  EventType,
  GitEvent,
  PushEvent,
} from "../../../src/types";
import { Parser } from "../../../src/lib/parser";

describe(`Parser formatting`, () => {
  let events: GitEvent[];
  beforeAll(() => {
    events = [
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
  });
  it(`push event`, () => {
    const result = Parser.parseEvents([events[0] as PushEvent]);
    expect(result[0]).toEqual(`Pushed 3 commits to test-url`);
  });
  it(`create event`, () => {
    const result = Parser.parseEvents([events[1] as CreateEvent]);
    expect(result[0]).toEqual(`Created branch in test-url`);
  });
  it(`unknown event`, () => {
    const result = Parser.parseEvents([events[2] as any]);
    expect(result[0]).toEqual(
      `UnknownEvent, no format instructions:\n ${JSON.stringify(events[2])}`
    );
  });
  it(`multiple event`, () => {
    const result = Parser.parseEvents(events);
    expect(result.length).toEqual(3);
    expect(result[0]).toEqual(`Pushed 3 commits to test-url`);
    expect(result[1]).toEqual(`Created branch in test-url`);
    expect(result[2]).toEqual(
      `UnknownEvent, no format instructions:\n ${JSON.stringify(events[2])}`
    );
  });
  it(`bad response`, () => {
    const result = Parser.parseBadResponse({
      message: `I am a bad response`,
      documentation_url: ``,
    });
    expect(result).toEqual(`Bad response received: I am a bad response`);
  });
});
