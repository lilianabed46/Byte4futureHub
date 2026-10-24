// Thin fetch wrapper around the real B4F Hub API in `server/`.
//
// Requests are made to relative `/api/...` paths. In dev, Vite proxies
// `/api` to the Express server at http://localhost:3001 (see
// vite.config.ts), so the browser never talks cross-origin and the
// Express server itself needs no CORS setup.

import type { ApiErrorBody, NewPostInput, Opportunity, Post } from "../types";

/** What the server actually returns for an opportunity — no `saved` field. */
export type ApiOpportunity = Omit<Opportunity, "saved">;

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, {
      headers: init?.body ? { "Content-Type": "application/json" } : undefined,
      ...init,
    });
  } catch {
    // Network-level failure (server not running, offline, etc.) — surface
    // a single consistent error type so callers don't need to special-case it.
    throw new ApiError("network request failed", 0);
  }

  if (!response.ok) {
    let message = response.statusText || `request failed with status ${response.status}`;
    try {
      const body = (await response.json()) as ApiErrorBody;
      if (body?.error) message = body.error;
    } catch {
      // Response had no JSON body; fall back to the status text above.
    }
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
}

// ---------- Community ----------

export function fetchPosts(): Promise<Post[]> {
  return request<Post[]>("/api/posts");
}

export function createPost(input: NewPostInput): Promise<Post> {
  return request<Post>("/api/posts", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function setPostLiked(id: number, liked: boolean): Promise<Post> {
  return request<Post>(`/api/posts/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ liked }),
  });
}

// ---------- Opportunities ----------

export function fetchOpportunities(): Promise<ApiOpportunity[]> {
  return request<ApiOpportunity[]>("/api/opportunities");
}

export function applyToOpportunity(id: number): Promise<ApiOpportunity> {
  return request<ApiOpportunity>(`/api/opportunities/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ applied: true }),
  });
}
