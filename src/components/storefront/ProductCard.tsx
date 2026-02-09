import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { StoreProduct } from "@/data/storefront";
import { useCart } from "@/components/storefront/cart/CartProvider";

const Price = ({ value }: { value: number }) => {
	return (
		<span className="tabular-nums">
			৳{value.toLocaleString("en-US", { maximumFractionDigits: 0 })}
		</span>
	);
};

export const ProductCard = ({ product }: { product: StoreProduct }) => {
	const inStock = product.stock === "in";
	const { addItem, openCart } = useCart();
	const navigate = useNavigate();

	const handleAddToCart = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (!inStock) return;

		addItem({
			productId: product.id,
			name: product.name,
			imageUrl: product.imageUrl,
			variant: "500g",
			unitPrice: product.discountedPrice,
			quantity: 1,
		});

		openCart();
	};

	const goToProduct = () => {
		navigate(`/product/${product.id}`);
	};

	const handleBuyNow = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (!inStock) return;
		navigate(`/product/${product.id}`);
	};

	return (
		<article
			onClick={goToProduct}
			className="group flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md select-none"
			style={{ WebkitUserSelect: "none" }}
		>
			<div className="relative aspect-[4/4] w-full overflow-hidden bg-muted">
				<img
					src={product.imageUrl}
					alt={product.name}
					className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 pointer-events-none"
					loading="lazy"
					draggable={false}
				/>
			</div>

			<div className="flex flex-1 flex-col p-3">
				{/* Category */}
				<p className="text-[10px] font-semibold uppercase tracking-wide text-primary">
					{product.category}
				</p>

				{/* Product name */}
				<p className="mt-1 line-clamp-1 text-sm font-semibold leading-5 text-foreground">
					{product.name}
				</p>

				{/* Price row + discount badge */}
				<div className="mt-2 flex items-center gap-2">
					<span className="text-base font-extrabold text-foreground">
						<Price value={product.discountedPrice} />
					</span>
					<span className="text-xs text-muted-foreground line-through">
						<Price value={product.originalPrice} />
					</span>
					<span className="ml-auto rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold text-primary">
						-{product.discountPercent}%
					</span>
				</div>

				{/* Buy Now + Cart icon */}
				<div className="mt-3 flex items-center gap-2">
					<button
						type="button"
						onClick={handleBuyNow}
						className={
							"flex-1 inline-flex items-center justify-center rounded-lg px-3 py-2 text-xs font-semibold transition-colors " +
							(inStock
								? "bg-primary text-primary-foreground hover:bg-primary/90"
								: "cursor-not-allowed bg-muted text-muted-foreground")
						}
					>
						Buy Now
					</button>
					<button
						type="button"
						disabled={!inStock}
						onClick={handleAddToCart}
						className={
							"inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors " +
							(inStock
								? "bg-accent text-foreground hover:bg-primary hover:text-primary-foreground"
								: "cursor-not-allowed bg-muted text-muted-foreground")
						}
						aria-label="Add to cart"
					>
						<ShoppingCart className="h-4 w-4" />
					</button>
				</div>
			</div>
		</article>
	);
};
