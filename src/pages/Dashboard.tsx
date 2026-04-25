import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Droplet, Leaf, Sparkles, Wind } from "lucide-react";
import heroTiffin from "@/assets/hero-tiffin.jpg";
import sustain from "@/assets/sustainability.jpg";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useWeeklyPlan } from "@/hooks/useWeeklyPlan";
import { getFoodsByIds, weeklyGhgImpact, weeklyNutritionImpact, weeklyWaterImpact } from "@/lib/foodLogic";
import { StatCard } from "@/components/StatCard";
import { useMemo } from "react";

export default function Dashboard() {
  const { plan, days } = useWeeklyPlan();
  const navigate = useNavigate();

  const totals = useMemo(() => {
    const all = days.flatMap((d) => getFoodsByIds(plan[d]));
    const ghg = all.reduce((s, f) => s + f.ghg_kgco2e_per_serving, 0);
    const water = all.reduce((s, f) => s + f.water_use_L_per_serving, 0);
    const avg = all.length ? all.reduce((s, f) => s + f.nutrition_score, 0) / all.length : 0;
    return { ghg, water, avg, count: all.length };
  }, [plan, days]);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient opacity-10" aria-hidden />
        <div className="container py-12 md:py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-secondary/15 text-secondary px-3 py-1 text-xs font-semibold">
              <Leaf className="h-3.5 w-3.5" /> School Lunch Sustainability Auditor
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight mt-4">
              Eat <span className="text-primary">tasty</span>, live{" "}
              <span className="text-secondary">green</span> 🌱
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl">
              Plan your school tiffin for the week and see how your meals affect the planet.
              Get smart, kid-friendly swaps to save water and lower CO₂ — without giving up taste!
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                size="lg"
                className="rounded-full shadow-pop"
                onClick={() => navigate("/planner")}
              >
                Start planning <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full"
                onClick={() => navigate("/sustainable-meals")}
              >
                Browse meals
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-warm-gradient rounded-[2.5rem] blur-2xl opacity-30" aria-hidden />
            <img
              src={heroTiffin}
              alt="Colorful Indian school lunch tiffin with rice, dal, sabzi and fruit"
              width={1280}
              height={896}
              className="relative rounded-[2rem] shadow-pop animate-float"
            />
          </div>
        </div>
      </section>

      {/* Live totals */}
      <section className="container py-10">
        <div className="flex items-end justify-between gap-4 mb-5">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold">Your week so far</h2>
            <p className="text-muted-foreground text-sm">
              {totals.count > 0
                ? `${totals.count} items planned across the week.`
                : "No meals planned yet — head to the planner to start!"}
            </p>
          </div>
          <Button asChild variant="ghost" className="rounded-full hidden sm:inline-flex">
            <Link to="/planner">Open planner →</Link>
          </Button>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <StatCard
            kind="nutrition"
            value={totals.count ? totals.avg.toFixed(1) : "—"}
            level={weeklyNutritionImpact(totals.avg)}
            hint={totals.count ? "Average nutrition of your meals" : "Add meals to see scores"}
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
            hint="Total water needed for the week"
          />
        </div>
      </section>

      {/* How it works */}
      <section className="container py-10">
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              icon: Sparkles,
              title: "Pick your meals",
              text: "Choose Indian favourites for each school day, from idli to rajma chawal.",
              color: "bg-warm-gradient",
            },
            {
              icon: Wind,
              title: "See the impact",
              text: "We instantly calculate carbon, water and nutrition for your tiffin.",
              color: "bg-leaf-gradient",
            },
            {
              icon: Droplet,
              title: "Get smart swaps",
              text: "If something is high impact, we suggest a tasty greener alternative.",
              color: "bg-warm-gradient",
            },
          ].map((s) => (
            <Card key={s.title} className="border-2 border-border shadow-soft transition-bounce hover:-translate-y-1">
              <CardContent className="p-6">
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${s.color} shadow-pop`}>
                  <s.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Why */}
      <section className="container py-10">
        <Card className="overflow-hidden border-2 border-border">
          <div className="grid md:grid-cols-2">
            <div className="p-8 md:p-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-secondary/15 text-secondary px-3 py-1 text-xs font-semibold">
                Why it matters
              </div>
              <h2 className="font-display text-3xl font-bold mt-3">
                Small choices, big impact 🌍
              </h2>
              <p className="mt-3 text-muted-foreground">
                What we eat shapes our planet. Choosing more dals, seasonal veggies and millets,
                and going easy on paneer or meat helps save water and reduce greenhouse gases —
                while keeping your tiffin yummy and nourishing.
              </p>
              <Button asChild className="mt-5 rounded-full shadow-pop">
                <Link to="/about">Learn more</Link>
              </Button>
            </div>
            <div className="bg-muted/40 flex items-center justify-center p-6">
              <img
                src={sustain}
                alt="Earth with a green leaf and water droplets, symbolizing sustainability"
                loading="lazy"
                width={1024}
                height={768}
                className="rounded-2xl max-h-72 object-contain"
              />
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
