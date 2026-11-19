import { cn } from "@/src/lib/utils/ui.utils";

export type ChevronDirection = "start" | "end" | "down" | "up";

type ChevronIconProps = {
  direction?: ChevronDirection;
  className?: string;
};

const directionStyles: Record<ChevronDirection, string> = {
  start: "rotate-0 rtl:rotate-180",
  end: "rotate-180 rtl:rotate-0",
  down: "-rotate-90",
  up: "rotate-90",
};

export default function ChevronIcon({
  direction = "start",
  className,
}: ChevronIconProps) {
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
      className={cn("motion-fast", directionStyles[direction], className)}
    >
      <path d="m15 6-6 6 6 6" />
    </svg>
  );
}
