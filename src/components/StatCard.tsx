import { Apple, Droplet, Leaf, Wind } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ImpactLevel } from "@/lib/types";
import { impactColorClass, impactLabel } from "@/lib/foodLogic";

type Kind = "ghg" | "water" | "nutrition";

const ICONS: Record<Kind, typeof Wind> = {
  ghg: Wind,
  water: Droplet,
  nutrition: Apple,
};

const TITLES: Record<Kind, string> = {
  ghg: "Carbon Footprint",
  water: "Water Use",
  nutrition: "Nutrition Score",
};

const SUBS: Record<Kind, string> = {
  ghg: "kg CO₂e total",
  water: "Litres of water",
  nutrition: "Average / 10",
};

export function StatCard({
  kind,
  value,
  level,
  hint,
}: {
  kind: Kind;
  value: string;
  level: ImpactLevel;
  hint?: string;
}) {
  const Icon = ICONS[kind];
  const c = impactColorClass(level);

  return (
    <Card className={cn("border-2 transition-bounce hover:-translate-y-1 shadow-soft", c.border)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className={cn("rounded-2xl p-2.5", c.bg)}>
            <Icon className={cn("h-5 w-5", c.text)} />
          </div>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
              c.bg,
              c.text,
            )}
          >
            <span className={cn("h-2 w-2 rounded-full", c.dot)} />
            {impactLabel(level)}
          </span>
        </div>
        <div className="mt-4">
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
            {TITLES[kind]}
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold">{value}</span>
            <span className="text-xs text-muted-foreground">{SUBS[kind]}</span>
          </div>
          {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
        </div>
      </CardContent>
    </Card>
  );
}

export const _LeafIcon = Leaf;
