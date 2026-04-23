import type { UserProfile } from "./types";

const KEY = "slsa_user";
const USERS_KEY = "slsa_users";

type StoredUser = UserProfile & { password: string };

function readUsers(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}
function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function signup(name: string, email: string, password: string): UserProfile {
  const users = readUsers();
  if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error("An account with this email already exists.");
  }
  const user: StoredUser = { name, email, password };
  users.push(user);
  writeUsers(users);
  const profile: UserProfile = { name, email };
  localStorage.setItem(KEY, JSON.stringify(profile));
  return profile;
}

export function login(email: string, password: string): UserProfile {
  const users = readUsers();
  const u = users.find(
    (x) => x.email.toLowerCase() === email.toLowerCase() && x.password === password,
  );
  if (!u) throw new Error("Invalid email or password.");
  const profile: UserProfile = { name: u.name, email: u.email, age: u.age, diet: u.diet };
  localStorage.setItem(KEY, JSON.stringify(profile));
  return profile;
}

export function logout() {
  localStorage.removeItem(KEY);
}

export function getCurrentUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function updateCurrentUser(patch: Partial<UserProfile>) {
  const cur = getCurrentUser();
  if (!cur) return null;
  const updated = { ...cur, ...patch };
  localStorage.setItem(KEY, JSON.stringify(updated));
  // also update users db
  const users = readUsers();
  const idx = users.findIndex((u) => u.email.toLowerCase() === cur.email.toLowerCase());
  if (idx >= 0) {
    users[idx] = { ...users[idx], ...patch };
    writeUsers(users);
  }
  return updated;
}
