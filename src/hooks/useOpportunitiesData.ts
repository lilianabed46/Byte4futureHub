import { useCallback, useState } from "react";
import { applyToOpportunity, fetchOpportunities, type ApiOpportunity } from "../api/client";
import { useAsyncResource } from "./useAsyncResource";
import type { Opportunity } from "../types";

export function useOpportunitiesData() {
  const fetcher = useCallback(() => fetchOpportunities(), []);
  const { status, data: opportunities, setData: setOpportunities, retry } = useAsyncResource<ApiOpportunity[]>(
    fetcher,
    []
  );

  // "Saved" has no backing endpoint on the server (see server/index.js) —
  // it's a client-only bookmark. A Hash Set is the right structure here
  // because the only question ever asked of it is "is this id currently
  // saved, yes or no" — no ordering, no duplicates, just membership — and
  // it resets on reload like any other purely-local UI state would.
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());

  // Ids with an in-flight apply request, mirroring the same guard used for
  // likes: a second click while one is pending is a no-op, not a second request.
  const [pendingApplyIds, setPendingApplyIds] = useState<Set<number>>(new Set());

  const toggleSaved = useCallback((id: number) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  /**
   * Deliberately NOT optimistic, for the same reason as toggleLike: the UI
   * updates only once the server confirms it, and a failure is reported
   * back to the caller (which surfaces it as a notification) instead of
   * being silently reverted. Returns whether it succeeded.
   */
  const applyTo = useCallback(
    async (id: number): Promise<boolean> => {
      if (pendingApplyIds.has(id)) return false; // already applying — the Apply button is also disabled while this is true

      setPendingApplyIds((prev) => new Set(prev).add(id));
      try {
        const updated = await applyToOpportunity(id);
        setOpportunities((prev) => prev.map((o) => (o.id === id ? updated : o)));
        return true;
      } catch {
        return false;
      } finally {
        setPendingApplyIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    },
    [pendingApplyIds, setOpportunities]
  );

  const withSaved: Opportunity[] = opportunities.map((o) => ({ ...o, saved: savedIds.has(o.id) }));

  return { status, opportunities: withSaved, retry, toggleSaved, applyTo, pendingApplyIds };
}
