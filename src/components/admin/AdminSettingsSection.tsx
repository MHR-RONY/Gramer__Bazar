import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { signOutAdminDemo, setAdminDemoPin } from "@/lib/adminDemoAuth";

const SETTINGS_KEY = "gb_admin_settings_v1";

type AdminSettings = {
	email: string;
	password: string;
	name: string;
	phone: string;
	notifications: {
		orderUpdates: boolean;
		paymentAlerts: boolean;
		marketing: boolean;
	};
	theme: "light" | "dark" | "system";
};

const defaultSettings: AdminSettings = {
	email: "admin@gramerbazar.demo",
	password: "",
	name: "Admin",
	phone: "",
	notifications: {
		orderUpdates: true,
		paymentAlerts: true,
		marketing: false,
	},
	theme: "system",
};

function readSettings(): AdminSettings {
	try {
		const raw = localStorage.getItem(SETTINGS_KEY);
		if (!raw) return defaultSettings;
		const parsed = JSON.parse(raw) as Partial<AdminSettings>;
		return {
			...defaultSettings,
			...parsed,
			notifications: { ...defaultSettings.notifications, ...(parsed.notifications ?? {}) },
		};
	} catch {
		return defaultSettings;
	}
}

function writeSettings(next: AdminSettings) {
	try {
		localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
	} catch {
		// ignore
	}
}

function SectionCard({
	title,
	description,
	children,
}: {
	title: string;
	description?: string;
	children: React.ReactNode;
}) {
	return (
		<section className="rounded-2xl border bg-card p-5">
			<div className="flex flex-col gap-1">
				<h2 className="text-base font-extrabold tracking-tight">{title}</h2>
				{description ? <p className="text-sm text-ink-muted">{description}</p> : null}
			</div>
			<Separator className="my-4" />
			{children}
		</section>
	);
}

