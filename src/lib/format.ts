/** "Just now", "5m ago", "3h ago", "22d ago" — relative to the current time. */
export function formatRelativeTime(isoTimestamp: string): string {
  const then = new Date(isoTimestamp).getTime();
  if (Number.isNaN(then)) return "";

  const diffMs = Date.now() - then;
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

const DEADLINE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

/** "2026-09-30" -> "Apply by Sep 30, 2026". */
export function formatApplyBy(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "";
  return `Apply by ${DEADLINE_FORMATTER.format(date)}`;
}

const WORK_MODE_LABEL: Record<string, string> = {
  hybrid: "Hybrid",
  remote: "Remote",
  "on-site": "On-site",
};

/** "on-site" -> "On-site" (falls back to title-casing anything unrecognized). */
export function formatWorkMode(workMode: string): string {
  return WORK_MODE_LABEL[workMode] ?? workMode.charAt(0).toUpperCase() + workMode.slice(1);
}
