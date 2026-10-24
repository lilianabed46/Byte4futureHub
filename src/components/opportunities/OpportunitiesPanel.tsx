import { useMemo, useState } from "react";
import type { LoadStatus, Opportunity, OpportunityType, WorkMode } from "../../types";
import { OPPORTUNITY_TYPES, WORK_MODES } from "../../types";
import { LoadingState } from "../shared/LoadingState";
import { ErrorState } from "../shared/ErrorState";
import { EmptyState } from "../shared/EmptyState";
import { OpportunityCard } from "./OpportunityCard";

interface OpportunitiesPanelProps {
  status: LoadStatus;
  opportunities: Opportunity[];
  retry: () => void;
  toggleSaved: (id: number) => void;
  applyTo: (id: number) => Promise<boolean>;
  pendingApplyIds: Set<number>;
  onApplied: (title: string) => void;
  onApplyFailed: (title: string) => void;
}

type TypeFilter = OpportunityType | "all";
type ModeFilter = WorkMode | "all";

export function OpportunitiesPanel({
  status,
  opportunities,
  retry,
  toggleSaved,
  applyTo,
  pendingApplyIds,
  onApplied,
  onApplyFailed,
}: OpportunitiesPanelProps) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [modeFilter, setModeFilter] = useState<ModeFilter>("all");
  const [savedOnly, setSavedOnly] = useState(false);

  // Only one opportunity's details are open at a time. `history` is a back
  // stack of previously-open ids, so switching straight from one opened
  // opportunity to another still leaves a "way back" to the first.
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>([]);

  // Hash Table: id -> opportunity, rebuilt whenever `opportunities` changes.
  // Both spots below that need "the opportunity this id refers to" (the one
  // being applied to, and the one at the top of the back-stack) look it up
  // here in O(1) instead of scanning the array with .find().
  const opportunitiesById = useMemo(
    () => new Map(opportunities.map((o) => [o.id, o])),
    [opportunities]
  );

  const filteredOpportunities = useMemo(() => {
    const query = search.trim().toLowerCase();
    return opportunities.filter((o) => {
      if (typeFilter !== "all" && o.type !== typeFilter) return false;
      if (modeFilter !== "all" && o.workMode !== modeFilter) return false;
      if (savedOnly && !o.saved) return false;
      if (query) {
        const haystack = `${o.title} ${o.company} ${o.skills.join(" ")}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });
  }, [opportunities, typeFilter, modeFilter, savedOnly, search]);

  function handleToggleDetails(id: number) {
    if (expandedId === id) {
      setExpandedId(null);
      setHistory([]);
      return;
    }
    if (expandedId !== null) {
      setHistory((h) => [...h, expandedId]);
    }
    setExpandedId(id);
  }

  function handleBack() {
    setHistory((h) => {
      if (h.length === 0) return h;
      const prevId = h[h.length - 1];
      setExpandedId(prevId);
      return h.slice(0, -1);
    });
  }

  async function handleApply(id: number) {
    const target = opportunitiesById.get(id);
    const title = target ? target.title : "the opportunity";
    const ok = await applyTo(id);
    if (ok) {
      onApplied(title);
    } else {
      onApplyFailed(title);
    }
  }

  const backTarget = history.length > 0 ? opportunitiesById.get(history[history.length - 1]) ?? null : null;

  return (
    <section className="panel">
      <div className="panel__header">
        <h2 className="panel__title">Opportunities</h2>
      </div>
      <div className="panel__body">
        <div className="panel__sticky">
          <div className="opp-filters">
            <input
              type="text"
              className="text-input"
              placeholder="Search title, company, or skill..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search title, company, or skill"
            />
            <div className="opp-filters__row">
              <select
                className="select-input"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
                aria-label="Filter by type"
              >
                <option value="all">All types</option>
                {OPPORTUNITY_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              <select
                className="select-input"
                value={modeFilter}
                onChange={(e) => setModeFilter(e.target.value as ModeFilter)}
                aria-label="Filter by work mode"
              >
                <option value="all">All work modes</option>
                {WORK_MODES.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
              <label className="checkbox-row">
                <input type="checkbox" checked={savedOnly} onChange={(e) => setSavedOnly(e.target.checked)} />
                Saved only
              </label>
            </div>
          </div>

          {status === "ready" && (
            <p className="panel__count">
              {filteredOpportunities.length} of {opportunities.length} opportunities shown
            </p>
          )}

          {backTarget && (
            <button type="button" className="back-link" onClick={handleBack}>
              ← Back to {backTarget.title}
            </button>
          )}
        </div>

        {status === "loading" && <LoadingState label="Loading opportunities..." />}
        {status === "error" && (
          <ErrorState message="We could not load opportunities. Please check your connection and try again." onRetry={retry} />
        )}
        {status === "ready" && filteredOpportunities.length === 0 && (
          <EmptyState message="No opportunities match your filters right now." />
        )}
        {status === "ready" && filteredOpportunities.length > 0 && (
          <div className="opportunity-list">
            {filteredOpportunities.map((o) => (
              <OpportunityCard
                key={o.id}
                opportunity={o}
                isExpanded={expandedId === o.id}
                onToggleDetails={handleToggleDetails}
                onToggleSaved={toggleSaved}
                onApply={handleApply}
                isApplying={pendingApplyIds.has(o.id)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
