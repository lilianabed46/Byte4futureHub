interface EmptyStateProps {
  message: string;
}

/** Shown instead of a blank area when a filter/search matches nothing. */
export function EmptyState({ message }: EmptyStateProps) {
  return <div className="empty-message">{message}</div>;
}
