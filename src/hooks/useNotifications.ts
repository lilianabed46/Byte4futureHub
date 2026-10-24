import { useCallback, useEffect, useRef, useState } from "react";
import type { AppNotification } from "../types";

const AUTO_DISMISS_MS = 4000;
let nextId = 1;

/**
 * A small FIFO notification queue. Only the oldest notification is shown;
 * if others arrive while it's visible, the toast surfaces a "+N more" count
 * instead of stacking multiple toasts on screen.
 */
export function useNotifications() {
  const [queue, setQueue] = useState<AppNotification[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const notify = useCallback((message: string) => {
    const id = `n${nextId++}`;
    setQueue((q) => [...q, { id, message }]);
  }, []);

  const dismiss = useCallback(() => {
    setQueue((q) => q.slice(1));
  }, []);

  const current = queue[0] ?? null;
  const moreCount = Math.max(0, queue.length - 1);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (current) {
      timerRef.current = setTimeout(dismiss, AUTO_DISMISS_MS);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.id]);

  return { current, moreCount, notify, dismiss };
}
