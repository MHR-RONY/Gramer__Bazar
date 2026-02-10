import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { StoreHeader } from "@/components/storefront/StoreHeader";
import { StoreFooter } from "@/components/storefront/StoreFooter";
import { ProductCard } from "@/components/storefront/ProductCard";
import { demoProducts, categoryMenu, type StoreProductCategory } from "@/data/storefront";
import { SLUG_TO_MENU } from "@/data/storefront/categorySlugMap";

/* ── Banner info per slug ── */
const BANNER_INFO: Record<string, { badge: string; title: string; description: string }> = {
	"offer-zone": {
		badge: "Limited stock",
		title: "Offer Zone",
		description: "আজকের সেরা অফার—দাম কম, মান ঠিক। আপনার পছন্দের ক্যাটাগরি সিলেক্ট করে সহজে ফিল্টার করুন।",
	},
	"best-seller": {
		badge: "Top picks",
		title: "Best Seller",
		description: "সবচেয়ে জনপ্রিয় পণ্যগুলো এখানে—গ্রাহকদের পছন্দের শীর্ষে। আপনার ক্যাটাগরি সিলেক্ট করে সহজে ফিল্টার করুন।",
	},
	oil: {
		badge: "Pure & Natural",
		title: "Oil",
		description: "খাঁটি ও প্রাকৃতিক তেল—স্বাস্থ্যকর রান্নার জন্য সেরা পছন্দ।",
	},
	ghee: {
		badge: "Traditional",
		title: "Ghee (ঘি)",
		description: "খাঁটি দেশি ঘি—ঐতিহ্যবাহী স্বাদ ও পুষ্টিতে ভরপুর।",
	},
	dates: {
		badge: "Imported",
		title: "Dates (খেজুর)",
		description: "বিশ্বের সেরা খেজুর—পুষ্টিকর ও মিষ্টি স্বাদে ভরা।",
	},
	honey: {
		badge: "Authentic",
		title: "Honey",
		description: "খাঁটি মধু—প্রকৃতির শ্রেষ্ঠ উপহার, স্বাস্থ্যের জন্য অতুলনীয়।",
	},
	masala: {
		badge: "Flavourful",
		title: "Masala",
		description: "খাঁটি মসলা—রান্নায় আনুন অনন্য স্বাদ ও সুগন্ধ।",
	},
	"nuts-seeds": {
		badge: "Nutritious",
		title: "Nuts & Seeds",
		description: "পুষ্টিকর বাদাম ও বীজ—স্বাস্থ্যকর স্ন্যাকিংয়ের জন্য সেরা।",
	},
	"tea-coffee": {
		badge: "Premium",
		title: "Tea / Coffee",
		description: "প্রিমিয়াম চা ও কফি—প্রতিটি কাপে সতেজতা।",
	},
	"organic-zone": {
		badge: "100% Organic",
		title: "Organic Zone",
		description: "সম্পূর্ণ অর্গানিক পণ্য—সুস্থ জীবনযাপনের জন্য নিরাপদ পছন্দ।",
	},
	honeycomb: {
		badge: "Natural & Pure",
		title: "HoneyComb",
		description: "খাঁটি মধুর ছাক—প্রাকৃতিক পুষ্টি ও স্বাদে ভরপুর।",
	},
};

/* ── Helpers ── */
const RECENTS_KEY = "gb_recently_viewed_v1";

const readRecentIds = (): string[] => {
	try {
		const raw = localStorage.getItem(RECENTS_KEY);
		const parsed = raw ? (JSON.parse(raw) as unknown) : [];
		return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
	} catch {
		return [];
	}
};

type Availability = "in" | "out";

const MENU_TO_CATEGORY: Partial<Record<(typeof categoryMenu)[number], StoreProductCategory>> = {
	"Offer Zone": "Offer Zone",
	"Best Seller": "Best Seller",
	Oil: "Oil",
	Honey: "Honey",
	Masala: "Masala",
	"Nuts & Seeds": "Nuts & Seeds",
	"Tea/Coffee": "Tea/Coffee",
	"Organic Zone": "Organic",
	HoneyComb: "HoneyComb",
};

const toCategory = (label: (typeof categoryMenu)[number]): StoreProductCategory | null => {
	if (label.startsWith("Ghee")) return "Ghee";
	if (label.startsWith("Dates")) return "Dates";
	if (label.startsWith("Organic")) return "Organic";
	return MENU_TO_CATEGORY[label] ?? null;
};

const Price = ({ value }: { value: number }) => (
	<span className="tabular-nums">৳{value.toLocaleString("en-US", { maximumFractionDigits: 0 })}</span>
);

