import { BadResponse, GitEvent } from "../types";
import { isCreateEvent, isPushEvent } from "./helper";

type ParsedEvent = string;
type ParsedBadResponse = string;

export class Parser {
  public static parseEvents(data: GitEvent[]): ParsedEvent[] {
    return data.map((event) => {
      if (isPushEvent(event)) {
        return `Pushed ${event.payload.commits.length} commits to ${event.repo.url}`;
      } else if (isCreateEvent(event)) {
        return `Created ${event.payload.ref_type} in ${event.repo.url}`;
      } else {
        return `${event.type}, no format instructions:\n ${JSON.stringify(
          event
        )}`;
      }
    });
  }
  public static parseBadResponse(data: BadResponse): ParsedBadResponse {
    return `Bad response received: ${data.message}`;
  }
}
