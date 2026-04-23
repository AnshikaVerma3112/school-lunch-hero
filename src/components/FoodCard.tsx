import { Check, Plus, Sparkles } from "lucide-react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TrafficLight } from "./TrafficLight";
import {
  ghgImpact,
  overallImpact,
  recommendAlternative,
  waterImpact,
} from "@/lib/foodLogic";
import type { DietPreference, FoodItem } from "@/lib/types";
import { cn } from "@/lib/utils";

export function FoodCard({
  item,
  selected,
  onToggle,
  onSwap,
  diet,
  showSwap = true,
}: {
  item: FoodItem;
  selected: boolean;
  onToggle: () => void;
  onSwap?: (alt: FoodItem) => void;
  diet?: DietPreference;
  showSwap?: boolean;
}) {
  const impact = overallImpact(item);
  const alt = useMemo(
    () => (selected && showSwap ? recommendAlternative(item, diet) : null),
    [item, diet, selected, showSwap],
  );

  return (
    <Card
      className={cn(
        "p-4 transition-bounce hover:-translate-y-0.5 hover:shadow-pop border-2",
        selected ? "border-primary bg-primary/5" : "border-border",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-display font-semibold leading-tight">{item.ingredient}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{item.food_group}</div>
        </div>
        <TrafficLight level={impact} size="sm" />
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <Stat label="Nutri" value={`${item.nutrition_score}/10`} tone="info" />
        <Stat
          label="CO₂"
          value={`${item.ghg_kgco2e_per_serving.toFixed(2)}`}
          tone={ghgImpact(item.ghg_kgco2e_per_serving)}
        />
        <Stat
          label="Water"
          value={`${item.water_use_L_per_serving}L`}
          tone={waterImpact(item.water_use_L_per_serving)}
        />
      </div>

      <Button
        variant={selected ? "secondary" : "default"}
        size="sm"
        className="w-full mt-3 rounded-full"
        onClick={onToggle}
      >
        {selected ? (
          <>
            <Check className="h-4 w-4 mr-1" /> Added to plan
          </>
        ) : (
          <>
            <Plus className="h-4 w-4 mr-1" /> Add to plan
          </>
        )}
      </Button>

      {alt && onSwap && (
        <div className="mt-3 rounded-xl bg-impact-low-bg/60 border border-impact-low/30 p-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-impact-low">
            <Sparkles className="h-3.5 w-3.5" />
            Greener swap
          </div>
          <div className="mt-1 text-sm">
            Try <span className="font-semibold">{alt.ingredient}</span> — saves{" "}
            <span className="font-semibold">
              {(item.ghg_kgco2e_per_serving - alt.ghg_kgco2e_per_serving).toFixed(2)} kg CO₂e
            </span>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="mt-2 w-full rounded-full bg-card"
            onClick={() => onSwap(alt)}
          >
            Swap it
          </Button>
        </div>
      )}
    </Card>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "low" | "med" | "high" | "info";
}) {
  const cls =
    tone === "info"
      ? "bg-info-bg text-info"
      : tone === "low"
      ? "bg-impact-low-bg text-impact-low"
      : tone === "med"
      ? "bg-impact-med-bg text-impact-med"
      : "bg-impact-high-bg text-impact-high";
  return (
    <div className={cn("rounded-xl py-1.5", cls)}>
      <div className="text-[10px] font-semibold uppercase tracking-wider opacity-80">{label}</div>
      <div className="text-sm font-bold">{value}</div>
    </div>
  );
}
