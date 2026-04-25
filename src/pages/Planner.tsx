import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Search, Trash2, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useWeeklyPlan } from "@/hooks/useWeeklyPlan";
import {
  ALL_FOODS,
  filterFoodsByDiet,
  getFoodsByIds,
  weeklyGhgImpact,
  weeklyNutritionImpact,
  weeklyWaterImpact,
} from "@/lib/foodLogic";
import type { DietPreference, DayKey } from "@/lib/types";
import { FoodCard } from "@/components/FoodCard";
import { StatCard } from "@/components/StatCard";
import { MealPhotoUploader } from "@/components/MealPhotoUploader";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const DAY_FULL: Record<DayKey, string> = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
};

export default function Planner() {
  const { user, update } = useAuth();
  const { plan, photos, toggle, replace, clearDay, setDayPhoto, days } = useWeeklyPlan();

  // Profile setup form (age + diet) — required before planning
  const [age, setAge] = useState<string>(user?.age ? String(user.age) : "");
  const [diet, setDiet] = useState<DietPreference | "">(user?.diet ?? "");
  const [profileSaved, setProfileSaved] = useState<boolean>(Boolean(user?.age && user?.diet));

  useEffect(() => {
    setAge(user?.age ? String(user.age) : "");
    setDiet(user?.diet ?? "");
    setProfileSaved(Boolean(user?.age && user?.diet));
  }, [user?.age, user?.diet]);

  const [activeDay, setActiveDay] = useState<DayKey>("Mon");
  const [query, setQuery] = useState("");

  const allowedFoods = useMemo(
    () => filterFoodsByDiet(ALL_FOODS, (diet || undefined) as DietPreference | undefined),
    [diet],
  );
  const filtered = useMemo(
    () =>
      allowedFoods.filter((f) =>
        f.ingredient.toLowerCase().includes(query.toLowerCase()),
      ),
    [allowedFoods, query],
  );

  const totals = useMemo(() => {
    const all = days.flatMap((d) => getFoodsByIds(plan[d]));
    const ghg = all.reduce((s, f) => s + f.ghg_kgco2e_per_serving, 0);
    const water = all.reduce((s, f) => s + f.water_use_L_per_serving, 0);
    const avg = all.length ? all.reduce((s, f) => s + f.nutrition_score, 0) / all.length : 0;
    return { ghg, water, avg, count: all.length };
  }, [plan, days]);

  function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    const ageNum = Number(age);
    if (!ageNum || ageNum < 4 || ageNum > 19) {
      toast.error("Please enter an age between 4 and 19.");
      return;
    }
    if (!diet) {
      toast.error("Pick a dietary preference.");
      return;
    }
    if (user) update({ age: ageNum, diet: diet as DietPreference });
    setProfileSaved(true);
    toast.success("Saved! Let's build your week 🍱");
  }

  // Not logged in -> gentle prompt
  if (!user) {
    return (
      <div className="container py-12 max-w-xl">
        <Card className="border-2 shadow-pop">
          <CardContent className="p-8 text-center">
            <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-warm-gradient shadow-pop">
              <CalendarDays className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="font-display text-3xl font-bold mt-4">Plan your week</h1>
            <p className="text-muted-foreground mt-2">
              Log in or sign up to start planning your school tiffin and track your impact.
            </p>
            <div className="mt-5 flex gap-3 justify-center">
              <Button asChild className="rounded-full shadow-pop">
                <Link to="/signup">Create account</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full">
                <Link to="/login">Login</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Profile not saved -> show setup form
  if (!profileSaved) {
    return (
      <div className="container py-12 max-w-xl">
        <Card className="border-2 shadow-pop">
          <CardContent className="p-8">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-leaf-gradient shadow-leaf">
              <UserCog className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="font-display text-3xl font-bold mt-4">Tell us about you</h1>
            <p className="text-muted-foreground text-sm mt-1">
              We'll suggest meals that match your diet and age group.
            </p>

            <form onSubmit={saveProfile} className="mt-6 space-y-4">
              <div>
                <Label htmlFor="age">Your age</Label>
                <Input
                  id="age"
                  type="number"
                  min={4}
                  max={19}
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                  className="rounded-xl mt-1"
                  placeholder="e.g. 12"
                />
              </div>
              <div>
                <Label>Dietary preference</Label>
                <Select value={diet} onValueChange={(v) => setDiet(v as DietPreference)}>
                  <SelectTrigger className="rounded-xl mt-1">
                    <SelectValue placeholder="Choose your diet" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Veg">🥗 Vegetarian</SelectItem>
                    <SelectItem value="Non-Veg">🍗 Non-Vegetarian</SelectItem>
                    <SelectItem value="Jain">🪷 Jain</SelectItem>
                    <SelectItem value="Vegan">🌱 Vegan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full rounded-full shadow-pop">
                Continue to planner →
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Header & profile chips */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/30 px-3 py-1 text-xs font-semibold">
            🍱 Weekly Planner
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold mt-2">
            Hi {user.name}, build your week
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Age {user.age} · {user.diet} · We're filtering meals to match your diet.
          </p>
        </div>
        <Button
          asChild
          variant="outline"
          className="rounded-full self-start"
        >
          <Link to="/profile">
            <UserCog className="h-4 w-4 mr-1" /> Edit profile
          </Link>
        </Button>
      </div>

      {/* Live totals */}
      <div className="mt-6 grid sm:grid-cols-3 gap-4">
        <StatCard
          kind="nutrition"
          value={totals.count ? totals.avg.toFixed(1) : "—"}
          level={weeklyNutritionImpact(totals.avg)}
          hint={`${totals.count} items in your week`}
        />
        <StatCard
          kind="ghg"
          value={totals.ghg.toFixed(2)}
          level={weeklyGhgImpact(totals.ghg)}
          hint="Lower is better for the planet"
        />
        <StatCard
          kind="water"
          value={`${totals.water.toLocaleString()} L`}
          level={weeklyWaterImpact(totals.water)}
          hint="Total water needed"
        />
      </div>

      {/* Day tabs */}
      <Tabs value={activeDay} onValueChange={(v) => setActiveDay(v as DayKey)} className="mt-8">
        <TabsList className="rounded-full p-1 h-auto bg-muted flex-wrap">
          {days.map((d) => {
            const count = plan[d].length;
            return (
              <TabsTrigger
                key={d}
                value={d}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-pop",
                )}
              >
                {DAY_FULL[d]}
                {count > 0 && (
                  <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-background/30 px-1.5 text-[10px] font-bold">
                    {count}
                  </span>
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {days.map((d) => (
          <TabsContent key={d} value={d} className="mt-6">
            <DayPanel
              day={d}
              query={query}
              setQuery={setQuery}
              selectedIds={plan[d]}
              photoUrl={photos[d]}
              onPhotoChange={(url) => setDayPhoto(d, url)}
              filteredFoods={filtered}
              onToggle={(id) => toggle(d, id)}
              onSwap={(oldId, newId) => {
                replace(d, oldId, newId);
                toast.success("Swapped! Greener choice added 🌿");
              }}
              onClear={() => clearDay(d)}
              diet={user.diet}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function DayPanel({
  day,
  query,
  setQuery,
  selectedIds,
  filteredFoods,
  onToggle,
  onSwap,
  onClear,
  diet,
}: {
  day: DayKey;
  query: string;
  setQuery: (q: string) => void;
  selectedIds: number[];
  filteredFoods: typeof ALL_FOODS;
  onToggle: (id: number) => void;
  onSwap: (oldId: number, newId: number) => void;
  onClear: () => void;
  diet?: DietPreference;
}) {
  const selected = getFoodsByIds(selectedIds);
  const ghg = selected.reduce((s, f) => s + f.ghg_kgco2e_per_serving, 0);
  const water = selected.reduce((s, f) => s + f.water_use_L_per_serving, 0);
  const avg = selected.length ? selected.reduce((s, f) => s + f.nutrition_score, 0) / selected.length : 0;

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-6">
      {/* Left: meal grid */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search meals…"
              className="pl-9 rounded-full bg-card h-10"
            />
          </div>
          {selectedIds.length > 0 && (
            <Button variant="ghost" size="sm" onClick={onClear} className="rounded-full text-destructive">
              <Trash2 className="h-4 w-4 mr-1" /> Clear day
            </Button>
          )}
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {filteredFoods.map((f) => (
            <FoodCard
              key={f.id}
              item={f}
              selected={selectedIds.includes(f.id)}
              onToggle={() => onToggle(f.id)}
              onSwap={(alt) => onSwap(f.id, alt.id)}
              diet={diet}
            />
          ))}
        </div>

        {filteredFoods.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No meals match. Try a different search.
          </div>
        )}
      </div>

      {/* Right: day summary sticky */}
      <aside className="lg:sticky lg:top-20 h-fit">
        <Card className="border-2 shadow-soft">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-bold">{DAY_FULL[day]}'s tiffin</h3>
              <span className="text-xs text-muted-foreground">{selected.length} item{selected.length !== 1 ? "s" : ""}</span>
            </div>

            <div className="mt-4 space-y-2">
              {selected.length === 0 && (
                <p className="text-sm text-muted-foreground py-6 text-center">
                  Tap any meal to add it to {DAY_FULL[day]}.
                </p>
              )}
              {selected.map((f) => (
                <div
                  key={f.id}
                  className="flex items-center justify-between gap-2 rounded-xl bg-muted/60 px-3 py-2"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-semibold truncate">{f.ingredient}</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      {f.food_group}
                    </div>
                  </div>
                  <button
                    onClick={() => onToggle(f.id)}
                    className="text-xs rounded-full bg-card px-2 py-1 text-destructive hover:bg-destructive/10"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2 text-center">
              <Mini label="Nutri" value={selected.length ? avg.toFixed(1) : "—"} tone="info" />
              <Mini label="CO₂" value={ghg.toFixed(2)} tone={ghg < 1.5 ? "low" : ghg < 4 ? "med" : "high"} />
              <Mini label="Water" value={`${water}L`} tone={water < 800 ? "low" : water < 2400 ? "med" : "high"} />
            </div>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}

function Mini({ label, value, tone }: { label: string; value: string; tone: "low" | "med" | "high" | "info" }) {
  const cls =
    tone === "info"
      ? "bg-info-bg text-info"
      : tone === "low"
      ? "bg-impact-low-bg text-impact-low"
      : tone === "med"
      ? "bg-impact-med-bg text-impact-med"
      : "bg-impact-high-bg text-impact-high";
  return (
    <div className={cn("rounded-xl py-2", cls)}>
      <div className="text-[10px] uppercase font-semibold tracking-wider opacity-80">{label}</div>
      <div className="text-sm font-bold">{value}</div>
    </div>
  );
}
