import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signInAdminDemo, getAdminDemoEmail } from "@/lib/adminDemoAuth";

const schema = z.object({
	email: z.string().trim().email("Please enter a valid email"),
	pin: z
		.string()
		.trim()
		.min(4, "PIN must be at least 4 digits")
		.max(12, "PIN must be at most 12 digits")
		.regex(/^\d+$/, "PIN must contain only digits"),
});

export default function AdminLoginPage() {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [pin, setPin] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const demoEmail = useMemo(() => getAdminDemoEmail(), []);

	const submit = () => {
		setError(null);

		const parsed = schema.safeParse({ email, pin });
		if (!parsed.success) {
			setError(parsed.error.issues[0]?.message ?? "Invalid input");
			return;
		}

		setLoading(true);
		const res = signInAdminDemo(parsed.data.email, parsed.data.pin);
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
					<p className="mt-1 text-sm text-ink-muted">Enter your credentials to continue.</p>

					<div className="mt-6 grid gap-3">
						<div className="grid gap-1.5">
							<label className="text-sm font-semibold">Email</label>
							<Input
								type="email"
								value={email}
								onChange={(e) => {
									setEmail(e.target.value);
									setError(null);
								}}
								placeholder="admin@example.com"
								className="h-12 text-base"
								onKeyDown={(e) => {
									if (e.key === "Enter") submit();
								}}
							/>
						</div>

						<div className="grid gap-1.5">
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
						</div>

						{error ? <div className="rounded-xl border bg-destructive/10 p-3 text-sm font-semibold text-destructive">{error}</div> : null}

						<Button className="mt-2 h-12 text-base font-extrabold" onClick={submit} disabled={loading}>
							{loading ? "Signing in…" : "Sign in"}
						</Button>

						<Button
							variant="outline"
							className="h-12"
							onClick={() => navigate("/")}
						>
							Back to Store
						</Button>
					</div>

					<div className="mt-6 rounded-xl border border-dashed border-muted-foreground/30 bg-muted/50 p-4 text-center">
						<p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Demo Credentials</p>
						<p className="mt-2 text-sm"><span className="font-medium text-muted-foreground">Email:</span> <span className="font-semibold">{demoEmail}</span></p>
						<p className="mt-1 text-sm"><span className="font-medium text-muted-foreground">PIN:</span> <span className="font-semibold">1234</span></p>
					</div>
				</section>
			</div>
		</main>
	);
}
