import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { Activity, BarChart3, CreditCard, Package, Settings, ShoppingBag, Tags, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { demoProducts } from "@/data/storefront";
import {
	defaultContentConfig,
	readContentConfig,
	writeContentConfig,
	type StorefrontContentConfig,
} from "@/data/storefrontContent";
import { AdminProductsSection } from "@/components/admin/AdminProductsSection";
import { AdminShell } from "@/components/admin/AdminShell";
import { isAdminDemoAuthed } from "@/lib/adminDemoAuth";

const revenueData = [
	{ name: "Mon", revenue: 32000, orders: 42 },
	{ name: "Tue", revenue: 28000, orders: 38 },
	{ name: "Wed", revenue: 36000, orders: 51 },
	{ name: "Thu", revenue: 41000, orders: 59 },
	{ name: "Fri", revenue: 47000, orders: 63 },
	{ name: "Sat", revenue: 52000, orders: 71 },
	{ name: "Sun", revenue: 39000, orders: 49 },
];

const categoryShare = [
	{ name: "Oil", value: 32 },
	{ name: "Honey", value: 21 },
	{ name: "Ghee", value: 18 },
	{ name: "Dates", value: 14 },
	{ name: "Snacks", value: 15 },
];

const recentOrders = [
	{ id: "GB-1042", customer: "Mahmud Hasan", total: 2450, status: "Processing" },
	{ id: "GB-1041", customer: "Nusrat Jahan", total: 3890, status: "Delivered" },
	{ id: "GB-1040", customer: "Samiul Islam", total: 1790, status: "Pending" },
	{ id: "GB-1039", customer: "Rafiq Uddin", total: 5120, status: "Delivered" },
];

const topProducts = [
	{ name: "Pure Honey Jar", revenue: 18500, orders: 62 },
	{ name: "Mustard Oil 1L", revenue: 16200, orders: 55 },
	{ name: "Deshi Ghee 500g", revenue: 14900, orders: 47 },
	{ name: "Ajwa Dates", revenue: 12100, orders: 39 },
];

const lowStockProducts = demoProducts.filter((p) => p.stock === "out").slice(0, 5);

const inventoryStats = {
	totalSkus: demoProducts.length,
	outOfStock: demoProducts.filter((p) => p.stock === "out").length,
	inStock: demoProducts.filter((p) => p.stock === "in").length,
};

const CATEGORIES_KEY = "gb_categories_v1";

type Category = {
	id: string;
	name: string;
	slug: string;
	description?: string;
	status: "active" | "inactive";
	displayOrder: number;
	createdAt: string;
};

const readCategories = (): Category[] => {
	try {
		const raw = localStorage.getItem(CATEGORIES_KEY);
		const parsed = raw ? (JSON.parse(raw) as unknown) : [];
		if (!Array.isArray(parsed)) return [];
		return (parsed as any[]).map((item) => ({
			id: String(item.id ?? Date.now()),
			name: String(item.name ?? "Unnamed"),
			slug: String(item.slug ?? ""),
			description: item.description ? String(item.description) : undefined,
			status: item.status === "inactive" ? "inactive" : "active",
			displayOrder: Number.isFinite(Number(item.displayOrder)) ? Number(item.displayOrder) : 0,
			createdAt: item.createdAt ?? new Date().toISOString(),
		}));
	} catch {
		return [];
	}
};

const writeCategories = (items: Category[]) => {
	try {
		localStorage.setItem(CATEGORIES_KEY, JSON.stringify(items));
	} catch {
		// ignore
	}
};

const toSlug = (value: string) =>
	value
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)+/g, "");

