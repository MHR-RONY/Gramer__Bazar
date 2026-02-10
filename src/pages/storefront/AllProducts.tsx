import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";
import { StoreHeader } from "@/components/storefront/StoreHeader";
import { StoreFooter } from "@/components/storefront/StoreFooter";
import { ProductCard } from "@/components/storefront/ProductCard";
import { demoProducts, categoryMenu, type StoreProductCategory } from "@/data/storefront";

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
				<h3 className="text-sm font-bold text-foreground">{title}</h3>
				{open ? (
					<ChevronUp className="h-4 w-4 text-muted-foreground" />
				) : (
					<ChevronDown className="h-4 w-4 text-muted-foreground" />
				)}
			</button>
			{open && <div className="mt-3 space-y-2.5">{children}</div>}
		</div>
	);
};

const AllProducts = () => {
	const [selectedCategories, setSelectedCategories] = useState<Set<StoreProductCategory>>(new Set());
	const [selectedAvailability, setSelectedAvailability] = useState<Set<Availability>>(new Set());
	const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc" | "discount">("default");
	const [showMobileFilter, setShowMobileFilter] = useState(false);

	useEffect(() => {
		window.scrollTo({ top: 0 });
	}, []);

	const categoryOptions = useMemo(() => {
		return categoryMenu
			.map((label) => {
				const cat = toCategory(label);
				if (!cat) return null;
				const count = demoProducts.filter((p) => p.category === cat).length;
				return { label, category: cat, count };
			})
			.filter(Boolean) as { label: string; category: StoreProductCategory; count: number }[];
	}, []);

	const toggleCategory = (cat: StoreProductCategory) => {
		setSelectedCategories((prev) => {
			const next = new Set(prev);
			if (next.has(cat)) next.delete(cat);
			else next.add(cat);
			return next;
		});
	};

	const toggleAvailability = (av: Availability) => {
		setSelectedAvailability((prev) => {
			const next = new Set(prev);
			if (next.has(av)) next.delete(av);
			else next.add(av);
			return next;
		});
	};

	const filtered = useMemo(() => {
		let list = [...demoProducts];

		if (selectedCategories.size > 0) {
			list = list.filter((p) => selectedCategories.has(p.category));
		}
		if (selectedAvailability.size > 0) {
			list = list.filter((p) => selectedAvailability.has(p.stock));
		}

		switch (sortBy) {
			case "price-asc":
				list.sort((a, b) => a.discountedPrice - b.discountedPrice);
				break;
			case "price-desc":
				list.sort((a, b) => b.discountedPrice - a.discountedPrice);
				break;
			case "discount":
				list.sort((a, b) => b.discountPercent - a.discountPercent);
				break;
		}

		return list;
	}, [selectedCategories, selectedAvailability, sortBy]);

	const inStockCount = demoProducts.filter((p) => p.stock === "in").length;
	const outStockCount = demoProducts.filter((p) => p.stock === "out").length;

	const filterSidebar = (
		<div className="space-y-2">
			<FilterSection title="Category">
				{categoryOptions.map((opt) => (
					<StyledCheckbox
						key={opt.category}
						checked={selectedCategories.has(opt.category)}
						onChange={() => toggleCategory(opt.category)}
						label={opt.label}
						count={opt.count}
					/>
				))}
			</FilterSection>

			<FilterSection title="Availability">
				<StyledCheckbox
					checked={selectedAvailability.has("in")}
					onChange={() => toggleAvailability("in")}
					label="In Stock"
					count={inStockCount}
				/>
				<StyledCheckbox
					checked={selectedAvailability.has("out")}
					onChange={() => toggleAvailability("out")}
					label="Out of Stock"
					count={outStockCount}
				/>
			</FilterSection>

			<FilterSection title="Sort By">
				<select
					value={sortBy}
					onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
					className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground"
				>
					<option value="default">Default</option>
					<option value="price-asc">Price: Low → High</option>
					<option value="price-desc">Price: High → Low</option>
					<option value="discount">Biggest Discount</option>
				</select>
			</FilterSection>
		</div>
	);

	return (
		<div className="min-h-screen bg-background text-foreground">
			<StoreHeader />
			<main className="container py-8 pb-24 lg:pb-8">
				<div className="mb-6 flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">All Products</h1>
						<p className="mt-1 text-sm text-muted-foreground">
							সব পণ্য — {filtered.length} products found
						</p>
					</div>
					<button
						type="button"
						className="inline-flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-accent lg:hidden"
						onClick={() => setShowMobileFilter((v) => !v)}
					>
						<SlidersHorizontal className="h-4 w-4" />
						Filter
					</button>
				</div>

				{/* Mobile filter drawer */}
				{showMobileFilter && (
					<div className="mb-6 rounded-xl border bg-card p-4 lg:hidden">
						{filterSidebar}
					</div>
				)}

				<div className="flex gap-8">
					{/* Desktop sidebar */}
					<aside className="hidden w-60 shrink-0 lg:block">
						<div className="sticky top-28 rounded-xl border bg-card p-4">
							{filterSidebar}
						</div>
					</aside>

					{/* Product grid */}
					<div className="flex-1">
						{filtered.length === 0 ? (
							<div className="rounded-xl border bg-card p-10 text-center">
								<p className="text-sm font-semibold text-muted-foreground">No products found</p>
							</div>
						) : (
							<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4">
								{filtered.map((p) => (
									<ProductCard key={p.id} product={p} />
								))}
							</div>
						)}
					</div>
				</div>
			</main>
			<StoreFooter />
		</div>
	);
};

export default AllProducts;
