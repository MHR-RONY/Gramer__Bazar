import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signInAdminDemo } from "@/lib/adminDemoAuth";

const schema = z.object({
  pin: z
    .string()
    .trim()
    .min(4, "PIN must be at least 4 digits")
    .max(12, "PIN must be at most 12 digits")
    .regex(/^\d+$/, "PIN must contain only digits"),
});

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const hint = useMemo(() => "Default demo PIN: 1234", []);

  const submit = () => {
    setError(null);

    const parsed = schema.safeParse({ pin });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid PIN");
      return;
    }

    setLoading(true);
    const res = signInAdminDemo(parsed.data.pin);
    window.setTimeout(() => {
      setLoading(false);
      if (!res.ok) return setError(res.error ?? "Login failed");
      navigate("/admin?tab=overview", { replace: true });
    }, 250);
  };

  return (
    <main className="min-h-svh bg-background">
      <div className="container flex min-h-svh items-center justify-center py-10">
        <section className="w-full max-w-md rounded-2xl border bg-card p-6">
          <h1 className="text-2xl font-extrabold tracking-tight">Admin Login</h1>
          <p className="mt-1 text-sm text-ink-muted">Enter your PIN to continue.</p>

          <div className="mt-6 grid gap-2">
            <label className="text-sm font-semibold">PIN</label>
            <Input
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError(null);
              }}
              placeholder="••••"
              inputMode="numeric"
              maxLength={12}
              className="h-12 text-base"
              onKeyDown={(e) => {
                if (e.key === "Enter") submit();
              }}
            />
            <div className="text-xs text-ink-muted">{hint}</div>

            {error ? <div className="rounded-xl border bg-destructive/10 p-3 text-sm font-semibold text-destructive">{error}</div> : null}

            <Button className="mt-2 h-12 text-base font-extrabold" onClick={submit} disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </Button>

            <Button
              variant="outline"
              className="h-12"
              onClick={() => navigate("/admin/payments")}
            >
              Back to Payments
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
