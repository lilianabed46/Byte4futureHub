const PALETTE = ["#6366f1", "#0ea5e9", "#f59e0b", "#10b981", "#ec4899", "#8b5cf6", "#14b8a6", "#ef4444"];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

interface AvatarProps {
  /** Initials to display, as provided by the API (e.g. post.avatar, opportunity.companyLogo). */
  initials: string;
  /** What to hash for a consistent color; falls back to `initials`. */
  seed?: string;
  shape?: "round" | "square";
}

export function Avatar({ initials, seed, shape = "round" }: AvatarProps) {
  const color = PALETTE[hashString(seed ?? initials) % PALETTE.length];
  return (
    <div
      className={`avatar ${shape === "round" ? "avatar-round" : "avatar-square"}`}
      style={{ background: color }}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}
