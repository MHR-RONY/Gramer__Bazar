import { useState } from "react";
import { StoreHeader } from "@/components/storefront/StoreHeader";
import { StoreFooter } from "@/components/storefront/StoreFooter";
import {
	User,
	ShoppingBag,
	MapPin,
	CreditCard,
	Settings,
	LogOut,
	Pencil,
	Plus,
	Package,
	Truck,
	CheckCircle2,
	Clock,
	Bell,
	Moon,
	Globe,
	Shield,
} from "lucide-react";

/* ── Tabs ── */
const tabs = ["profile", "orders", "addresses", "payment", "settings"] as const;
type Tab = (typeof tabs)[number];

const tabIcons: Record<Tab, React.ReactNode> = {
	profile: <User className="h-4 w-4" />,
	orders: <ShoppingBag className="h-4 w-4" />,
	addresses: <MapPin className="h-4 w-4" />,
	payment: <CreditCard className="h-4 w-4" />,
	settings: <Settings className="h-4 w-4" />,
};

const tabLabels: Record<Tab, string> = {
	profile: "Profile",
	orders: "Orders",
	addresses: "Addresses",
	payment: "Payment Methods",
	settings: "Settings",
};

/* ── Demo data ── */
const user = {
	firstName: "MD MEHRAF HOSSEN",
	lastName: "Rony",
	email: "ronym0358@gmail.com",
	phone: "+8801577302590",
	memberType: "Premium Member",
};

const demoOrders = [
	{
		id: "GB-1001",
		date: "2025-02-01",
		items: 3,
		total: 1499,
		status: "Processing" as const,
	},
	{
		id: "GB-0998",
		date: "2025-01-23",
		items: 2,
		total: 899,
		status: "Delivered" as const,
	},
	{
		id: "GB-0990",
		date: "2025-01-15",
		items: 5,
		total: 2350,
		status: "Shipped" as const,
	},
	{
		id: "GB-0985",
		date: "2025-01-08",
		items: 1,
		total: 450,
		status: "Delivered" as const,
	},
];

const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
	Processing: {
		color: "bg-amber-500/10 text-amber-400 border-amber-500/20",
		icon: <Clock className="h-3 w-3" />,
	},
	Shipped: {
		color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
		icon: <Truck className="h-3 w-3" />,
	},
	Delivered: {
		color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
		icon: <CheckCircle2 className="h-3 w-3" />,
	},
};

const demoAddresses = [
	{
		label: "Home",
		name: "MD MEHRAF HOSSEN Rony",
		phone: "+8801577302590",
		address: "House 23, Road 24, Block B, Mirpur, Dhaka-1216",
		isDefault: true,
	},
	{
		label: "Office",
		name: "MD MEHRAF HOSSEN Rony",
		phone: "+8801577302590",
		address: "Gulshan Avenue, Dhaka-1212",
		isDefault: false,
	},
];

const demoPayments = [
	{
		type: "bKash",
		number: "**** **** 2590",
		isDefault: true,
	},
	{
		type: "Nagad",
		number: "**** **** 2590",
		isDefault: false,
	},
];

