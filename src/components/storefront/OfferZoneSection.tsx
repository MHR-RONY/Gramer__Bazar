import { demoProducts } from "@/data/storefront";
import { ProductGridSection } from "@/components/storefront/ProductGridSection";
import { defaultContentConfig, readContentConfig } from "@/data/storefront/content";
import { useEffect, useState } from "react";

export const OfferZoneSection = () => {
	const [content, setContent] = useState(defaultContentConfig);

	useEffect(() => {
		setContent(readContentConfig());
	}, []);

	const offerProducts = demoProducts
		.filter((p) => p.category === "Offer Zone");

	return (
		<div>
			<ProductGridSection
				title="OFFER PRODUCTS"
				products={offerProducts}
			/>
		</div>
	);
};