const statCards = [
	{
		key: "revenue",
		label: "Today Revenue",
		value: "৳52,430",
		change: "+18.4%",
		changeTone: "up" as const,
		description: "vs yesterday",
		Icon: BarChart3,
	},
	{
		key: "orders",
		label: "New Orders",
		value: "71",
		change: "+12 orders",
		changeTone: "up" as const,
		description: "last 24 hours",
		Icon: ShoppingBag,
	},
	{
		key: "customers",
		label: "Active Customers",
		value: "3,248",
		change: "+4.1%",
		changeTone: "up" as const,
		description: "this week",
		Icon: Users,
	},
	{
		key: "low_stock",
		label: "Low Stock Products",
		value: String(inventoryStats.outOfStock),
		change: `${inventoryStats.outOfStock} items out`,
		changeTone: "down" as const,
		description: "currently marked out of stock",
		Icon: Activity,
	},
];

const sidebarItems = [
	{ key: "overview", label: "Dashboard", Icon: BarChart3 },
	{ key: "products", label: "Products", Icon: Package },
	{ key: "orders", label: "Orders", Icon: ShoppingBag },
	{ key: "payments", label: "Payments", Icon: CreditCard },
	{ key: "customers", label: "Customers", Icon: Users },
	{ key: "categories", label: "Categories", Icon: Tags },
	{ key: "content", label: "Content / Banners", Icon: Settings },
	{ key: "settings", label: "Settings", Icon: Settings },
] as const;

type SectionKey = (typeof sidebarItems)[number]["key"];

type TabKey = Extract<SectionKey, "overview" | "products" | "categories" | "content">;

const isTabKey = (v: string | null): v is TabKey =>
	v === "overview" || v === "products" || v === "categories" || v === "content";

