import { ApiResponse, GitEvent, BadResponse } from "../types";

export class GithubApi {
  constructor(private apiUrl: string) {}

  protected async _processRequest(path: string): Promise<Response> {
    try {
      const response = await fetch(`${this.apiUrl}/${path}`);
      return response;
    } catch (error) {
      throw new Error(`API connection failed: ${(error as Error).message}`);
    }
  }

  async getEvents(
    username: string
  ): Promise<ApiResponse<GitEvent[] | BadResponse>> {
    const response = await this._processRequest(`users/${username}/events`);

    try {
      switch (response.status) {
        case 200:
          return {
            status: response.status,
            data: await response.json(),
          };
        default:
          return {
            status: response.status,
            data: await response.json(),
          };
      }
    } catch (err) {
      throw new Error(`JSON parse error: ${(err as Error).message}`);
    }
  }
}
