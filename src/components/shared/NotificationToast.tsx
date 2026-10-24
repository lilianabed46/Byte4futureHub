interface NotificationToastProps {
  message: string;
  moreCount: number;
  onDismiss: () => void;
}

/** A single dismissible toast; a "+N more" badge surfaces queued ones. */
export function NotificationToast({ message, moreCount, onDismiss }: NotificationToastProps) {
  return (
    <div className="toast" role="status">
      <span>{message}</span>
      <button type="button" className="toast__dismiss" onClick={onDismiss} aria-label="Dismiss notification">
        ×
      </button>
      {moreCount > 0 && <span className="toast__more">+{moreCount} more</span>}
    </div>
  );
}
