import { exit } from "process";
import { GithubApi } from "./lib/githubApi";
import { isBadResponse, isGitEventsResponse } from "./lib/helper";
import { Parser } from "./lib/parser";

export class App {
  constructor(private api: GithubApi) {}

  async process(data: { username?: string }) {
    const username = data.username?.trim();
    if (!username) {
      console.log(`Bad username provided`);
      return;
    }

    let response: Awaited<ReturnType<GithubApi["getEvents"]>>;
    try {
      response = await this.api.getEvents(username);
    } catch (err) {
      console.log(`API error: ${(err as Error).message}`);
      return;
    }

    if (isGitEventsResponse(response)) {
      const result = Parser.parseEvents(response.data);
      result.forEach((r) => console.log(`${r}`));
    } else if (isBadResponse(response)) {
      const result = Parser.parseBadResponse(response.data);
      console.log(result);
    } else {
      console.log(`Raw response: ${response}`);
    }
  }
}
