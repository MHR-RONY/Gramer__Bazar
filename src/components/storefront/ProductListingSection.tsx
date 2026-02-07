import { demoProducts } from "@/data/storefront";
import { ProductGridSection } from "@/components/storefront/ProductGridSection";

export const ProductListingSection = () => {
  return (
    <ProductGridSection
      title="ALL PRODUCT"
      subtitle="সব পণ্য"
      products={demoProducts}
    />
  );
};

