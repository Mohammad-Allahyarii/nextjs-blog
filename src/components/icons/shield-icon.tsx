type ShieldIconProps = {
  className?: string;
};

export default function ShieldIcon({ className }: ShieldIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M12 3.25 19 6v5.25c0 4.4-2.85 7.9-7 9.75-4.15-1.85-7-5.35-7-9.75V6l7-2.75Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
