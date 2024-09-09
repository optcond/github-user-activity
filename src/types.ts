export interface ApiResponse<T> {
  status: number;
  data: T;
}

export interface BadResponse {
  message: string;
  status?: string;
  documentation_url: string;
}

export enum EventType {
  CreateEvent = "CreateEvent",
  PushEvent = "PushEvent",
  DeleteEvent = "DeleteEvent",
}

export type GitEvent = PushEvent | CreateEvent | UnknownEvent;

export interface BaseGitEvent {
  id: string;
  type: EventType;
  actor: {};
  repo: {
    url: string;
  };
  public: boolean;
  created_at: string;
}

export interface UnknownEvent extends BaseGitEvent {
  payload: any;
}

export interface PushEvent extends BaseGitEvent {
  payload: {
    repository_id: number;
    commits: {}[];
  };
}

export interface CreateEvent extends BaseGitEvent {
  payload: {
    ref: string;
    ref_type: string;
  };
}
