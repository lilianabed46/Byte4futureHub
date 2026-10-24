// Shared domain types for the B4F Hub.
//
// These mirror the shapes returned by the real API in `server/` exactly
// (see server/data.js) — the frontend does not rename or reshape fields
// coming back from the server, so the types here double as the wire
// contract.

export type PostCategory = "announcement" | "event" | "community" | "resource";

export const POST_CATEGORIES: { value: PostCategory; label: string }[] = [
  { value: "community", label: "Community" },
  { value: "announcement", label: "Announcement" },
  { value: "event", label: "Event" },
  { value: "resource", label: "Resource" },
];

export interface Post {
  id: number;
  author: string;
  /** Short initials shown in the avatar (e.g. "MA", or "YOU" for your own posts). */
  avatar: string;
  category: PostCategory;
  content: string;
  /** ISO 8601 timestamp, as returned by the server. */
  createdAt: string;
  likes: number;
  liked: boolean;
}

export interface NewPostInput {
  content: string;
  category: PostCategory;
}

export type OpportunityType = "job" | "internship" | "scholarship" | "volunteer";
export type WorkMode = "hybrid" | "remote" | "on-site";

export const OPPORTUNITY_TYPES: { value: OpportunityType; label: string }[] = [
  { value: "job", label: "Job" },
  { value: "internship", label: "Internship" },
  { value: "scholarship", label: "Scholarship" },
  { value: "volunteer", label: "Volunteer" },
];

export const WORK_MODES: { value: WorkMode; label: string }[] = [
  { value: "hybrid", label: "Hybrid" },
  { value: "remote", label: "Remote" },
  { value: "on-site", label: "On-site" },
];

export interface Opportunity {
  id: number;
  title: string;
  company: string;
  /** Short initials shown in the logo tile (e.g. "NW"). */
  companyLogo: string;
  type: OpportunityType;
  workMode: WorkMode;
  location: string;
  skills: string[];
  description: string;
  /** ISO date, e.g. "2026-09-30". */
  deadline: string;
  /** ISO date, e.g. "2026-08-15". Not currently surfaced in the UI. */
  postedAt: string;
  level: string;
  applied: boolean;
  /**
   * Client-only "bookmark" flag. There is no save/bookmark endpoint on the
   * server (see server/index.js), so this never comes from the API and is
   * never persisted — it's attached locally by useOpportunitiesData and
   * resets on reload. See the README for why.
   */
  saved: boolean;
}

export type LoadStatus = "loading" | "error" | "ready";

export interface AppNotification {
  id: string;
  message: string;
}

/** Shape of a JSON error body returned by the API on a non-2xx response. */
export interface ApiErrorBody {
  error: string;
}
