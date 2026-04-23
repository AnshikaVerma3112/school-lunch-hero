import foodData from "@/data/school_food.json";
import type { DietPreference, FoodItem, ImpactLevel } from "./types";

export const ALL_FOODS: FoodItem[] = foodData as FoodItem[];

// Items NOT allowed for each diet preference (by ingredient name keywords)
const NON_VEG_KEYWORDS = ["chicken", "fish", "egg"];
// Jain typically excludes onion, garlic, potato, root vegetables + non-veg
const JAIN_EXCLUDED = ["onion", "potato", "carrot", "beetroot", "chicken", "fish", "egg", "aloo"];
// Vegan excludes all dairy and non-veg
const DAIRY_KEYWORDS = ["milk", "curd", "paneer", "raita", "buttermilk", "lassi", "shrikhand", "chaas", "kadhi", "kheer"];

export function filterFoodsByDiet(foods: FoodItem[], diet?: DietPreference): FoodItem[] {
  if (!diet) return foods;
  return foods.filter((f) => {
    const name = f.ingredient.toLowerCase();
    if (diet === "Non-Veg") return true;
    if (diet === "Veg") {
      return !NON_VEG_KEYWORDS.some((k) => name.includes(k));
    }
    if (diet === "Jain") {
      return !JAIN_EXCLUDED.some((k) => name.includes(k));
    }
    if (diet === "Vegan") {
      const isNonVeg = NON_VEG_KEYWORDS.some((k) => name.includes(k));
      const isDairy = DAIRY_KEYWORDS.some((k) => name.includes(k)) || f.food_group.toLowerCase().includes("dairy");
      return !isNonVeg && !isDairy;
    }
    return true;
  });
}

// Per-item impact thresholds (kgCO2e per serving)
export function ghgImpact(ghg: number): ImpactLevel {
  if (ghg < 0.4) return "low";
  if (ghg < 1.0) return "med";
  return "high";
}

export function waterImpact(water: number): ImpactLevel {
  if (water < 200) return "low";
  if (water < 700) return "med";
  return "high";
}

export function nutritionLevel(score: number): ImpactLevel {
  if (score >= 8) return "low"; // "low" = good (green)
  if (score >= 5) return "med";
  return "high";
}

export function overallImpact(item: FoodItem): ImpactLevel {
  const g = ghgImpact(item.ghg_kgco2e_per_serving);
  const w = waterImpact(item.water_use_L_per_serving);
  // worst-of
  const order: ImpactLevel[] = ["low", "med", "high"];
  return order[Math.max(order.indexOf(g), order.indexOf(w))];
}

export function impactColorClass(level: ImpactLevel) {
  switch (level) {
    case "low":
      return { dot: "bg-impact-low", bg: "bg-impact-low-bg", text: "text-impact-low", border: "border-impact-low/40" };
    case "med":
      return { dot: "bg-impact-med", bg: "bg-impact-med-bg", text: "text-impact-med", border: "border-impact-med/40" };
    case "high":
      return { dot: "bg-impact-high", bg: "bg-impact-high-bg", text: "text-impact-high", border: "border-impact-high/40" };
  }
}

export function impactLabel(level: ImpactLevel) {
  return level === "low" ? "Low impact" : level === "med" ? "Medium impact" : "High impact";
}

// Weekly thresholds (across all selected items in the whole plan)
export function weeklyGhgImpact(total: number): ImpactLevel {
  if (total < 8) return "low";
  if (total < 20) return "med";
  return "high";
}
export function weeklyWaterImpact(total: number): ImpactLevel {
  if (total < 4000) return "low";
  if (total < 12000) return "med";
  return "high";
}
export function weeklyNutritionImpact(avg: number): ImpactLevel {
  if (avg >= 7.5) return "low";
  if (avg >= 5.5) return "med";
  return "high";
}

// Recommend a lower-impact alternative from the same food group, respecting diet
export function recommendAlternative(
  item: FoodItem,
  diet?: DietPreference,
): FoodItem | null {
  if (overallImpact(item) !== "high") return null;
  const candidates = filterFoodsByDiet(ALL_FOODS, diet)
    .filter(
      (f) =>
        f.id !== item.id &&
        f.food_group === item.food_group &&
        overallImpact(f) !== "high",
    )
    .sort((a, b) => {
      // Prefer lowest GHG, then lowest water, then highest nutrition
      const ag = a.ghg_kgco2e_per_serving + a.water_use_L_per_serving / 1000;
      const bg = b.ghg_kgco2e_per_serving + b.water_use_L_per_serving / 1000;
      if (ag !== bg) return ag - bg;
      return b.nutrition_score - a.nutrition_score;
    });
  return candidates[0] ?? null;
}

export function getFoodsByIds(ids: number[]): FoodItem[] {
  const map = new Map(ALL_FOODS.map((f) => [f.id, f] as const));
  return ids.map((id) => map.get(id)).filter((x): x is FoodItem => Boolean(x));
}
