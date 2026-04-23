import { Heart, Leaf, Sparkles, Target } from "lucide-react";
import kidsEating from "@/assets/kids-eating.jpg";
import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  return (
    <div>
      <section className="container py-12 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/30 text-foreground px-3 py-1 text-xs font-semibold">
            <Heart className="h-3.5 w-3.5 text-primary" /> About TiffinTracker
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mt-3">
            Helping Indian school kids eat <span className="text-secondary">smart</span> & <span className="text-primary">green</span>
          </h1>
          <p className="mt-4 text-muted-foreground text-lg">
            TiffinTracker is a fun, easy tool that helps students plan their school lunches and
            understand the impact of their food on the planet. Inspired by classroom sustainability
            programs around the world, we've made it just for Indian thalis and tiffins. 🍱
          </p>
        </div>
        <img
          src={kidsEating}
          alt="Indian school children happily eating a healthy lunch"
          loading="lazy"
          width={1024}
          height={768}
          className="rounded-3xl shadow-pop"
        />
      </section>

      <section className="container py-10">
        <h2 className="font-display text-3xl font-bold text-center">What we do</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          {[
            {
              icon: Target,
              title: "Educate",
              text: "Show students the carbon, water and nutrition behind every meal.",
            },
            {
              icon: Sparkles,
              title: "Empower",
              text: "Let kids plan their own week and try greener swaps without missing out.",
            },
            {
              icon: Leaf,
              title: "Encourage",
              text: "Celebrate small wins — every dal swap is a hug for the planet.",
            },
          ].map((s) => (
            <Card key={s.title} className="border-2 shadow-soft">
              <CardContent className="p-6">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-leaf-gradient shadow-leaf">
                  <s.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="mt-3 font-display text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container py-10">
        <Card className="border-2">
          <CardContent className="p-8 md:p-10">
            <h2 className="font-display text-2xl font-bold">How impact is calculated</h2>
            <p className="mt-2 text-muted-foreground">
              Each ingredient in our database has three values per serving:
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>🍎 <span className="font-semibold">Nutrition score</span> (out of 10) — higher is better.</li>
              <li>💨 <span className="font-semibold">CO₂e</span> in kilograms — lower means less climate impact.</li>
              <li>💧 <span className="font-semibold">Water use</span> in litres — lower means less water needed.</li>
            </ul>
            <p className="mt-4 text-muted-foreground">
              We add these up across your whole week and use a simple traffic-light system —
              <span className="text-impact-low font-semibold"> green</span> for low impact,
              <span className="text-impact-med font-semibold"> yellow</span> for medium, and
              <span className="text-impact-high font-semibold"> red</span> for high. When something
              is red, we suggest a kinder alternative from the same food group.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
