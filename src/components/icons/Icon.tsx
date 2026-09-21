const paths: Record<string, React.ReactNode> = {
  "arrow-right": <path d="M4 12h15m0 0-5.5-5.5M19 12l-5.5 5.5" />,
  download: (
    <>
      <path d="M12 3v11m0 0 4-4m-4 4-4-4" />
      <path d="M4 18.5h16" />
    </>
  ),
  smile: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 14.2c.9 1.1 2.1 1.7 3.5 1.7s2.6-.6 3.5-1.7" />
      <path d="M9 9.5h.01M15 9.5h.01" strokeWidth="2.4" strokeLinecap="round" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3" y="7.5" width="18" height="12.5" rx="2.5" />
      <path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5" />
      <path d="M3 12.5h18" />
    </>
  ),
  trophy: (
    <>
      <path d="M7.5 4h9v4.5a4.5 4.5 0 0 1-9 0V4Z" />
      <path d="M7.5 5.5H5A2 2 0 0 0 5 9.5h.9M16.5 5.5H19a2 2 0 0 1 0 4h-.9" />
      <path d="M12 13v3.5M8.5 20h7M9.5 20c.4-2 1-3.5 2.5-3.5s2.1 1.5 2.5 3.5" />
    </>
  ),
  send: <path d="M21 3.8 3.6 10.4c-.8.3-.8 1.4 0 1.7l6.4 2.3 2.3 6.4c.3.8 1.4.8 1.7 0L21 3.8Zm0 0-11 11.6" />,
  code: <path d="M9 8.5 5 12l4 3.5m6-7 4 3.5-4 3.5M13.5 5.5l-3 13" />,
  star: (
    <path d="M12 4.2l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.6-4.8 2.6.9-5.4L4.2 9.9l5.4-.8L12 4.2Z" />
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </>
  ),
  pen: (
    <>
      <path d="M16.8 3.9a2.3 2.3 0 0 1 3.3 3.3l-10 10-4.4 1.1 1.1-4.4 10-10Z" />
      <path d="m15.2 5.6 3.2 3.2" />
    </>
  ),
  copy: (
    <>
      <rect x="9" y="9" width="11" height="11" rx="2.5" />
      <path d="M15 6.5A2.5 2.5 0 0 0 12.5 4h-6A2.5 2.5 0 0 0 4 6.5v6A2.5 2.5 0 0 0 6.5 15" />
    </>
  ),
};

export type IconName = keyof typeof paths;

export function Icon({
  name,
  className,
  strokeWidth = 1.6,
}: {
  name: string;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {paths[name] ?? null}
    </svg>
  );
}
