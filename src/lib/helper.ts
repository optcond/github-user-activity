import {
  ApiResponse,
  BadResponse,
  CreateEvent,
  EventType,
  GitEvent,
  PushEvent,
} from "../types";

export function isGitEventsResponse(
  response: ApiResponse<GitEvent[] | BadResponse>
): response is ApiResponse<GitEvent[]> {
  return response.status === 200 && Array.isArray(response.data);
}

export function isBadResponse(
  response: ApiResponse<GitEvent[] | BadResponse>
): response is ApiResponse<BadResponse> {
  return [404, 403].includes(response.status);
}

export function isPushEvent(event: GitEvent): event is PushEvent {
  return event.type === EventType.PushEvent;
}

export function isCreateEvent(event: GitEvent): event is CreateEvent {
  return event.type === EventType.CreateEvent;
}
