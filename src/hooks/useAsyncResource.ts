import { useCallback, useEffect, useState } from "react";
import type { LoadStatus } from "../types";

/**
 * Independent Learning Challenge: a custom hook.
 *
 * Both `useCommunityData` and `useOpportunitiesData` needed the exact same
 * three things — a `status` ("loading" | "error" | "ready"), a piece of
 * fetched state, and a `retry` that re-runs the fetch — before either hook
 * went on to add its own domain-specific behavior (composing/liking posts,
 * applying to opportunities). That loading/error/fetch lifecycle is the
 * genuine duplication: it was written twice, identically, before this
 * extraction.
 *
 * `useAsyncResource` owns just that shared lifecycle. It takes a fetcher
 * function and an initial value, and exposes the fetched data alongside a
 * `setData` escape hatch so callers can still layer their own mutations
 * (optimistic or not) on top of whatever was fetched.
 */
export function useAsyncResource<T>(fetcher: () => Promise<T>, initialValue: T) {
  const [status, setStatus] = useState<LoadStatus>("loading");
  const [data, setData] = useState<T>(initialValue);

  const load = useCallback(() => {
    setStatus("loading");
    fetcher()
      .then((result) => {
        setData(result);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
    // `fetcher` is expected to be stable (wrapped in useCallback with an
    // empty dep array by the caller) — see useCommunityData/useOpportunitiesData.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher]);

  useEffect(() => {
    load();
  }, [load]);

  return { status, data, setData, retry: load };
}
