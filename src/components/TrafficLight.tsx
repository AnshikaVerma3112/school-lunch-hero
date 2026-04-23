import { cn } from "@/lib/utils";
import type { ImpactLevel } from "@/lib/types";
import { impactColorClass, impactLabel } from "@/lib/foodLogic";

export function TrafficLight({ level, size = "md" }: { level: ImpactLevel; size?: "sm" | "md" }) {
  const c = impactColorClass(level);
  const dot = size === "sm" ? "h-2.5 w-2.5" : "h-3 w-3";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        c.bg,
        c.text,
      )}
    >
      <span className={cn("rounded-full", dot, c.dot)} />
      {impactLabel(level)}
    </span>
  );
}