const AdminDashboard = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const [activeSection, setActiveSection] = useState<SectionKey>("overview");

	// Categories state
	const [categories, setCategories] = useState<Category[]>([]);
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [status, setStatus] = useState<"active" | "inactive">("active");
	const [displayOrder, setDisplayOrder] = useState<number>(0);
	const [search, setSearch] = useState("");
	const [editingId, setEditingId] = useState<string | null>(null);
	const [categoryError, setCategoryError] = useState<string | null>(null);

	// Content / banners state
	const [contentConfig, setContentConfig] = useState<StorefrontContentConfig>(defaultContentConfig);
	const [contentLoaded, setContentLoaded] = useState(false);

	useEffect(() => {
		if (!isAdminDemoAuthed()) {
			navigate("/admin/login", { replace: true });
			return;
		}

		setCategories(readCategories());
		setContentConfig(readContentConfig());
		setContentLoaded(true);
	}, [navigate]);

	useEffect(() => {
		const tab = new URLSearchParams(location.search).get("tab");
		if (isTabKey(tab)) setActiveSection(tab);
	}, [location.search]);

	const handleCategorySubmit = () => {
		const trimmed = name.trim();
		if (!trimmed) {
			setCategoryError("Category name is required");
			return;
		}

		const slug = toSlug(trimmed);
		if (!slug) {
			setCategoryError("Category name must contain letters or numbers");
			return;
		}

		const exists = categories.some((c) => c.slug === slug && c.id !== editingId);
		if (exists) {
			setCategoryError("A category with this name already exists");
			return;
		}

		if (editingId) {
			const updated = categories.map((c) =>
				c.id === editingId
					? {
						...c,
						name: trimmed,
						slug,
						description: description.trim() || undefined,
						status,
						displayOrder,
					}
					: c,
			);
			setCategories(updated);
			writeCategories(updated);
		} else {
			const next: Category = {
				id: `${Date.now()}`,
				name: trimmed,
				slug,
				description: description.trim() || undefined,
				status,
				displayOrder,
				createdAt: new Date().toISOString(),
			};
			const updated = [next, ...categories];
			setCategories(updated);
			writeCategories(updated);
		}

		setName("");
		setDescription("");
		setStatus("active");
		setDisplayOrder(0);
		setEditingId(null);
		setCategoryError(null);
	};

	const handleEditCategory = (category: Category) => {
		setName(category.name);
		setDescription(category.description ?? "");
		setStatus(category.status);
		setDisplayOrder(category.displayOrder);
		setEditingId(category.id);
		setCategoryError(null);
	};

	const handleDeleteCategory = (id: string) => {
		const target = categories.find((c) => c.id === id);
		const label = target ? `${target.name} ("/${target.slug}")` : "this category";
		const ok = window.confirm(`Are you sure you want to delete ${label}?`);
		if (!ok) return;

		const updated = categories.filter((c) => c.id !== id);
		setCategories(updated);
		writeCategories(updated);

		if (editingId === id) {
			setName("");
			setDescription("");
			setStatus("active");
			setDisplayOrder(0);
			setEditingId(null);
			setCategoryError(null);
		}
	};

	const resetCategoryForm = () => {
		setName("");
		setDescription("");
		setStatus("active");
		setDisplayOrder(0);
		setEditingId(null);
		setCategoryError(null);
	};

	const filteredCategories = categories
		.slice()
		.sort((a, b) => a.displayOrder - b.displayOrder || a.name.localeCompare(b.name))
		.filter((c) => {
			if (!search.trim()) return true;
			const q = search.toLowerCase();
			return c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q);
		});

	const pageTitle =
		activeSection === "overview"
			? "Overview"
			: activeSection === "products"
				? "Products"
				: activeSection === "orders"
					? "Orders"
					: activeSection === "customers"
						? "Customers"
						: activeSection === "categories"
							? "Categories"
							: activeSection === "content"
								? "Content / Banners"
								: "Settings";

	const pageSubtitle = "High-level insights and controls for your storefront.";

	return (
		<AdminShell
			brandTitle="Gramer Bazar"
			items={sidebarItems as any}
			activeKey={activeSection}
			onChange={(k) => {
				const next = k as SectionKey;
				if (next === "orders") return navigate("/admin/orders");
				if (next === "payments") return navigate("/admin/payments");
				if (next === "customers") return navigate("/admin/customers");
				if (next === "settings") return navigate("/admin/settings");

				setActiveSection(next);
				navigate(`/admin?tab=${next}`, { replace: true });
			}}
			pageTitle={pageTitle}
			pageSubtitle={pageSubtitle}
		>
			<div className="space-y-8">
				{activeSection === "overview" && (
					<>
						{/* Stat cards */}
						<section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
							{statCards.map(({ key, label, value, change, changeTone, description, Icon }) => (
								<article key={key} className="hover-scale relative overflow-hidden rounded-2xl border bg-card p-5 shadow-sm">
									<div className="flex items-start justify-between gap-3">
										<div>
											<div className="text-sm font-semibold uppercase tracking-wide text-ink-muted">{label}</div>
											<div className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">{value}</div>
										</div>
										<div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-foreground">
											<Icon className="h-6 w-6" />
										</div>
									</div>
									<div className="mt-3 flex items-center justify-between text-sm">
										<div className={"font-semibold " + (changeTone === "up" ? "text-emerald-600" : "text-destructive")}>
											{change}
										</div>
										<div className="text-ink-muted">{description}</div>
									</div>
								</article>
							))}
						</section>

						{/* Charts row */}
						<section className="grid gap-6 lg:grid-cols-2">
							<article className="rounded-2xl border bg-card p-5">
								<div className="flex items-center justify-between gap-3">
									<div>
										<h2 className="text-base font-extrabold tracking-tight">Revenue & Orders (Last 7 days)</h2>
										<p className="mt-1 text-sm text-ink-muted">Track daily revenue and order volume.</p>
									</div>
								</div>
								<div className="mt-4 h-72">
									<ResponsiveContainer width="100%" height="100%">
										<LineChart data={revenueData} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
											<CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
											<XAxis dataKey="name" tickLine={false} axisLine={false} />
											<YAxis tickLine={false} axisLine={false} tickFormatter={(v) => `৳${v / 1000}k`} />
											<Tooltip
												contentStyle={{
													borderRadius: 12,
													borderColor: "hsl(var(--border))",
												}}
												formatter={(value: number, key) =>
													key === "revenue" ? `৳${value.toLocaleString("en-US")}` : `${value} orders`
												}
											/>
											<Legend />
											<Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2.2} dot={false} />
											<Line type="monotone" dataKey="orders" stroke="hsl(var(--ink-muted))" strokeWidth={2} />
										</LineChart>
									</ResponsiveContainer>
								</div>
							</article>

							<article className="rounded-2xl border bg-card p-5">
								<div className="flex items-center justify-between gap-3">
									<div>
										<h2 className="text-base font-extrabold tracking-tight">Category Performance</h2>
										<p className="mt-1 text-sm text-ink-muted">Revenue share by product category.</p>
									</div>
								</div>
								<div className="mt-4 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
									<div className="h-72">
										<ResponsiveContainer width="100%" height="100%">
											<BarChart data={categoryShare} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
												<CartesianGrid vertical={false} stroke="hsl(var(--border))" />
												<XAxis dataKey="name" tickLine={false} axisLine={false} />
												<YAxis tickLine={false} axisLine={false} />
												<Tooltip
													contentStyle={{
														borderRadius: 12,
														borderColor: "hsl(var(--border))",
													}}
													formatter={(value: number) => `${value}% share`}
												/>
												<Bar dataKey="value" radius={[8, 8, 0, 0]} fill="hsl(var(--primary))" />
											</BarChart>
										</ResponsiveContainer>
									</div>
									<div className="h-72">
										<ResponsiveContainer width="100%" height="100%">
											<PieChart>
												<Tooltip
													contentStyle={{
														borderRadius: 12,
														borderColor: "hsl(var(--border))",
													}}
													formatter={(value: number, name: string) => [`${value}%`, name]}
												/>
												<Pie data={categoryShare} dataKey="value" nameKey="name" innerRadius={48} outerRadius={84} paddingAngle={4} />
											</PieChart>
										</ResponsiveContainer>
									</div>
								</div>
							</article>
						</section>

						{/* Tables */}
						<section className="grid gap-6 xl:grid-cols-2">
							<article className="rounded-2xl border bg-card p-5">
								<div>
									<h2 className="text-base font-extrabold tracking-tight">Recent Orders</h2>
									<p className="mt-1 text-sm text-ink-muted">Last 4 orders placed in the store.</p>
								</div>
								<div className="mt-4 overflow-x-auto">
									<table className="min-w-full text-left text-sm">
										<thead className="border-b bg-surface-2/60">
											<tr>
												<th className="px-3 py-3 font-semibold">Order</th>
												<th className="px-3 py-3 font-semibold">Customer</th>
												<th className="px-3 py-3 font-semibold text-right">Total</th>
												<th className="px-3 py-3 font-semibold text-right">Status</th>
											</tr>
										</thead>
										<tbody>
											{recentOrders.map((o) => (
												<tr key={o.id} className="border-b last:border-0">
													<td className="px-3 py-3 font-semibold">{o.id}</td>
													<td className="px-3 py-3 text-ink-muted">{o.customer}</td>
													<td className="px-3 py-3 text-right font-semibold tabular-nums">৳{o.total.toLocaleString("en-US")}</td>
													<td className="px-3 py-3 text-right">
														<span
															className={
																"inline-flex rounded-full px-3 py-1 text-xs font-semibold " +
																(o.status === "Delivered"
																	? "bg-emerald-50 text-emerald-700"
																	: o.status === "Processing"
																		? "bg-primary/10 text-primary"
																		: "bg-muted text-muted-foreground")
															}
														>
															{o.status}
														</span>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</article>

							<article className="rounded-2xl border bg-card p-5">
								<div>
									<h2 className="text-base font-extrabold tracking-tight">Top Products</h2>
									<p className="mt-1 text-sm text-ink-muted">Best performers by revenue.</p>
								</div>
								<div className="mt-4 overflow-x-auto">
									<table className="min-w-full text-left text-sm">
										<thead className="border-b bg-surface-2/60">
											<tr>
												<th className="px-3 py-3 font-semibold">Product</th>
												<th className="px-3 py-3 font-semibold text-right">Revenue</th>
												<th className="px-3 py-3 font-semibold text-right">Orders</th>
											</tr>
										</thead>
										<tbody>
											{topProducts.map((p) => (
												<tr key={p.name} className="border-b last:border-0">
													<td className="px-3 py-3 font-semibold">{p.name}</td>
													<td className="px-3 py-3 text-right font-semibold tabular-nums">৳{p.revenue.toLocaleString("en-US")}</td>
													<td className="px-3 py-3 text-right tabular-nums">{p.orders}</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</article>
						</section>

						{/* Inventory & stock health */}
						<section className="grid gap-6 lg:grid-cols-[1.1fr_1.4fr]">
							<article className="rounded-2xl border bg-card p-5">
								<div>
									<h2 className="text-base font-extrabold tracking-tight">Inventory Overview</h2>
									<p className="mt-1 text-sm text-ink-muted">
										Snapshot of total SKUs, in-stock, and out-of-stock items based on storefront demo data.
									</p>
								</div>

								<div className="mt-4 grid gap-3 sm:grid-cols-3">
									<div className="rounded-2xl border bg-surface-2/60 p-4">
										<div className="text-sm font-semibold uppercase tracking-wide text-ink-muted">Total SKUs</div>
										<div className="mt-2 text-3xl font-extrabold tabular-nums">{inventoryStats.totalSkus}</div>
										<div className="mt-1 text-sm text-ink-muted">Products configured in demo catalog</div>
									</div>

									<div className="rounded-2xl border bg-surface-2/60 p-4">
										<div className="text-sm font-semibold uppercase tracking-wide text-ink-muted">In Stock</div>
										<div className="mt-2 text-3xl font-extrabold tabular-nums text-emerald-600">{inventoryStats.inStock}</div>
										<div className="mt-1 text-sm text-ink-muted">Ready to sell right now</div>
									</div>

									<div className="rounded-2xl border bg-destructive/5 p-4">
										<div className="text-sm font-semibold uppercase tracking-wide text-destructive">Out of Stock</div>
										<div className="mt-2 text-3xl font-extrabold tabular-nums text-destructive">{inventoryStats.outOfStock}</div>
										<div className="mt-1 text-sm text-ink-muted">Need restock soon</div>
									</div>
								</div>
							</article>

							<article className="rounded-2xl border bg-card p-5">
								<div>
									<h2 className="text-base font-extrabold tracking-tight">Low / Out-of-stock</h2>
									<p className="mt-1 text-sm text-ink-muted">Quick overview of products that are currently marked as out of stock.</p>
								</div>

								<div className="mt-4 overflow-x-auto">
									{lowStockProducts.length === 0 ? (
										<div className="rounded-2xl border bg-surface-2/60 p-5 text-sm text-ink-muted">All demo products are currently in stock.</div>
									) : (
										<table className="min-w-full text-left text-sm">
											<thead className="border-b bg-surface-2/60">
												<tr>
													<th className="px-3 py-3 font-semibold">Product</th>
													<th className="px-3 py-3 font-semibold">Category</th>
													<th className="px-3 py-3 font-semibold text-right">Status</th>
												</tr>
											</thead>
											<tbody>
												{lowStockProducts.map((p) => (
													<tr key={p.id} className="border-b last:border-0">
														<td className="px-3 py-3 font-semibold">{p.name}</td>
														<td className="px-3 py-3 text-ink-muted">{p.category}</td>
														<td className="px-3 py-3 text-right">
															<span className="inline-flex rounded-full bg-destructive/10 px-3 py-1 text-xs font-semibold text-destructive">Out of stock</span>
														</td>
													</tr>
												))}
											</tbody>
										</table>
									)}
								</div>
							</article>
						</section>
					</>
				)}

				{activeSection === "products" && <AdminProductsSection />}

				{/* ... keep existing code (categories, content, orders, customers, settings sections unchanged) */}
				{activeSection === "categories" && (
					<section className="grid gap-6 rounded-2xl border bg-card p-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.5fr)]">
						{/* Create / edit form */}
						<article>
							<h2 className="text-base font-extrabold tracking-tight">Manage categories</h2>
							<p className="mt-1 text-sm text-ink-muted">
								Create, edit, and organize product categories.
							</p>

							<div className="mt-5 space-y-4 text-sm">
								<div>
									<label className="text-sm font-semibold text-foreground">Name</label>
									<input
										value={name}
										onChange={(e) => setName(e.target.value)}
										placeholder="e.g. Organic Oil, Honey, Snacks"
										className="mt-2 h-11 w-full rounded-md border bg-background px-4 text-base"
										maxLength={80}
									/>
								</div>

								<div>
									<label className="text-sm font-semibold text-foreground">Description (optional)</label>
									<textarea
										value={description}
										onChange={(e) => setDescription(e.target.value)}
										placeholder="Short description to explain what goes under this category."
										className="mt-2 min-h-[96px] w-full rounded-md border bg-background px-4 py-3 text-base"
										maxLength={240}
									/>
								</div>

								<div className="grid gap-4 sm:grid-cols-2">
									<div>
										<label className="text-sm font-semibold text-foreground">Status</label>
										<select
											value={status}
											onChange={(e) => setStatus(e.target.value as "active" | "inactive")}
											className="mt-2 h-11 w-full rounded-md border bg-background px-4 text-base"
										>
											<option value="active">Active</option>
											<option value="inactive">Inactive</option>
										</select>
									</div>

									<div>
										<label className="text-sm font-semibold text-foreground">Display order</label>
										<input
											type="number"
											value={displayOrder}
											onChange={(e) => setDisplayOrder(Number(e.target.value) || 0)}
											className="mt-2 h-11 w-full rounded-md border bg-background px-4 text-base"
											placeholder="0"
										/>
									</div>
								</div>

								{name.trim() && (
									<div className="rounded-xl bg-muted px-4 py-3 text-sm text-muted-foreground">
										Slug preview: <span className="font-mono font-semibold text-foreground">{toSlug(name) || "-"}</span>
									</div>
								)}

								{categoryError && (
									<div className="rounded-xl border bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive">
										{categoryError}
									</div>
								)}

								<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
									<Button type="button" size="lg" className="w-full sm:w-auto" onClick={handleCategorySubmit}>
										{editingId ? "Save changes" : "Create category"}
									</Button>
									{editingId && (
										<button
											type="button"
											onClick={resetCategoryForm}
											className="text-sm font-semibold text-ink-muted underline-offset-4 hover:underline"
										>
											Cancel edit
										</button>
									)}
								</div>
							</div>
						</article>

						{/* List */}
						<article>
							<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
								<div>
									<h2 className="text-base font-extrabold tracking-tight">Existing categories</h2>
									<p className="mt-1 text-sm text-ink-muted">Search, edit, and delete categories.</p>
								</div>

								<div className="w-full max-w-md">
									<input
										value={search}
										onChange={(e) => setSearch(e.target.value)}
										placeholder="Search by name or slug"
										className="h-11 w-full rounded-md border bg-background px-4 text-base"
									/>
								</div>
							</div>

							<div className="mt-5 space-y-3">
								{filteredCategories.length === 0 ? (
									<div className="rounded-2xl border bg-surface-2/60 p-5 text-sm text-ink-muted">No categories match your filters yet.</div>
								) : (
									<ul className="space-y-3">
										{filteredCategories.map((c) => (
											<li key={c.id} className="flex items-start justify-between gap-4 rounded-2xl border bg-surface-2/60 p-4">
												<div className="min-w-0">
													<div className="flex flex-wrap items-center gap-2">
														<div className="truncate text-base font-extrabold">{c.name}</div>
														<span
															className={
																"inline-flex rounded-full px-3 py-1 text-xs font-semibold " +
																(c.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-muted text-muted-foreground")
															}
														>
															{c.status === "active" ? "Active" : "Inactive"}
														</span>
													</div>
													<div className="mt-1 text-sm font-mono text-ink-muted">/{c.slug}</div>
													{c.description ? <p className="mt-2 text-sm text-ink-muted">{c.description}</p> : null}
													<div className="mt-2 text-sm text-ink-muted">
														Order: <span className="tabular-nums">{c.displayOrder}</span>
													</div>
												</div>
												<div className="flex shrink-0 flex-col items-end gap-2">
													<Button type="button" variant="outline" size="lg" className="h-11 px-5" onClick={() => handleEditCategory(c)}>
														Edit
													</Button>
													<Button
														type="button"
														variant="outline"
														size="lg"
														className="h-11 px-5 text-destructive hover:bg-destructive/10"
														onClick={() => handleDeleteCategory(c.id)}
													>
														Delete
													</Button>
												</div>
											</li>
										))}
									</ul>
								)}
							</div>
						</article>
					</section>
				)}

				{activeSection === "content" && (
					<section className="space-y-6 rounded-2xl border bg-card p-5">
						{/* existing content editor UI */}
						<article>
							<h2 className="text-base font-extrabold tracking-tight">Hero section</h2>
							<p className="mt-1 text-sm text-ink-muted">Update hero text and slides for the storefront home page.</p>

							<div className="mt-5 grid gap-5 text-sm md:grid-cols-2">
								<div className="space-y-4">
									<div>
										<label className="text-sm font-semibold text-foreground">Badge text</label>
										<input
											value={contentConfig.heroBadge}
											onChange={(e) => setContentConfig((prev) => ({ ...prev, heroBadge: e.target.value }))}
											className="mt-2 h-11 w-full rounded-md border bg-background px-4 text-base"
											maxLength={120}
										/>
									</div>

									<div>
										<label className="text-sm font-semibold text-foreground">Hero title</label>
										<input
											value={contentConfig.heroTitle}
											onChange={(e) => setContentConfig((prev) => ({ ...prev, heroTitle: e.target.value }))}
											className="mt-2 h-11 w-full rounded-md border bg-background px-4 text-base"
											maxLength={160}
										/>
									</div>

									<div>
										<label className="text-sm font-semibold text-foreground">Hero subtitle</label>
										<textarea
											value={contentConfig.heroSubtitle}
											onChange={(e) => setContentConfig((prev) => ({ ...prev, heroSubtitle: e.target.value }))}
											className="mt-2 min-h-[104px] w-full rounded-md border bg-background px-4 py-3 text-base"
											maxLength={260}
										/>
									</div>

									<div>
										<label className="text-sm font-semibold text-foreground">Contact button text</label>
										<input
											value={contentConfig.heroContactLabel}
											onChange={(e) => setContentConfig((prev) => ({ ...prev, heroContactLabel: e.target.value }))}
											className="mt-2 h-11 w-full rounded-md border bg-background px-4 text-base"
											maxLength={200}
										/>
									</div>

									<div>
										<label className="text-sm font-semibold text-foreground">Contact subtext</label>
										<input
											value={contentConfig.heroContactSubtext}
											onChange={(e) => setContentConfig((prev) => ({ ...prev, heroContactSubtext: e.target.value }))}
											className="mt-2 h-11 w-full rounded-md border bg-background px-4 text-base"
											maxLength={140}
										/>
									</div>
								</div>

								<div className="space-y-4">
									<div className="text-sm font-semibold text-foreground">Hero slides (image URLs)</div>
									{contentConfig.heroSlides.map((slide, index) => (
										<div key={index} className="space-y-2 rounded-xl border bg-background p-4">
											<div className="text-sm font-semibold text-ink-muted">Slide {index + 1}</div>
											<input
												value={slide.url}
												onChange={(e) => {
													const next = [...contentConfig.heroSlides];
													next[index] = { ...next[index], url: e.target.value };
													setContentConfig((prev) => ({ ...prev, heroSlides: next }));
												}}
												placeholder="Image URL"
												className="h-11 w-full rounded-md border bg-background px-4 text-base"
											/>
											<input
												value={slide.alt}
												onChange={(e) => {
													const next = [...contentConfig.heroSlides];
													next[index] = { ...next[index], alt: e.target.value };
													setContentConfig((prev) => ({ ...prev, heroSlides: next }));
												}}
												placeholder="Alt text (for SEO/accessibility)"
												className="h-11 w-full rounded-md border bg-background px-4 text-base"
											/>
										</div>
									))}
								</div>
							</div>
						</article>

						<article>
							<h2 className="text-base font-extrabold tracking-tight">Offer banner</h2>
							<p className="mt-1 text-sm text-ink-muted">Control the title, subtitle, and button text for the Offer Zone banner.</p>

							<div className="mt-5 grid gap-4 text-sm md:grid-cols-3">
								<div>
									<label className="text-sm font-semibold text-foreground">Title</label>
									<input
										value={contentConfig.offerTitle}
										onChange={(e) => setContentConfig((prev) => ({ ...prev, offerTitle: e.target.value }))}
										className="mt-2 h-11 w-full rounded-md border bg-background px-4 text-base"
										maxLength={80}
									/>
								</div>

								<div>
									<label className="text-sm font-semibold text-foreground">Subtitle</label>
									<input
										value={contentConfig.offerSubtitle}
										onChange={(e) => setContentConfig((prev) => ({ ...prev, offerSubtitle: e.target.value }))}
										className="mt-2 h-11 w-full rounded-md border bg-background px-4 text-base"
										maxLength={160}
									/>
								</div>

								<div>
									<label className="text-sm font-semibold text-foreground">Button label</label>
									<input
										value={contentConfig.offerCtaLabel}
										onChange={(e) => setContentConfig((prev) => ({ ...prev, offerCtaLabel: e.target.value }))}
										className="mt-2 h-11 w-full rounded-md border bg-background px-4 text-base"
										maxLength={80}
									/>
								</div>
							</div>

							<div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center">
								<Button
									type="button"
									size="lg"
									className="w-full sm:w-auto"
									disabled={!contentLoaded}
									onClick={() => writeContentConfig(contentConfig)}
								>
									Save content
								</Button>
								<button
									type="button"
									className="text-sm font-semibold text-ink-muted underline-offset-4 hover:underline"
									onClick={() => {
										setContentConfig(defaultContentConfig);
										writeContentConfig(defaultContentConfig);
									}}
								>
									Reset to defaults
								</button>
							</div>
						</article>
					</section>
				)}

				{activeSection === "orders" && (
					<section className="rounded-2xl border bg-card p-6">
						<h2 className="text-xl font-extrabold tracking-tight">Orders</h2>
						<p className="mt-2 text-sm text-ink-muted">Order management UI will appear here.</p>
					</section>
				)}

				{activeSection === "customers" && (
					<section className="rounded-2xl border bg-card p-6">
						<h2 className="text-xl font-extrabold tracking-tight">Customers</h2>
						<p className="mt-2 text-sm text-ink-muted">Customer management UI will appear here.</p>
					</section>
				)}

				{activeSection === "settings" && (
					<section className="rounded-2xl border bg-card p-6">
						<h2 className="text-xl font-extrabold tracking-tight">Store Settings</h2>
						<p className="mt-2 text-sm text-ink-muted">Settings UI will appear here.</p>
					</section>
				)}
			</div>
		</AdminShell>
	);
};

export default AdminDashboard;
