import { StoreHeader } from "@/components/storefront/StoreHeader";
import { HeroBanner } from "@/components/storefront/HeroBanner";
import { TrustStrip } from "@/components/storefront/TrustStrip";
import { OfferZoneSection } from "@/components/storefront/OfferZoneSection";
import { BestSellerSection } from "@/components/storefront/BestSellerSection";
import { CategoryProductSections } from "@/components/storefront/CategoryProductSections";
import { ProductListingSection } from "@/components/storefront/ProductListingSection";
import { CollectionSection } from "@/components/storefront/CollectionSection";
import { StoreFooter } from "@/components/storefront/StoreFooter";

const Index = () => {
	return (
		<div className="min-h-screen bg-background text-foreground">
			<StoreHeader />
			<main>
				<HeroBanner />
				<TrustStrip />
				<OfferZoneSection />
				<BestSellerSection />
				<CategoryProductSections />
				<ProductListingSection />
				<CollectionSection />
			</main>
			<StoreFooter />
		</div>
	);
};

export default Index;

