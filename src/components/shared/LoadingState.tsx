interface LoadingStateProps {
  label: string;
}

/** Shown while a panel's data is being fetched. */
export function LoadingState({ label }: LoadingStateProps) {
  return (
    <div className="state-block" role="status" aria-live="polite">
      <div style={{ marginBottom: 10 }}>{label}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div className="skeleton-line" style={{ width: "80%", margin: "0 auto" }} />
        <div className="skeleton-line" style={{ width: "60%", margin: "0 auto" }} />
        <div className="skeleton-line" style={{ width: "70%", margin: "0 auto" }} />
      </div>
    </div>
  );
}