/* ── Custom styled checkbox ── */
const StyledCheckbox = ({
	checked,
	onChange,
	label,
	count,
}: {
	checked: boolean;
	onChange: (v: boolean) => void;
	label: string;
	count: number;
}) => (
	<label className="group flex cursor-pointer items-center gap-3 select-none">
		<span
			onClick={(e) => {
				e.preventDefault();
				onChange(!checked);
			}}
			className={
				"flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all duration-200 " +
				(checked
					? "border-primary bg-primary shadow-sm shadow-primary/30"
					: "border-muted-foreground/30 bg-background group-hover:border-primary/50")
			}
		>
			{checked && (
				<svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
					<path d="M2 6l3 3 5-5" />
				</svg>
			)}
		</span>
		<span className="text-sm text-foreground/80 transition-colors group-hover:text-foreground">
			{label} <span className="text-ink-muted">({count})</span>
		</span>
	</label>
);

/* ── Collapsible filter section ── */
const FilterSection = ({
	title,
	children,
	defaultOpen = true,
}: {
	title: string;
	children: React.ReactNode;
	defaultOpen?: boolean;
}) => {
	const [open, setOpen] = useState(defaultOpen);
	return (
		<div className="mt-4">
			<button
				type="button"
				onClick={() => setOpen((v) => !v)}
				className="flex w-full items-center justify-between"
			>
				<span className="text-sm font-extrabold">{title}</span>
				<span
					className={
						"flex h-6 w-6 items-center justify-center rounded-full transition-all duration-200 " +
						(open
							? "bg-primary/10 text-primary"
							: "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary")
					}
				>
					{open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
				</span>
			</button>
			<div
				className={
					"overflow-hidden transition-all duration-300 " +
					(open ? "mt-2 max-h-[600px] opacity-100" : "max-h-0 opacity-0")
				}
			>
				{children}
			</div>
		</div>
	);
};

const PAGE_SIZE = 16;

const CategoryListing = () => {
	const { slug } = useParams<{ slug: string }>();
	const resolvedSlug = slug || "offer-zone";

	const defaultMenu = SLUG_TO_MENU[resolvedSlug] ?? "Offer Zone";
	const banner = BANNER_INFO[resolvedSlug] ?? BANNER_INFO["offer-zone"];

	const [activeCollection, setActiveCollection] = useState<(typeof categoryMenu)[number]>(defaultMenu);
	const [inStock, setInStock] = useState(true);
	const [outOfStock, setOutOfStock] = useState(false);
	const [minPrice, setMinPrice] = useState<number>(0);
	const [maxPrice, setMaxPrice] = useState<number>(0);
	const [page, setPage] = useState(1);

	/* Reset active collection when URL slug changes */
	useEffect(() => {
		const menu = SLUG_TO_MENU[resolvedSlug] ?? "Offer Zone";
		setActiveCollection(menu);
		setInStock(true);
		setOutOfStock(false);
		setMinPrice(0);
		setMaxPrice(0);
		setPage(1);
	}, [resolvedSlug]);

	const baseProducts = useMemo(() => {
		const selected = toCategory(activeCollection);
		const list = selected ? demoProducts.filter((p) => p.category === selected) : demoProducts;
		const max = Math.max(0, ...list.map((p) => p.discountedPrice));
		return { list, max };
	}, [activeCollection]);

	useEffect(() => {
		setMaxPrice((prev) => (prev === 0 ? baseProducts.max : Math.min(prev, baseProducts.max || 0)));
		setMinPrice((prev) => Math.min(prev, baseProducts.max || 0));
		setPage(1);
	}, [activeCollection, baseProducts.max]);

	const availabilitySet = useMemo(() => {
		const set = new Set<Availability>();
		if (inStock) set.add("in");
		if (outOfStock) set.add("out");
		return set;
	}, [inStock, outOfStock]);

	const filtered = useMemo(() => {
		const priceLimitMax = maxPrice || baseProducts.max;
		const priceLimitMin = minPrice || 0;
		return baseProducts.list.filter((p) => {
			if (availabilitySet.size > 0 && !availabilitySet.has(p.stock)) return false;
			if (p.discountedPrice > priceLimitMax) return false;
			if (p.discountedPrice < priceLimitMin) return false;
			return true;
		});
	}, [availabilitySet, baseProducts.list, baseProducts.max, minPrice, maxPrice]);

	const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const safePage = Math.min(page, pageCount);

	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, [safePage]);

	const paged = useMemo(() => {
		const start = (safePage - 1) * PAGE_SIZE;
		return filtered.slice(start, start + PAGE_SIZE);
	}, [filtered, safePage]);

	const recentlyViewed = useMemo(() => {
		const ids = readRecentIds();
		const fromStorage = ids
			.map((pid) => demoProducts.find((p) => p.id === pid))
			.filter((p): p is NonNullable<typeof p> => Boolean(p));
		if (fromStorage.length > 0) return fromStorage.slice(0, 6);
		const fallback = [
			demoProducts.find((p) => p.id === "honey-1"),
			demoProducts.find((p) => p.id === "oil-1"),
			demoProducts.find((p) => p.id === "ghee-1"),
			demoProducts.find((p) => p.id === "dates-1"),
			demoProducts.find((p) => p.id === "honey-3"),
			demoProducts.find((p) => p.id === "oil-3"),
		].filter((p): p is NonNullable<typeof p> => Boolean(p));
		return fallback;
	}, []);

	const inCount = useMemo(() => baseProducts.list.filter((p) => p.stock === "in").length, [baseProducts.list]);
	const outCount = useMemo(() => baseProducts.list.filter((p) => p.stock === "out").length, [baseProducts.list]);

	const priceValueMax = Math.min(maxPrice || baseProducts.max, baseProducts.max);
	const priceValueMin = Math.min(minPrice, priceValueMax);
	const minPercent = baseProducts.max > 0 ? (priceValueMin / baseProducts.max) * 100 : 0;
	const maxPercent = baseProducts.max > 0 ? (priceValueMax / baseProducts.max) * 100 : 100;

	return (
		<div className="min-h-screen bg-background text-foreground">
			<StoreHeader />

			<main>
				{/* Banner */}
				<section className="bg-surface-2">
					<div className="container py-8">
						<div className="overflow-hidden rounded-2xl border bg-card">
							<div className="relative p-6 sm:p-10">
								<div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-accent/70 via-background to-background" />
								<div className="relative">
									<div className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
										{banner.badge}
									</div>
									<h1 className="mt-3 text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">
										{banner.title}
									</h1>
									<p className="mt-2 max-w-2xl text-sm text-ink-muted sm:text-base">
										{banner.description}
									</p>

									<div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
										<Link
											to="/"
											className="inline-flex items-center justify-center rounded-md border bg-background px-4 py-2 text-sm font-semibold text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
										>
											Back to Home
										</Link>
										<div className="flex items-center gap-2 text-xs text-ink-muted">
											<SlidersHorizontal className="h-3.5 w-3.5" />
											Showing <span className="font-bold text-foreground">{filtered.length}</span> products
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Content */}
				<section className="bg-background">
					<div className="container py-10">
						<div className="grid gap-8 lg:grid-cols-[280px_1fr]">
							{/* Left filters */}
							<aside className="self-start lg:sticky lg:top-28">
								<div className="rounded-2xl border bg-card p-5 shadow-sm">
									<div className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
										<SlidersHorizontal className="h-4.5 w-4.5 text-primary" />
										Filters
									</div>

									{/* Collections */}
									<FilterSection title="Collections">
										<div className="space-y-0.5">
											{categoryMenu.map((label) => {
												const active = label === activeCollection;
												return (
													<button
														key={label}
														type="button"
														onClick={() => {
															setActiveCollection(label);
															setPage(1);
														}}
														className={
															"flex w-full items-center rounded-md px-2 py-1 text-left text-sm transition-all duration-150 " +
															(active
																? "bg-primary/10 font-extrabold text-primary"
																: "text-foreground/70 hover:bg-muted hover:text-foreground")
														}
													>
														{active && (
															<span className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
														)}
														{label}
													</button>
												);
											})}
										</div>
									</FilterSection>

									{/* Availability */}
									<FilterSection title="Availability">
										<div className="space-y-2">
											<StyledCheckbox
												checked={inStock}
												onChange={(v) => { setInStock(v); setPage(1); }}
												label="In stock"
												count={inCount}
											/>
											<StyledCheckbox
												checked={outOfStock}
												onChange={(v) => { setOutOfStock(v); setPage(1); }}
												label="Out of stock"
												count={outCount}
											/>
										</div>
									</FilterSection>

									{/* Price */}
									<FilterSection title="Price">
										<div>
											<div className="relative mt-1 h-6">
												<div className="absolute left-0 right-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-muted" />
												<div
													className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-gradient-to-r from-primary to-primary/70"
													style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }}
												/>
												<div
													className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
													style={{ left: `${minPercent}%` }}
												>
													<div className="h-5 w-5 rounded-full border-[3px] border-primary bg-white shadow-md shadow-primary/20" />
												</div>
												<div
													className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
													style={{ left: `${maxPercent}%` }}
												>
													<div className="h-5 w-5 rounded-full border-[3px] border-primary bg-white shadow-md shadow-primary/20" />
												</div>
												<input
													type="range"
													min={0}
													max={Math.max(1, baseProducts.max)}
													value={priceValueMin}
													onChange={(e) => {
														const v = Number(e.target.value);
														setMinPrice(Math.min(v, priceValueMax));
														setPage(1);
													}}
													className="pointer-events-none absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0 [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto"
													aria-label="Minimum price"
												/>
												<input
													type="range"
													min={0}
													max={Math.max(1, baseProducts.max)}
													value={priceValueMax}
													onChange={(e) => {
														const v = Number(e.target.value);
														setMaxPrice(Math.max(v, priceValueMin));
														setPage(1);
													}}
													className="pointer-events-none absolute inset-0 z-20 h-full w-full cursor-pointer opacity-0 [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto"
													aria-label="Maximum price"
												/>
											</div>

											<div className="mt-3 flex items-center gap-2">
												<div className="flex-1 overflow-hidden rounded-lg border-2 border-primary/20 bg-primary/5 px-2.5 py-1.5">
													<div className="text-[10px] font-semibold uppercase tracking-wider text-primary/60">Min</div>
													<div className="text-sm font-bold text-foreground">
														<Price value={priceValueMin} />
													</div>
												</div>
												<div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted">
													<ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
												</div>
												<div className="flex-1 overflow-hidden rounded-lg border-2 border-primary/20 bg-primary/5 px-2.5 py-1.5">
													<div className="text-[10px] font-semibold uppercase tracking-wider text-primary/60">Max</div>
													<div className="text-sm font-bold text-foreground">
														<Price value={priceValueMax} />
													</div>
												</div>
											</div>
										</div>
									</FilterSection>

									<button
										type="button"
										onClick={() => {
											setActiveCollection(defaultMenu);
											setInStock(true);
											setOutOfStock(false);
											setMinPrice(0);
											setMaxPrice(0);
											setPage(1);
										}}
										className="mt-6 inline-flex w-full items-center justify-center rounded-xl border-2 border-primary/20 bg-primary/5 px-4 py-2 text-sm font-bold text-primary transition-all hover:bg-primary hover:text-white"
									>
										Reset filters
									</button>
								</div>
							</aside>

							{/* Right grid */}
							<div>
								<div className="flex items-end justify-between gap-4">
									<div>
										<h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">Products</h2>
										<p className="mt-1 text-sm text-ink-muted">
											Page {safePage} of {pageCount} • {filtered.length} items
										</p>
									</div>
								</div>

								{paged.length === 0 ? (
									<div className="mt-6 rounded-2xl border bg-surface-2 p-6 text-sm text-ink-muted">
										No products match your filters.
									</div>
								) : (
									<div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
										{paged.map((p) => (
											<ProductCard key={p.id} product={p} />
										))}
									</div>
								)}

								{/* Pagination */}
								{pageCount > 1 && (
									<div className="mt-10 flex items-center justify-center gap-1.5">
										<button
											type="button"
											disabled={safePage <= 1}
											onClick={() => setPage((p) => Math.max(1, p - 1))}
											className="inline-flex h-10 w-10 items-center justify-center rounded-xl border text-sm transition-all disabled:pointer-events-none disabled:opacity-40 hover:bg-primary hover:text-white hover:border-primary"
										>
											<ChevronLeft className="h-4 w-4" />
										</button>

										{Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => {
											const active = n === safePage;
											return (
												<button
													key={n}
													type="button"
													onClick={() => setPage(n)}
													className={
														"inline-flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-bold transition-all duration-200 " +
														(active
															? "border-primary bg-primary text-white shadow-md shadow-primary/30"
															: "border-border bg-background text-foreground/70 hover:border-primary hover:bg-primary/10 hover:text-primary")
													}
													aria-current={active ? "page" : undefined}
												>
													{n}
												</button>
											);
										})}

										<button
											type="button"
											disabled={safePage >= pageCount}
											onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
											className="inline-flex h-10 w-10 items-center justify-center rounded-xl border text-sm transition-all disabled:pointer-events-none disabled:opacity-40 hover:bg-primary hover:text-white hover:border-primary"
										>
											<ChevronRight className="h-4 w-4" />
										</button>
									</div>
								)}
							</div>
						</div>

						{/* Recently viewed */}
						<div className="mt-14">
							<div className="mb-4">
								<h2 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
									Recently Viewed Products
								</h2>
								<p className="mt-1 text-sm text-ink-muted">আপনি সাম্প্রতিক যেগুলো দেখেছেন</p>
							</div>

							<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
								{recentlyViewed.map((p) => (
									<ProductCard key={p.id} product={p} />
								))}
							</div>
						</div>
					</div>
				</section>
			</main>

			<StoreFooter />
		</div>
	);
};

export default CategoryListing;
