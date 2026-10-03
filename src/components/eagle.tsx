import { cn } from "@/lib/utils";

export function EagleMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={cn("text-gold", className)}
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M100 18c6 10 18 22 18 22-8 4-14 12-14 12 16-6 34-2 46 10 8 8 12 20 10 32-8-10-22-16-34-14 6 8 8 20 4 30-8-6-18-8-28-6 4 14 2 30-8 42 12-4 24 2 30 12-16 2-26 14-28 28-2-14-12-26-28-28 6-10 18-16 30-12-10-12-12-28-8-42-10-2-20 0-28 6-4-10-2-22 4-30-12-2-26 4-34 14-2-12 2-24 10-32 12-12 30-16 46-10 0 0-6-8-14-12 0 0 12-12 18-22Z"
      />
      <path
        fill="currentColor"
        opacity="0.85"
        d="M70 86c8 4 14 12 16 22-10-2-20 2-26 10 2-14 6-24 10-32Zm60 0c-8 4-14 12-16 22 10-2 20 2 26 10-2-14-6-24-10-32Z"
      />
      <circle cx="78" cy="78" r="4.5" fill="currentColor" />
      <circle cx="122" cy="78" r="4.5" fill="currentColor" />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        d="M100 122v40M88 148h24"
      />
    </svg>
  );
}