export function AdminSettingsSection() {
	const [settings, setSettings] = useState<AdminSettings>(() => readSettings());
	const [saving, setSaving] = useState(false);
	const [pinDraft, setPinDraft] = useState("");
	const [pinError, setPinError] = useState<string | null>(null);

	const hasUnsaved = useMemo(() => {
		const current = readSettings();
		return JSON.stringify(current) !== JSON.stringify(settings);
	}, [settings]);

	const save = () => {
		setSaving(true);
		writeSettings(settings);
		window.setTimeout(() => setSaving(false), 250);
	};

	return (
		<main className="space-y-6">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<h1 className="text-2xl font-extrabold tracking-tight">Settings</h1>
					<p className="mt-1 text-base text-ink-muted">Demo settings stored in your browser (localStorage).</p>
				</div>

				<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
					<Button
						variant="outline"
						size="lg"
						onClick={() => setSettings(readSettings())}
						disabled={saving}
					>
						Reset
					</Button>
					<Button size="lg" onClick={save} disabled={saving || !hasUnsaved}>
						{saving ? "Saving…" : "Save changes"}
					</Button>
				</div>
			</div>

			<SectionCard title="Account" description="Email/password fields are demo-only here.">
				<div className="grid gap-4 sm:grid-cols-2">
					<div className="grid gap-2">
						<label className="text-sm font-semibold">Email</label>
						<Input
							value={settings.email}
							onChange={(e) => setSettings((p) => ({ ...p, email: e.target.value }))}
							placeholder="admin@store.com"
							inputMode="email"
							maxLength={255}
							className="h-11 text-base"
						/>
					</div>

					<div className="grid gap-2">
						<label className="text-sm font-semibold">New password</label>
						<Input
							value={settings.password}
							onChange={(e) => setSettings((p) => ({ ...p, password: e.target.value }))}
							placeholder="••••••••"
							type="password"
							maxLength={128}
							className="h-11 text-base"
						/>
						<div className="text-xs text-ink-muted">Tip: leave empty if you don't want to change it.</div>
					</div>
				</div>

				<Separator className="my-4" />

				<div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
					<div className="grid gap-2">
						<label className="text-sm font-semibold">Admin PIN (demo login)</label>
						<Input
							value={pinDraft}
							onChange={(e) => {
								setPinDraft(e.target.value);
								setPinError(null);
							}}
							placeholder="Set a new PIN (digits only)"
							inputMode="numeric"
							maxLength={12}
							className="h-11 text-base"
						/>
						{pinError ? <div className="text-xs font-semibold text-destructive">{pinError}</div> : null}
					</div>
					<Button
						size="lg"
						variant="outline"
						onClick={() => {
							const res = setAdminDemoPin(pinDraft);
							if (!res.ok) return setPinError(res.error ?? "Invalid PIN");
							setPinDraft("");
						}}
					>
						Update PIN
					</Button>
				</div>

				<div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
					<Button
						type="button"
						variant="destructive"
						onClick={() => {
							const ok = window.confirm("Sign out of admin demo session?");
							if (!ok) return;
							signOutAdminDemo();
							window.location.href = "/admin/login";
						}}
					>
						Sign out
					</Button>
				</div>
			</SectionCard>

			<SectionCard title="Profile" description="Basic admin profile info for display purposes.">
				<div className="grid gap-4 sm:grid-cols-2">
					<div className="grid gap-2">
						<label className="text-sm font-semibold">Name</label>
						<Input
							value={settings.name}
							onChange={(e) => setSettings((p) => ({ ...p, name: e.target.value }))}
							placeholder="Admin name"
							maxLength={80}
							className="h-11 text-base"
						/>
					</div>
					<div className="grid gap-2">
						<label className="text-sm font-semibold">Phone</label>
						<Input
							value={settings.phone}
							onChange={(e) => setSettings((p) => ({ ...p, phone: e.target.value }))}
							placeholder="e.g. 01XXXXXXXXX"
							inputMode="tel"
							maxLength={20}
							className="h-11 text-base"
						/>
					</div>
				</div>
			</SectionCard>

			<SectionCard title="Notifications" description="Choose what you want to be alerted about.">
				<div className="grid gap-3">
					<label className="flex items-center justify-between gap-4 rounded-xl border bg-background p-4">
						<div>
							<div className="text-sm font-extrabold">Order updates</div>
							<div className="text-xs text-ink-muted">New orders and status changes.</div>
						</div>
						<Switch
							checked={settings.notifications.orderUpdates}
							onCheckedChange={(v) =>
								setSettings((p) => ({
									...p,
									notifications: { ...p.notifications, orderUpdates: v },
								}))
							}
						/>
					</label>

					<label className="flex items-center justify-between gap-4 rounded-xl border bg-background p-4">
						<div>
							<div className="text-sm font-extrabold">Payment alerts</div>
							<div className="text-xs text-ink-muted">Pending payments that need review.</div>
						</div>
						<Switch
							checked={settings.notifications.paymentAlerts}
							onCheckedChange={(v) =>
								setSettings((p) => ({
									...p,
									notifications: { ...p.notifications, paymentAlerts: v },
								}))
							}
						/>
					</label>

					<label className="flex items-center justify-between gap-4 rounded-xl border bg-background p-4">
						<div>
							<div className="text-sm font-extrabold">Marketing</div>
							<div className="text-xs text-ink-muted">Product updates and promotional reminders.</div>
						</div>
						<Switch
							checked={settings.notifications.marketing}
							onCheckedChange={(v) =>
								setSettings((p) => ({
									...p,
									notifications: { ...p.notifications, marketing: v },
								}))
							}
						/>
					</label>
				</div>
			</SectionCard>

			<SectionCard title="Theme" description="This is a demo preference saved in settings.">
				<div className="grid gap-3 sm:grid-cols-3">
					{(["system", "light", "dark"] as const).map((opt) => (
						<button
							key={opt}
							type="button"
							onClick={() => setSettings((p) => ({ ...p, theme: opt }))}
							aria-pressed={settings.theme === opt}
							className={cn(
								"rounded-xl border bg-background p-4 text-left transition-colors hover:bg-accent",
								settings.theme === opt ? "border-primary" : "border-border",
							)}
						>
							<div className="text-sm font-extrabold capitalize">{opt}</div>
							<div className="mt-1 text-xs text-ink-muted">
								{opt === "system" ? "Follow device setting" : opt === "light" ? "Always light" : "Always dark"}
							</div>
						</button>
					))}
				</div>
			</SectionCard>
		</main>
	);
}
