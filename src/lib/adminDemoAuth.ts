import { z } from "zod";

const AUTH_KEY = "gb_admin_demo_authed_v1";
const PIN_KEY = "gb_admin_demo_pin_v1";

const pinSchema = z
  .string()
  .trim()
  .min(4, "PIN must be at least 4 digits")
  .max(12, "PIN must be at most 12 digits")
  .regex(/^\d+$/, "PIN must contain only digits");

export function getAdminDemoPin(): string {
  try {
    const raw = localStorage.getItem(PIN_KEY);
    const parsed = pinSchema.safeParse(raw ?? "");
    if (parsed.success) return parsed.data;
  } catch {
    // ignore
  }
  return "1234";
}

export function setAdminDemoPin(nextPin: string): { ok: boolean; error?: string } {
  const parsed = pinSchema.safeParse(nextPin);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid PIN" };

  try {
    localStorage.setItem(PIN_KEY, parsed.data);
  } catch {
    // ignore
  }
  return { ok: true };
}

export function isAdminDemoAuthed(): boolean {
  try {
    return localStorage.getItem(AUTH_KEY) === "1";
  } catch {
    return false;
  }
}

export function signInAdminDemo(pin: string): { ok: boolean; error?: string } {
  const parsed = pinSchema.safeParse(pin);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid PIN" };

  const expected = getAdminDemoPin();
  if (parsed.data !== expected) return { ok: false, error: "Incorrect PIN" };

  try {
    localStorage.setItem(AUTH_KEY, "1");
  } catch {
    // ignore
  }

  return { ok: true };
}

export function signOutAdminDemo() {
  try {
    localStorage.removeItem(AUTH_KEY);
  } catch {
    // ignore
  }
}
