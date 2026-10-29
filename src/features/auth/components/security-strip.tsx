import { Clock3, Lock, MonitorCheck, ShieldCheck } from "lucide-react";

const ITEMS = [
  { icon: ShieldCheck, title: "Role Based Access", copy: "Access only what you need" },
  { icon: Lock, title: "Data Security", copy: "Industry standard encryption" },
  { icon: Clock3, title: "Audit & Logs", copy: "Every action is recorded" },
  { icon: MonitorCheck, title: "Reliable & Secure", copy: "99.9% uptime commitment" },
];

/** Reassurance bar along the bottom of the login screen. */
export function SecurityStrip() {
  return (
    <footer className="relative z-10 mt-6 grid grid-cols-2 gap-y-4 border-t border-white/15 bg-dh-brand px-2 py-3 text-white shadow-[0_-4px_12px_rgba(0,0,0,0.15)] lg:absolute lg:inset-x-0 lg:bottom-0 lg:mt-0 lg:h-[52px] lg:grid-cols-4 lg:gap-y-0 lg:px-[5%] lg:py-0">
      {ITEMS.map(({ icon: Icon, title, copy }, i) => (
        <div
          key={title}
          className={`flex items-center gap-3 pl-4 lg:justify-center lg:pl-0 ${i > 0 ? "lg:border-l lg:border-white/20" : ""} ${i % 2 ? "border-l border-white/20 lg:border-l" : ""}`}
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/[0.12]">
            <Icon className="h-4 w-4 text-white" strokeWidth={2} />
          </span>
          <span className="min-w-0 uppercase tracking-[0.03em]">
            <span className="block text-[10px] font-semibold [text-shadow:1px_1px_2px_rgba(0,0,0,0.4)] sm:text-xs">{title}</span>
            <span className="mt-0.5 block text-[8px] font-semibold text-dh-orange [text-shadow:1px_1px_2px_rgba(0,0,0,0.3)] sm:text-[10.5px]">
              {copy}
            </span>
          </span>
        </div>
      ))}
    </footer>
  );
}
