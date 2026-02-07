import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { ProductCard } from "@/components/storefront/ProductCard";
import type { StoreProduct } from "@/data/storefront";

export const ProductGridSection = ({
	title,
	subtitle,
	products,
	tone = "default",
}: {
	title: string;
	subtitle?: string;
	products: StoreProduct[];
	tone?: "default" | "muted";
}) => {
	const scrollRef = useRef<HTMLDivElement>(null);
	const isDragging = useRef(false);
	const startX = useRef(0);
	const scrollLeft = useRef(0);
	const [dragged, setDragged] = useState(false);

	const scroll = (dir: "left" | "right") => {
		if (!scrollRef.current) return;
		const cardWidth = scrollRef.current.firstElementChild?.clientWidth ?? 260;
		const distance = cardWidth + 16;
		scrollRef.current.scrollBy({
			left: dir === "left" ? -distance : distance,
			behavior: "smooth",
		});
	};

	const onPointerDown = useCallback((e: React.PointerEvent) => {
		const el = scrollRef.current;
		if (!el) return;
		isDragging.current = true;
		setDragged(false);
		startX.current = e.clientX;
		scrollLeft.current = el.scrollLeft;
		el.setPointerCapture(e.pointerId);
		el.style.scrollBehavior = "auto";
		el.style.cursor = "grabbing";
	}, []);

	const onPointerMove = useCallback((e: React.PointerEvent) => {
		if (!isDragging.current || !scrollRef.current) return;
		const dx = e.clientX - startX.current;
		if (Math.abs(dx) > 3) setDragged(true);
		scrollRef.current.scrollLeft = scrollLeft.current - dx;
	}, []);

	const onPointerUp = useCallback((e: React.PointerEvent) => {
		const el = scrollRef.current;
		if (!el) return;
		isDragging.current = false;
		el.releasePointerCapture(e.pointerId);
		el.style.scrollBehavior = "smooth";
		el.style.cursor = "";
	}, []);

	return (
		<section className={tone === "muted" ? "bg-surface-2" : "bg-background"}>
			<div className="container py-10">
				<div className="mb-6 flex items-end justify-between gap-4">
					<div>
						<h2 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
							{title}
						</h2>
						{subtitle ? <p className="mt-1 text-sm text-ink-muted">{subtitle}</p> : null}
					</div>

					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={() => scroll("left")}
							className="inline-flex h-9 w-9 items-center justify-center rounded-full border bg-background text-foreground/70 shadow-sm transition-colors hover:bg-accent hover:text-foreground"
							aria-label="Scroll left"
						>
							<ChevronLeft className="h-5 w-5" />
						</button>
						<button
							type="button"
							onClick={() => scroll("right")}
							className="inline-flex h-9 w-9 items-center justify-center rounded-full border bg-background text-foreground/70 shadow-sm transition-colors hover:bg-accent hover:text-foreground"
							aria-label="Scroll right"
						>
							<ChevronRight className="h-5 w-5" />
						</button>
					</div>
				</div>

				<div
					ref={scrollRef}
					onPointerDown={onPointerDown}
					onPointerMove={onPointerMove}
					onPointerUp={onPointerUp}
					onPointerCancel={onPointerUp}
					className="scrollbar-hide flex cursor-grab items-stretch gap-4 overflow-x-auto scroll-smooth select-none touch-pan-x"
				>
					{products.map((p) => (
						<div
							key={p.id}
							className="flex w-[200px] shrink-0 sm:w-[220px] lg:w-[240px]"
							onClickCapture={(e) => { if (dragged) e.preventDefault(); }}
						>
							<ProductCard product={p} />
						</div>
					))}
				</div>
			</div>
		</section>
	);
};
