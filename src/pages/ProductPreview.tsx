import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft, Minus, PhoneCall, Plus, ShoppingCart } from "lucide-react";
import { demoProducts } from "@/data/storefront";
import { StoreHeader } from "@/components/storefront/StoreHeader";
import { StoreFooter } from "@/components/storefront/StoreFooter";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/storefront/ProductCard";
import { useCart } from "@/components/storefront/cart/CartProvider";

const Price = ({ value }: { value: number }) => (
  <span className="tabular-nums">৳{value.toLocaleString("en-US", { maximumFractionDigits: 0 })}</span>
);

const RECENTS_KEY = "gb_recently_viewed_v1";

const readRecentIds = (): string[] => {
  try {
    const raw = localStorage.getItem(RECENTS_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
};

const writeRecentIds = (ids: string[]) => {
  try {
    localStorage.setItem(RECENTS_KEY, JSON.stringify(ids.slice(0, 12)));
  } catch {
    // ignore
  }
};

const ProductPreview = () => {
  const { id } = useParams();
  const { addItem, openCart } = useCart();

  const product = useMemo(() => demoProducts.find((p) => p.id === id), [id]);

  const [variant, setVariant] = useState<string>("500g");
  const [qty, setQty] = useState<number>(1);

  useEffect(() => {
    if (!product) return;
    const prev = readRecentIds();
    const next = [product.id, ...prev.filter((x) => x !== product.id)];
    writeRecentIds(next);
  }, [product]);

  const recentlyViewed = useMemo(() => {
    const ids = readRecentIds();
    const list = ids
      .filter((pid) => pid !== product?.id)
      .map((pid) => demoProducts.find((p) => p.id === pid))
      .filter((p): p is NonNullable<typeof p> => Boolean(p));
    return list.slice(0, 5);
  }, [product?.id]);

  const youMightAlsoLike = useMemo(() => {
    if (!product) return [];
    return demoProducts
      .filter((p) => p.id !== product.id && p.category === product.category)
      .slice(0, 5);
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <StoreHeader />
        <main className="container py-10">
          <div className="rounded-2xl border bg-card p-6">
            <div className="text-sm font-extrabold">Product not found</div>
            <p className="mt-2 text-sm text-ink-muted">
              এই প্রোডাক্টটি পাওয়া যায়নি। নিচের বাটনে ক্লিক করে হোমপেজে যান।
            </p>
            <Link
              to="/"
              className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </main>
        <StoreFooter />
      </div>
    );
  }

  const inStock = product.stock === "in";

  const handleAddToCart = () => {
    if (!inStock) return;
    addItem({
      productId: product.id,
      name: product.name,
      imageUrl: product.imageUrl,
      variant,
      unitPrice: product.discountedPrice,
      quantity: qty,
    });
    openCart();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <StoreHeader />

      <main className="container py-8 lg:py-10">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-foreground/80 underline-offset-4 hover:text-foreground hover:underline"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Link>
        </div>

        <section className="grid gap-8 lg:grid-cols-2">
          <div className="self-start overflow-hidden rounded-2xl border bg-card lg:sticky lg:top-24">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-[320px] w-full object-cover sm:h-[420px] lg:h-[520px]"
              loading="lazy"
            />
          </div>

          <div>
            <div className="inline-flex rounded-full bg-accent px-3 py-1 text-xs font-semibold text-foreground">
              {product.category}
            </div>

            <h1 className="mt-3 text-balance text-2xl font-extrabold tracking-tight sm:text-3xl">
              {product.name}
            </h1>

            <div className="mt-3 flex items-baseline gap-3">
              <div className="text-2xl font-extrabold">
                <Price value={product.discountedPrice} />
              </div>
              <div className="text-sm text-muted-foreground line-through">
                <Price value={product.originalPrice} />
              </div>
              <div className="rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground">
                {product.discountPercent}% OFF
              </div>
            </div>

            <div className="mt-4">
              <span
                className={
                  "inline-flex rounded-full px-3 py-1 text-xs font-semibold " +
                  (inStock ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground")
                }
              >
                {inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            <div className="mt-6 rounded-2xl border bg-surface-2 p-4">
              <div className="text-sm font-extrabold">Select Variant</div>

              <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-xs font-semibold text-ink-muted">Quantity</div>
                  <div className="mt-2 inline-flex items-center gap-2 rounded-lg border bg-background p-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="h-9 w-9"
                      aria-label="Decrease quantity"
                    >
                      <Minus />
                    </Button>
                    <div className="min-w-12 text-center text-sm font-extrabold tabular-nums">{qty}</div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setQty((q) => q + 1)}
                      className="h-9 w-9"
                      aria-label="Increase quantity"
                    >
                      <Plus />
                    </Button>
                  </div>
                </div>

                <div className="sm:text-right">
                  <div className="text-xs font-semibold text-ink-muted">Weight</div>
                  <ToggleGroup
                    type="single"
                    value={variant}
                    onValueChange={(v) => (v ? setVariant(v) : null)}
                    className="mt-2 justify-start sm:justify-end"
                  >
                    <ToggleGroupItem value="500g" aria-label="500g">
                      500g
                    </ToggleGroupItem>
                    <ToggleGroupItem value="1kg" aria-label="1kg">
                      1kg
                    </ToggleGroupItem>
                    <ToggleGroupItem value="2kg" aria-label="2kg">
                      2kg
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm">
                <div className="text-ink-muted">Total</div>
                <div className="text-base font-extrabold">
                  <Price value={product.discountedPrice * qty} />
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                disabled={!inStock}
                onClick={handleAddToCart}
                className={
                  "inline-flex w-full items-center justify-center gap-2 rounded-md px-4 py-3 text-sm font-semibold transition-colors " +
                  (inStock
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "cursor-not-allowed bg-muted text-muted-foreground")
                }
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </button>

              <button
                type="button"
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-foreground px-4 py-3 text-sm font-semibold text-background transition-colors hover:bg-foreground/90"
              >
                <PhoneCall className="h-4 w-4" />
                Call / WhatsApp
              </button>
            </div>

            <p className="mt-4 text-xs text-ink-muted">
              নোট: ডেলিভারি ও সার্ভিস সম্পর্কিত বিস্তারিত তথ্য নিচে দেওয়া আছে।
            </p>
          </div>
        </section>

        {/* Detailed description (separate + bigger) */}
        <section className="mt-10">
          <div className="rounded-2xl border bg-surface-2 p-6 sm:p-8">
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              Detailed Description
            </h2>
            <p className="mt-3 text-base leading-relaxed text-ink-muted sm:text-lg">
              এই প্রোডাক্টটির বিস্তারিত তথ্য—উৎস, প্রসেসিং, নিউট্রিশন এবং ডেলিভারি/রিটার্ন সংক্রান্ত
              গাইড—এখানে দেওয়া আছে।
            </p>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div>
                <div className="text-sm font-extrabold text-foreground">Highlights</div>
                <ul className="mt-3 space-y-2 text-sm text-ink-muted">
                  <li>• ব্যবহার: দৈনন্দিন রান্না/খাবারে</li>
                  <li>• সংরক্ষণ: ঠান্ডা ও শুকনো স্থানে রাখুন</li>
                  <li>• ভ্যারিয়েন্ট: 500g / 1kg / 2kg</li>
                  <li>• ডেলিভারি: ঢাকার ভিতরে দ্রুত</li>
                </ul>
              </div>

              <div>
                <div className="text-sm font-extrabold text-foreground">More details</div>
                <p className="mt-3 text-sm leading-7 text-ink-muted">
                  আপনার ব্র্যান্ড অনুযায়ী এখানে origin story, quality check, nutrition info, এবং FAQ-style
                  তথ্য যোগ করা যাবে।
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* You might also like */}
        <section className="mt-12">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
                You might also like
              </h2>
              <p className="mt-1 text-sm text-ink-muted">একই ক্যাটাগরির আরও কিছু পণ্য</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {youMightAlsoLike.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        {/* Recently viewed */}
        <section className="mt-12">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
                Recently Viewed Products
              </h2>
              <p className="mt-1 text-sm text-ink-muted">আপনি সাম্প্রতিক যেগুলো দেখেছেন</p>
            </div>
          </div>

          {recentlyViewed.length === 0 ? (
            <div className="rounded-2xl border bg-surface-2 p-6 text-sm text-ink-muted">
              No recently viewed products yet.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {recentlyViewed.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>
      </main>

      <StoreFooter />
    </div>
  );
};

export default ProductPreview;
