import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef } from "react";
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
	const scrollLeftStart = useRef(0);
	const hasMoved = useRef(false);

	const scroll = (dir: "left" | "right") => {
		if (!scrollRef.current) return;
		const cardWidth = scrollRef.current.firstElementChild?.clientWidth ?? 260;
		const distance = cardWidth + 16;
		scrollRef.current.scrollBy({
			left: dir === "left" ? -distance : distance,
			behavior: "smooth",
		});
	};

	// Attach drag listeners on the document so drag works even when pointer leaves container
	useEffect(() => {
		const el = scrollRef.current;
		if (!el) return;

		const onMouseDown = (e: MouseEvent) => {
			// Ignore clicks on buttons/links — let them work normally
			const target = e.target as HTMLElement;
			if (target.closest("a") || target.closest("button")) return;

			isDragging.current = true;
			hasMoved.current = false;
			startX.current = e.pageX;
			scrollLeftStart.current = el.scrollLeft;
			el.style.cursor = "grabbing";
		};

		const onMouseMove = (e: MouseEvent) => {
			if (!isDragging.current) return;
			const dx = e.pageX - startX.current;
			if (Math.abs(dx) > 5) hasMoved.current = true;
			el.scrollLeft = scrollLeftStart.current - dx;
		};

		const onMouseUp = () => {
			if (!isDragging.current) return;
			isDragging.current = false;
			el.style.cursor = "grab";
		};

		// Block clicks that follow a drag (on images, etc.)
		const onClickCapture = (e: MouseEvent) => {
			if (hasMoved.current) {
				e.preventDefault();
				e.stopPropagation();
				hasMoved.current = false;
			}
		};

		el.addEventListener("mousedown", onMouseDown);
		document.addEventListener("mousemove", onMouseMove);
		document.addEventListener("mouseup", onMouseUp);
		el.addEventListener("click", onClickCapture, true);

		return () => {
			el.removeEventListener("mousedown", onMouseDown);
			document.removeEventListener("mousemove", onMouseMove);
			document.removeEventListener("mouseup", onMouseUp);
			el.removeEventListener("click", onClickCapture, true);
		};
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
					className="scrollbar-hide flex cursor-grab items-stretch gap-4 overflow-x-auto touch-pan-x"
				>
					{products.map((p) => (
						<div
							key={p.id}
							className="flex w-[200px] shrink-0 sm:w-[220px] lg:w-[240px]"
						>
							<ProductCard product={p} />
						</div>
					))}
				</div>
			</div>
		</section>
	);
};
