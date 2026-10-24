import type { PostCategory } from "../../types";

export const CATEGORY_BADGE_LABEL: Record<PostCategory, string> = {
  announcement: "Announcement",
  event: "Event",
  community: "Community",
  resource: "Resource",
};

export const CATEGORY_BADGE_STYLE: Record<PostCategory, { background: string; color: string }> = {
  announcement: { background: "var(--cat-announcement-bg)", color: "var(--cat-announcement-text)" },
  event: { background: "var(--cat-event-bg)", color: "var(--cat-event-text)" },
  community: { background: "var(--cat-community-bg)", color: "var(--cat-community-text)" },
  resource: { background: "var(--cat-resource-bg)", color: "var(--cat-resource-text)" },
};

export const CATEGORY_FILTER_OPTIONS: { value: PostCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "announcement", label: "Announcements" },
  { value: "event", label: "Events" },
  { value: "community", label: "Community" },
  { value: "resource", label: "Resources" },
];
