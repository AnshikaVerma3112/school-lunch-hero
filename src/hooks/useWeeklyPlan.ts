import { useCallback, useEffect, useState } from "react";
import type { DayKey, WeeklyPlan } from "@/lib/types";

const KEY = "slsa_weekly_plan";
const DAYS: DayKey[] = ["Mon", "Tue", "Wed", "Thu", "Fri"];

const empty = (): WeeklyPlan =>
  DAYS.reduce((acc, d) => {
    acc[d] = [];
    return acc;
  }, {} as WeeklyPlan);

export function useWeeklyPlan() {
  const [plan, setPlan] = useState<WeeklyPlan>(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return empty();
      const parsed = JSON.parse(raw);
      // backfill missing days
      return { ...empty(), ...parsed };
    } catch {
      return empty();
    }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(plan));
  }, [plan]);

  const toggle = useCallback((day: DayKey, id: number) => {
    setPlan((p) => {
      const cur = p[day];
      const has = cur.includes(id);
      return { ...p, [day]: has ? cur.filter((x) => x !== id) : [...cur, id] };
    });
  }, []);

  const replace = useCallback((day: DayKey, oldId: number, newId: number) => {
    setPlan((p) => {
      const cur = p[day];
      if (!cur.includes(oldId)) return p;
      const next = cur.filter((x) => x !== oldId);
      if (!next.includes(newId)) next.push(newId);
      return { ...p, [day]: next };
    });
  }, []);

  const clearDay = useCallback((day: DayKey) => {
    setPlan((p) => ({ ...p, [day]: [] }));
  }, []);

  const clearAll = useCallback(() => setPlan(empty()), []);

  return { plan, toggle, replace, clearDay, clearAll, days: DAYS };
}
