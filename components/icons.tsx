type P = { className?: string };

/** Chat bubble with a handset — a generic "message us" glyph. */
export function ChatIcon({ className = "h-5 w-5" }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M12 2.5a9.5 9.5 0 0 0-8.2 14.3L2.5 21.5l4.8-1.3A9.5 9.5 0 1 0 12 2.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M8.6 7.6c.3-.3.8-.3 1 .1l.9 1.6c.2.3.1.7-.1 1l-.6.6c.6 1.3 1.6 2.3 2.9 2.9l.6-.6c.3-.3.7-.3 1-.1l1.6.9c.4.2.4.7.1 1l-.8.8c-.6.6-1.5.7-2.3.4a9.4 9.4 0 0 1-5.1-5.1c-.3-.8-.2-1.7.4-2.3l.4-.2Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function ArrowIcon({ className = "h-4 w-4" }: P) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path d="M3 13 13 3M5 3h8v8" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function PhoneIcon({ className = "h-4 w-4" }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M5 3.5h3l1.5 4-2 1.3a11 11 0 0 0 7.7 7.7l1.3-2 4 1.5v3a2 2 0 0 1-2 2A16.5 16.5 0 0 1 3 5.5a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PinIcon({ className = "h-4 w-4" }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12Z" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}
