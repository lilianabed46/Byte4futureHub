import type { Opportunity } from "../../types";
import { formatApplyBy, formatWorkMode } from "../../lib/format";
import { Avatar } from "../shared/Avatar";
import { TYPE_BADGE_LABEL, TYPE_BADGE_STYLE } from "./typeMeta";

interface OpportunityCardProps {
  opportunity: Opportunity;
  isExpanded: boolean;
  onToggleDetails: (id: number) => void;
  onToggleSaved: (id: number) => void;
  onApply: (id: number) => void;
  isApplying: boolean;
}

export function OpportunityCard({
  opportunity,
  isExpanded,
  onToggleDetails,
  onToggleSaved,
  onApply,
  isApplying,
}: OpportunityCardProps) {
  const o = opportunity;

  return (
    <article className="opportunity-card">
      <div className="opportunity-card__head">
        <Avatar initials={o.companyLogo} seed={o.company} shape="square" />
        <div className="opportunity-card__title-block">
          <div className="opportunity-card__title">{o.title}</div>
          <div className="opportunity-card__company">{o.company}</div>
        </div>
        <button
          type="button"
          className={`save-btn ${o.saved ? "is-saved" : ""}`}
          onClick={() => onToggleSaved(o.id)}
          aria-pressed={o.saved}
          aria-label={o.saved ? "Remove from saved" : "Save opportunity"}
          title={o.saved ? "Saved" : "Save"}
        >
          {o.saved ? "★" : "☆"}
        </button>
      </div>

      <div className="opportunity-card__badges">
        <span className="badge-type" style={TYPE_BADGE_STYLE[o.type]}>
          {TYPE_BADGE_LABEL[o.type]}
        </span>
        <span className="badge-mode">{formatWorkMode(o.workMode)}</span>
        <span className="badge-mode">{o.location}</span>
      </div>

      <div className="opportunity-card__skills">
        {o.skills.map((skill) => (
          <span key={skill} className="tag">
            {skill}
          </span>
        ))}
      </div>

      {isExpanded && (
        <>
          <p className="opportunity-card__description">{o.description}</p>
          <p className="opportunity-card__apply-by">{formatApplyBy(o.deadline)}</p>
        </>
      )}

      <div className="opportunity-card__actions">
        <button type="button" className="btn btn-outline btn-sm" onClick={() => onToggleDetails(o.id)}>
          {isExpanded ? "Hide details" : "View details"}
        </button>
        {o.applied ? (
          <button type="button" className="btn btn-applied btn-sm" disabled>
            Applied
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => onApply(o.id)}
            disabled={isApplying}
          >
            {isApplying ? "Applying..." : "Apply"}
          </button>
        )}
      </div>
    </article>
  );
}
