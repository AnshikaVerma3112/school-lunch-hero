import { useCallback, useEffect, useState } from "react";
import { getCurrentUser, login as authLogin, logout as authLogout, signup as authSignup, updateCurrentUser } from "@/lib/auth";
import type { UserProfile } from "@/lib/types";

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(() => getCurrentUser());

  useEffect(() => {
    const onStorage = () => setUser(getCurrentUser());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = useCallback((email: string, password: string) => {
    const u = authLogin(email, password);
    setUser(u);
    return u;
  }, []);

  const signup = useCallback((name: string, email: string, password: string) => {
    const u = authSignup(name, email, password);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(() => {
    authLogout();
    setUser(null);
  }, []);

  const update = useCallback((patch: Partial<UserProfile>) => {
    const u = updateCurrentUser(patch);
    if (u) setUser(u);
  }, []);

  return { user, login, signup, logout, update };
}
