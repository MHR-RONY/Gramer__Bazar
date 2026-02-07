import { demoProducts } from "@/data/storefront";
import { ProductGridSection } from "@/components/storefront/ProductGridSection";

export const BestSellerSection = () => {
	const bestSellers = demoProducts
		.filter((p) => p.category === "Best Seller");

	return (
		<ProductGridSection
			tone="muted"
			title="BEST SELLER"

			products={bestSellers}
		/>
	);
};
