export type FoodItem = {
  id: number;
  ingredient: string;
  food_group: string;
  nutrition_score: number;
  ghg_kgco2e_per_serving: number;
  water_use_L_per_serving: number;
};

export type DietPreference = "Veg" | "Non-Veg" | "Jain" | "Vegan";

export type ImpactLevel = "low" | "med" | "high";

export type DayKey = "Mon" | "Tue" | "Wed" | "Thu" | "Fri";

export type WeeklyPlan = Record<DayKey, number[]>; // day -> selected food ids

export type UserProfile = {
  email: string;
  name: string;
  age?: number;
  diet?: DietPreference;
};