/* ── Component ── */
const ProfilePage = () => {
	const [active, setActive] = useState<Tab>("profile");
	const [editing, setEditing] = useState(false);
	const [toggles, setToggles] = useState<Record<string, boolean>>({
		sms: true,
		email: true,
		dark: false,
		lang: false,
		"2fa": false,
	});

	const toggle = (key: string) =>
		setToggles((prev) => ({ ...prev, [key]: !prev[key] }));

	return (
		<div className="min-h-screen bg-background text-foreground">
			<StoreHeader />

			<main className="bg-background">
				<div className="container py-8">
					<div className="grid gap-6 lg:grid-cols-[300px_1fr]">
						{/* ── Left Sidebar ── */}
						<aside className="self-start lg:sticky lg:top-24">
							<div className="rounded-2xl border bg-card p-6">
								{/* Avatar area */}
								<div className="flex flex-col items-center text-center">
									<div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/20">
										<User className="h-12 w-12 text-primary" />
									</div>
									<h2 className="mt-4 text-lg font-extrabold tracking-tight">
										{user.firstName} {user.lastName}
									</h2>
									<p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
									<span className="mt-3 inline-flex rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-400">
										{user.memberType}
									</span>
								</div>

								{/* Nav */}
								<nav className="mt-6 space-y-1">
									{tabs.map((tab) => (
										<button
											key={tab}
											type="button"
											onClick={() => setActive(tab)}
											className={
												"flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition-all " +
												(active === tab
													? "bg-primary text-primary-foreground shadow-sm"
													: "text-foreground/70 hover:bg-accent hover:text-foreground")
											}
										>
											{tabIcons[tab]}
											{tabLabels[tab]}
										</button>
									))}

									<div className="my-3 border-t" />

									<button
										type="button"
										className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10"
									>
										<LogOut className="h-4 w-4" />
										Sign Out
									</button>
								</nav>
							</div>
						</aside>

						{/* ── Right Content ── */}
						<div>
							{/* Top Tab Bar */}
							<div className="rounded-xl border bg-card">
								<div className="flex overflow-x-auto">
									{tabs.map((tab) => (
										<button
											key={tab}
											type="button"
											onClick={() => setActive(tab)}
											className={
												"relative flex-1 whitespace-nowrap px-4 py-3.5 text-center text-sm font-semibold transition-colors " +
												(active === tab
													? "text-primary"
													: "text-muted-foreground hover:text-foreground")
											}
										>
											{tabLabels[tab]}
											{active === tab && (
												<span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary" />
											)}
										</button>
									))}
								</div>
							</div>

							{/* Tab Content */}
							<div className="mt-4 min-h-[70vh]">
								{/* ── Profile Tab ── */}
								{active === "profile" && (
									<div className="rounded-2xl border bg-card p-6">
										<div className="flex items-center justify-between">
											<h2 className="text-xl font-extrabold tracking-tight">
												Personal Information
											</h2>
											<button
												type="button"
												onClick={() => setEditing((v) => !v)}
												className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors hover:bg-accent"
											>
												<Pencil className="h-4 w-4" />
												{editing ? "Cancel" : "Edit"}
											</button>
										</div>

										<div className="mt-6 grid gap-5 sm:grid-cols-2">
											<fieldset className="space-y-2">
												<label className="text-sm font-bold text-foreground">
													First Name
												</label>
												<input
													type="text"
													defaultValue={user.firstName}
													disabled={!editing}
													className="w-full rounded-lg border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary disabled:opacity-70"
												/>
											</fieldset>
											<fieldset className="space-y-2">
												<label className="text-sm font-bold text-foreground">
													Last Name
												</label>
												<input
													type="text"
													defaultValue={user.lastName}
													disabled={!editing}
													className="w-full rounded-lg border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary disabled:opacity-70"
												/>
											</fieldset>
										</div>

										<div className="mt-5 space-y-2">
											<label className="text-sm font-bold text-foreground">Email</label>
											<input
												type="email"
												defaultValue={user.email}
												disabled={!editing}
												className="w-full rounded-lg border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary disabled:opacity-70"
											/>
										</div>

										<div className="mt-5 space-y-2">
											<label className="text-sm font-bold text-foreground">Phone</label>
											<input
												type="tel"
												defaultValue={user.phone}
												disabled={!editing}
												className="w-full rounded-lg border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary disabled:opacity-70"
											/>
										</div>

										{editing && (
											<div className="mt-6 flex justify-end">
												<button
													type="button"
													onClick={() => setEditing(false)}
													className="rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
												>
													Save Changes
												</button>
											</div>
										)}
									</div>
								)}

								{/* ── Orders Tab ── */}
								{active === "orders" && (
									<div className="rounded-2xl border bg-card p-6">
										<div className="flex items-center justify-between">
											<div>
												<h2 className="text-xl font-extrabold tracking-tight">
													Order History
												</h2>
												<p className="mt-1 text-sm text-muted-foreground">
													Track and manage your recent orders.
												</p>
											</div>
										</div>

										<div className="mt-6 space-y-3">
											{demoOrders.map((o) => {
												const sc = statusConfig[o.status] ?? statusConfig.Processing;
												return (
													<div
														key={o.id}
														className="flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-background p-4 transition-colors hover:bg-accent/30"
													>
														<div className="flex items-center gap-4">
															<div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
																<Package className="h-5 w-5 text-primary" />
															</div>
															<div>
																<p className="text-sm font-bold text-foreground">
																	{o.id}
																</p>
																<p className="text-xs text-muted-foreground">
																	{o.date} · {o.items} items
																</p>
															</div>
														</div>
														<div className="flex items-center gap-4">
															<p className="text-sm font-bold tabular-nums text-foreground">
																৳{o.total.toLocaleString()}
															</p>
															<span
																className={
																	"inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold " +
																	sc.color
																}
															>
																{sc.icon}
																{o.status}
															</span>
														</div>
													</div>
												);
											})}
										</div>
									</div>
								)}

								{/* ── Addresses Tab ── */}
								{active === "addresses" && (
									<div className="rounded-2xl border bg-card p-6">
										<div className="flex items-center justify-between">
											<div>
												<h2 className="text-xl font-extrabold tracking-tight">
													Saved Addresses
												</h2>
												<p className="mt-1 text-sm text-muted-foreground">
													Manage your delivery addresses.
												</p>
											</div>
											<button
												type="button"
												className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
											>
												<Plus className="h-4 w-4" />
												Add New
											</button>
										</div>

										<div className="mt-6 grid gap-4 sm:grid-cols-2">
											{demoAddresses.map((addr) => (
												<div
													key={addr.label}
													className="relative rounded-xl border bg-background p-5 transition-colors hover:border-primary/30"
												>
													<div className="flex items-center gap-2">
														<MapPin className="h-4 w-4 text-primary" />
														<span className="text-sm font-extrabold text-foreground">
															{addr.label}
														</span>
														{addr.isDefault && (
															<span className="rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-bold text-primary">
																Default
															</span>
														)}
													</div>
													<p className="mt-3 text-sm text-foreground/80">{addr.name}</p>
													<p className="text-sm text-muted-foreground">{addr.phone}</p>
													<p className="mt-2 text-sm text-foreground/70">{addr.address}</p>
													<div className="mt-4 flex gap-3 text-xs">
														<button
															type="button"
															className="font-semibold text-primary hover:underline"
														>
															Edit
														</button>
														<button
															type="button"
															className="font-semibold text-red-400 hover:underline"
														>
															Delete
														</button>
													</div>
												</div>
											))}
										</div>
									</div>
								)}

								{/* ── Payment Tab ── */}
								{active === "payment" && (
									<div className="rounded-2xl border bg-card p-6">
										<div className="flex items-center justify-between">
											<div>
												<h2 className="text-xl font-extrabold tracking-tight">
													Payment Methods
												</h2>
												<p className="mt-1 text-sm text-muted-foreground">
													Manage your saved payment options.
												</p>
											</div>
											<button
												type="button"
												className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
											>
												<Plus className="h-4 w-4" />
												Add New
											</button>
										</div>

										<div className="mt-6 grid gap-4 sm:grid-cols-2">
											{demoPayments.map((pm) => (
												<div
													key={pm.type}
													className="flex items-center gap-4 rounded-xl border bg-background p-5 transition-colors hover:border-primary/30"
												>
													<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
														<CreditCard className="h-6 w-6 text-primary" />
													</div>
													<div className="flex-1">
														<div className="flex items-center gap-2">
															<p className="text-sm font-bold text-foreground">
																{pm.type}
															</p>
															{pm.isDefault && (
																<span className="rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-bold text-primary">
																	Default
																</span>
															)}
														</div>
														<p className="text-sm text-muted-foreground">{pm.number}</p>
													</div>
													<button
														type="button"
														className="text-xs font-semibold text-red-400 hover:underline"
													>
														Remove
													</button>
												</div>
											))}
										</div>
									</div>
								)}

								{/* ── Settings Tab ── */}
								{active === "settings" && (
									<div className="rounded-2xl border bg-card p-6">
										<h2 className="text-xl font-extrabold tracking-tight">Settings</h2>
										<p className="mt-1 text-sm text-muted-foreground">
											Manage your account preferences.
										</p>

										<div className="mt-6 space-y-4">
											{[
												{
													key: "sms",
													icon: <Bell className="h-4 w-4 text-primary" />,
													label: "Order notifications (SMS)",
													desc: "Get SMS updates for order status",
												},
												{
													key: "email",
													icon: <Bell className="h-4 w-4 text-primary" />,
													label: "Order notifications (Email)",
													desc: "Get email updates for order status",
												},
												{
													key: "dark",
													icon: <Moon className="h-4 w-4 text-primary" />,
													label: "Dark mode",
													desc: "Switch between light and dark themes",
												},
												{
													key: "lang",
													icon: <Globe className="h-4 w-4 text-primary" />,
													label: "Language (বাংলা)",
													desc: "Switch between English and Bengali",
												},
												{
													key: "2fa",
													icon: <Shield className="h-4 w-4 text-primary" />,
													label: "Two-factor authentication",
													desc: "Add an extra layer of security",
												},
											].map((item) => (
												<div
													key={item.key}
													className="flex items-center justify-between gap-4 rounded-xl border bg-background p-4 transition-colors hover:bg-accent/30"
												>
													<div className="flex items-center gap-3">
														<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
															{item.icon}
														</div>
														<div>
															<p className="text-sm font-semibold text-foreground">
																{item.label}
															</p>
															<p className="text-xs text-muted-foreground">
																{item.desc}
															</p>
														</div>
													</div>
													<button
														type="button"
														aria-label={`Toggle ${item.label}`}
														onClick={() => toggle(item.key)}
														className={
															"relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 " +
															(toggles[item.key]
																? "bg-primary"
																: "bg-muted-foreground/30")
														}
													>
														<span
															className={
																"pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md ring-0 transition-transform duration-200 " +
																(toggles[item.key] ? "translate-x-6" : "translate-x-1")
															}
														/>
													</button>
												</div>
											))}
										</div>

										<div className="mt-8 border-t pt-6">
											<h3 className="text-base font-bold text-red-400">Danger Zone</h3>
											<p className="mt-1 text-sm text-muted-foreground">
												Permanently delete your account and all data.
											</p>
											<button
												type="button"
												className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-400 transition-colors hover:bg-red-500/20"
											>
												Delete Account
											</button>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</main>

			<StoreFooter />
		</div>
	);
};

export default ProfilePage;
