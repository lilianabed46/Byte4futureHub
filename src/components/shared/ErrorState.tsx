interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

/** Shown when a panel's data fails to load, with a way to try again. */
export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="state-block is-error" role="alert">
      <div>{message}</div>
      <button type="button" className="btn btn-primary btn-sm" onClick={onRetry}>
        Retry
      </button>
    </div>
  );
}
