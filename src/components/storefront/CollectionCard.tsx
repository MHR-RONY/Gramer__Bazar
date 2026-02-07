import type { StoreCollection } from "@/data/storefront";

export const CollectionCard = ({ collection }: { collection: StoreCollection }) => {
  return (
    <button
      type="button"
      className="group overflow-hidden rounded-xl border bg-card text-left shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative">
        <img
          src={collection.imageUrl}
          alt={collection.title}
          loading="lazy"
          className="h-36 w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/15 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <div className="inline-flex rounded-md bg-background/90 px-3 py-2 text-sm font-extrabold text-foreground">
            {collection.title}
          </div>
        </div>
      </div>
    </button>
  );
};
