import type { OpportunityType } from "../../types";

export const TYPE_BADGE_LABEL: Record<OpportunityType, string> = {
  job: "Job",
  internship: "Internship",
  scholarship: "Scholarship",
  volunteer: "Volunteer",
};

export const TYPE_BADGE_STYLE: Record<OpportunityType, { background: string; color: string }> = {
  job: { background: "var(--type-job-bg)", color: "var(--type-job-text)" },
  internship: { background: "var(--type-internship-bg)", color: "var(--type-internship-text)" },
  scholarship: { background: "var(--type-scholarship-bg)", color: "var(--type-scholarship-text)" },
  volunteer: { background: "var(--type-volunteer-bg)", color: "var(--type-volunteer-text)" },
};
