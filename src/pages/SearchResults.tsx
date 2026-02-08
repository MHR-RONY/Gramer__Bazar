import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal } from "lucide-react";
import { StoreHeader } from "@/components/storefront/StoreHeader";
import { StoreFooter } from "@/components/storefront/StoreFooter";
import { ProductCard } from "@/components/storefront/ProductCard";
import { demoProducts } from "@/data/storefront";

const PAGE_SIZE = 16;

const SearchResults = () => {
	const [searchParams] = useSearchParams();
	const query = searchParams.get("q")?.trim() ?? "";
	const [page, setPage] = useState(1);

	/* Reset page when query changes */
	useEffect(() => {
		setPage(1);
	}, [query]);

	/* Scroll to top on page change */
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, [page]);

	const results = useMemo(() => {
		if (query.length < 1) return [];
		const q = query.toLowerCase();
		return demoProducts.filter(
			(p) =>
				p.name.toLowerCase().includes(q) ||
				p.category.toLowerCase().includes(q)
		);
	}, [query]);

	const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
	const safePage = Math.min(page, pageCount);

	const paged = useMemo(() => {
		const start = (safePage - 1) * PAGE_SIZE;
		return results.slice(start, start + PAGE_SIZE);
	}, [results, safePage]);

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
									<div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
										<Search className="h-3.5 w-3.5" />
										Search results
									</div>
									<h1 className="mt-3 text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">
										{query ? (
											<>
												Results for "<span className="text-primary">{query}</span>"
											</>
										) : (
											"Search Products"
										)}
									</h1>
									<p className="mt-2 max-w-2xl text-sm text-ink-muted sm:text-base">
										{results.length > 0
											? `আপনার সার্চে ${results.length}টি পণ্য পাওয়া গেছে।`
											: query
												? `"${query}" দিয়ে কোনো পণ্য পাওয়া যায়নি। অন্য কিছু দিয়ে চেষ্টা করুন।`
												: "Search bar এ আপনার পছন্দের পণ্যের নাম লিখুন।"}
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
											Showing{" "}
											<span className="font-bold text-foreground">{results.length}</span>{" "}
											products
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Products Grid */}
				<section className="container py-8">
					{paged.length > 0 ? (
						<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
							{paged.map((p) => (
								<ProductCard key={p.id} product={p} />
							))}
						</div>
					) : query ? (
						<div className="flex flex-col items-center justify-center py-24 text-center">
							<Search className="h-16 w-16 text-muted-foreground/30" />
							<h2 className="mt-4 text-xl font-bold text-foreground">No products found</h2>
							<p className="mt-2 text-sm text-muted-foreground">
								Try searching with different keywords
							</p>
						</div>
					) : null}

					{/* Pagination */}
					{pageCount > 1 && (
						<div className="mt-10 flex items-center justify-center gap-2">
							<button
								type="button"
								disabled={safePage <= 1}
								onClick={() => setPage((p) => Math.max(1, p - 1))}
								className="inline-flex h-9 w-9 items-center justify-center rounded-lg border bg-background text-foreground transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-40"
							>
								<ChevronLeft className="h-4 w-4" />
							</button>

							{Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
								<button
									key={n}
									type="button"
									onClick={() => setPage(n)}
									className={
										"inline-flex h-9 min-w-[2.25rem] items-center justify-center rounded-lg border text-sm font-semibold transition-colors " +
										(n === safePage
											? "border-primary bg-primary text-primary-foreground"
											: "bg-background text-foreground hover:bg-accent")
									}
								>
									{n}
								</button>
							))}

							<button
								type="button"
								disabled={safePage >= pageCount}
								onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
								className="inline-flex h-9 w-9 items-center justify-center rounded-lg border bg-background text-foreground transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-40"
							>
								<ChevronRight className="h-4 w-4" />
							</button>
						</div>
					)}
				</section>
			</main>

			<StoreFooter />
		</div>
	);
};

export default SearchResults;
