import { useCallback, useEffect, useState } from "react";
import type { DayKey, WeeklyPlan } from "@/lib/types";

const KEY = "slsa_weekly_plan";
const PHOTOS_KEY = "slsa_weekly_photos";
const DAYS: DayKey[] = ["Mon", "Tue", "Wed", "Thu", "Fri"];

const empty = (): WeeklyPlan =>
  DAYS.reduce((acc, d) => {
    acc[d] = [];
    return acc;
  }, {} as WeeklyPlan);

const emptyPhotos = (): Record<DayKey, string | null> =>
  DAYS.reduce((acc, d) => {
    acc[d] = null;
    return acc;
  }, {} as Record<DayKey, string | null>);

export function useWeeklyPlan() {
  const [plan, setPlan] = useState<WeeklyPlan>(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return empty();
      const parsed = JSON.parse(raw);
      return { ...empty(), ...parsed };
    } catch {
      return empty();
    }
  });

  const [photos, setPhotos] = useState<Record<DayKey, string | null>>(() => {
    try {
      const raw = localStorage.getItem(PHOTOS_KEY);
      if (!raw) return emptyPhotos();
      return { ...emptyPhotos(), ...JSON.parse(raw) };
    } catch {
      return emptyPhotos();
    }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(plan));
  }, [plan]);

  useEffect(() => {
    try {
      localStorage.setItem(PHOTOS_KEY, JSON.stringify(photos));
    } catch {
      // localStorage may overflow with large data URLs — fall back silently
    }
  }, [photos]);

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
    setPhotos((ph) => ({ ...ph, [day]: null }));
  }, []);

  const clearAll = useCallback(() => {
    setPlan(empty());
    setPhotos(emptyPhotos());
  }, []);

  const setDayPhoto = useCallback((day: DayKey, url: string | null) => {
    setPhotos((ph) => ({ ...ph, [day]: url }));
  }, []);

  return { plan, photos, toggle, replace, clearDay, clearAll, setDayPhoto, days: DAYS };
}
