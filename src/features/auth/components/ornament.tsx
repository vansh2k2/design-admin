import { cn } from "@/lib/cn";

/** Thin line – diamond – line divider used on the login screen. */
export function Ornament({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center gap-2 text-dh-orange", className)} aria-hidden="true">
      <span className="h-px w-11 bg-gradient-to-r from-transparent to-dh-orange" />
      <span className="text-[9px] leading-none">◆</span>
      <span className="h-px w-11 bg-gradient-to-l from-transparent to-dh-orange" />
    </div>
  );
}
