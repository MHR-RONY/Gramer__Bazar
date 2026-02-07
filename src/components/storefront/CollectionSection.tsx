import { demoCollections } from "@/data/storefront";
import { CollectionCard } from "@/components/storefront/CollectionCard";

export const CollectionSection = () => {
  return (
    <section className="bg-surface-2">
      <div className="container py-10">
        <div className="mb-6">
          <h2 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
            COLLECTION
          </h2>
          <p className="mt-1 text-sm text-ink-muted">ক্যাটাগরি ব্রাউজ</p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {demoCollections.map((c) => (
            <CollectionCard key={c.id} collection={c} />
          ))}
        </div>
      </div>
    </section>
  );
};
