import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ALL_FOODS, overallImpact } from "@/lib/foodLogic";
import { Card, CardContent } from "@/components/ui/card";
import { TrafficLight } from "@/components/TrafficLight";
import { cn } from "@/lib/utils";

const GROUPS = [
  "All",
  "Grain",
  "Legume",
  "Vegetable",
  "Fruit",
  "Dairy",
  "Protein",
  "Mixed",
  "Beverage",
  "Sweet",
  "Condiment",
];

export default function SustainableMeals() {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("All");

  const filtered = useMemo(() => {
    return ALL_FOODS
      .filter((f) => (group === "All" ? true : f.food_group.includes(group)))
      .filter((f) => f.ingredient.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => a.ghg_kgco2e_per_serving - b.ghg_kgco2e_per_serving);
  }, [query, group]);

  return (
    <div className="container py-10">
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-secondary/15 text-secondary px-3 py-1 text-xs font-semibold">
          🌿 Sustainable Meals
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold mt-3">
          Discover greener tiffin choices
        </h1>
        <p className="mt-3 text-muted-foreground text-lg">
          Browse popular Indian school meals sorted from kindest to heaviest on the planet.
          Look for the <span className="font-semibold text-impact-low">green</span> badges!
        </p>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search idli, dal, paratha…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 rounded-full h-11 bg-card"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {GROUPS.map((g) => (
          <Button
            key={g}
            variant={group === g ? "default" : "outline"}
            size="sm"
            onClick={() => setGroup(g)}
            className={cn("rounded-full", group === g && "shadow-pop")}
          >
            {g}
          </Button>
        ))}
      </div>

      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((f) => {
          const impact = overallImpact(f);
          return (
            <Card
              key={f.id}
              className="border-2 transition-bounce hover:-translate-y-0.5 hover:shadow-pop"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-display text-lg font-semibold">{f.ingredient}</div>
                    <div className="text-xs text-muted-foreground">{f.food_group}</div>
                  </div>
                  <TrafficLight level={impact} size="sm" />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl bg-info-bg text-info p-2">
                    <div className="text-[10px] uppercase font-semibold tracking-wider opacity-80">Nutri</div>
                    <div className="font-bold">{f.nutrition_score}/10</div>
                  </div>
                  <div className="rounded-xl bg-impact-med-bg text-impact-med p-2">
                    <div className="text-[10px] uppercase font-semibold tracking-wider opacity-80">CO₂</div>
                    <div className="font-bold">{f.ghg_kgco2e_per_serving.toFixed(2)}</div>
                  </div>
                  <div className="rounded-xl bg-info-bg text-info p-2">
                    <div className="text-[10px] uppercase font-semibold tracking-wider opacity-80">Water</div>
                    <div className="font-bold">{f.water_use_L_per_serving}L</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          No meals found. Try a different search.
        </div>
      )}
    </div>
  );
}
