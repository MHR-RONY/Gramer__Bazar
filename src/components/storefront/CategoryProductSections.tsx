import { demoProducts, type StoreProductCategory } from "@/data/storefront";
import { ProductGridSection } from "@/components/storefront/ProductGridSection";

const groups: { title: string; subtitle: string; category: StoreProductCategory }[] = [
	{ title: "OIL", subtitle: "", category: "Oil" },
	{ title: "GHEE (ঘি)", subtitle: "", category: "Ghee" },
	{ title: "HONEY (মধু)", subtitle: "", category: "Honey" },
	{ title: "DATES (খেজুর)", subtitle: "", category: "Dates" },
];

export const CategoryProductSections = () => {
	return (
		<div>
			{groups.map((g, idx) => {
				const products = demoProducts.filter((p) => p.category === g.category);
				return (
					<ProductGridSection
						key={g.title}
						tone={idx % 2 === 0 ? "default" : "muted"}
						title={g.title}
						subtitle={g.subtitle}
						products={products}
					/>
				);
			})}
		</div>
	);
};
