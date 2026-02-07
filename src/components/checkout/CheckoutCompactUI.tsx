import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, Truck } from "lucide-react";
import type { CartItem } from "@/components/storefront/cart/CartProvider";

type PaymentChoice = "cod" | "online";
export type DeliveryChoice = "courier" | "pickup";

type PriceProps = { value: number };
const Price = ({ value }: PriceProps) => (
  <span className="tabular-nums">৳{value.toLocaleString("en-US", { maximumFractionDigits: 0 })}</span>
);

const Field = ({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <div>
    <label className="text-sm font-semibold">
      {label}
      {required ? <span className="ml-1 text-destructive">*</span> : null}
    </label>
    <div className="mt-2">{children}</div>
  </div>
);

const Tile = ({
  title,
  subtitle,
  active,
  onClick,
  icon,
}: {
  title: string;
  subtitle?: string;
  active: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={cn(
      "relative w-full rounded-xl border p-4 text-left transition-colors",
      active ? "border-primary bg-accent" : "bg-background hover:bg-surface-2",
    )}
  >
    <div className="flex items-start gap-3">
      <div
        className={cn(
          "mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-lg border",
          active ? "border-primary bg-background" : "border-border bg-background",
        )}
      >
        {icon ?? <Check className={cn("h-5 w-5", active ? "text-primary" : "text-foreground/60")} />}
      </div>
      <div className="min-w-0">
        <div className="text-sm font-extrabold text-foreground">{title}</div>
        {subtitle ? <div className="mt-0.5 text-xs text-ink-muted">{subtitle}</div> : null}
      </div>
    </div>

    <div
      className={cn(
        "absolute right-3 top-3 h-4 w-4 rounded-full border",
        active ? "border-primary bg-primary" : "border-border bg-background",
      )}
    />
  </button>
);

export type CheckoutCompactForm = {
  name: string;
  phone: string;
  email: string;
  division: string;
  district: string;
  upazila: string;
  postCode: string;
  address: string;
  coupon: string;
  agreeTerms: boolean;
  paymentChoice: PaymentChoice;
  deliveryChoice: DeliveryChoice;
};

export function CheckoutCompactUI({
  form,
  setForm,
  errors,
  items,
  subtotal,
  total,
  count,
  onPlaceOrder,
  deliveryFeeLabel = "will be added",
}: {
  form: CheckoutCompactForm;
  setForm: (updater: (prev: CheckoutCompactForm) => CheckoutCompactForm) => void;
  errors: Record<string, string>;
  items: CartItem[];
  subtotal: number;
  total: number;
  count: number;
  onPlaceOrder: () => void;
  deliveryFeeLabel?: string;
}) {
  const firstItem = items[0];

  return (
    <main className="bg-background">
      <section className="container py-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
          {/* Left */}
          <section className="rounded-2xl border bg-card p-5">
            <h1 className="text-balance text-2xl font-extrabold tracking-tight sm:text-3xl">
              Checkout & Confirm Order
            </h1>

            <div className="mt-4 rounded-xl border bg-accent p-3 text-sm text-foreground">
              অর্ডার সংক্রান্ত যেকোনো প্রয়োজনে কথা বলুন আমাদের কাস্টমার সার্ভিস প্রতিনিধির সাথে - 09678148148
            </div>

            <div className="mt-6">
              <div className="text-base font-extrabold tracking-tight">Delivery Information</div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="Full Name" required>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                    placeholder="Enter full name"
                    maxLength={100}
                    autoComplete="name"
                  />
                  {errors.name ? <div className="mt-1 text-xs font-semibold text-destructive">{errors.name}</div> : null}
                </Field>

                <Field label="Email">
                  <input
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                    placeholder="Enter Email"
                    maxLength={255}
                    inputMode="email"
                    autoComplete="email"
                  />
                </Field>

                <Field label="Phone Number" required>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                    className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                    placeholder="Enter phone number"
                    maxLength={20}
                    inputMode="tel"
                    autoComplete="tel"
                  />
                  {errors.phone ? <div className="mt-1 text-xs font-semibold text-destructive">{errors.phone}</div> : null}
                </Field>

                <Field label="Division" required>
                  <select
                    value={form.division}
                    onChange={(e) => setForm((p) => ({ ...p, division: e.target.value }))}
                    className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                  >
                    <option value="">Select your division</option>
                    <option value="Dhaka">Dhaka</option>
                    <option value="Chattogram">Chattogram</option>
                    <option value="Khulna">Khulna</option>
                    <option value="Rajshahi">Rajshahi</option>
                    <option value="Sylhet">Sylhet</option>
                    <option value="Barishal">Barishal</option>
                    <option value="Rangpur">Rangpur</option>
                    <option value="Mymensingh">Mymensingh</option>
                  </select>
                </Field>

                <Field label="District" required>
                  <input
                    value={form.district}
                    onChange={(e) => setForm((p) => ({ ...p, district: e.target.value }))}
                    className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                    placeholder="Select your city"
                    maxLength={80}
                  />
                </Field>

                <Field label="Upazila" required>
                  <input
                    value={form.upazila}
                    onChange={(e) => setForm((p) => ({ ...p, upazila: e.target.value }))}
                    className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                    placeholder="Select your area"
                    maxLength={80}
                  />
                </Field>

                <Field label="Post Code">
                  <input
                    value={form.postCode}
                    onChange={(e) => setForm((p) => ({ ...p, postCode: e.target.value }))}
                    className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                    placeholder="Enter Post Code"
                    maxLength={20}
                    inputMode="numeric"
                  />
                </Field>

                <Field label="Address" required>
                  <input
                    value={form.address}
                    onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                    className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                    placeholder="For ex: House: 23, Road: 24, Block: B"
                    maxLength={300}
                    autoComplete="street-address"
                  />
                  {errors.address ? (
                    <div className="mt-1 text-xs font-semibold text-destructive">{errors.address}</div>
                  ) : null}
                </Field>
              </div>
            </div>

            <div className="mt-7 grid gap-6 sm:grid-cols-2">
              <div>
                <div className="text-base font-extrabold tracking-tight">Payment Method</div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <Tile
                    title="Cash on Delivery"
                    active={form.paymentChoice === "cod"}
                    onClick={() => setForm((p) => ({ ...p, paymentChoice: "cod" }))}
                  />
                  <Tile
                    title="Online Payment"
                    active={form.paymentChoice === "online"}
                    onClick={() => setForm((p) => ({ ...p, paymentChoice: "online" }))}
                  />
                </div>
              </div>

              <div>
                <div className="text-base font-extrabold tracking-tight">Delivery Method</div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <Tile
                    title="Courier Service"
                    active={form.deliveryChoice === "courier"}
                    onClick={() => setForm((p) => ({ ...p, deliveryChoice: "courier" }))}
                    icon={<Truck className={cn("h-5 w-5", form.deliveryChoice === "courier" ? "text-primary" : "text-foreground/60")} />}
                  />
                  <Tile
                    title="Shop Pickup"
                    active={form.deliveryChoice === "pickup"}
                    onClick={() => setForm((p) => ({ ...p, deliveryChoice: "pickup" }))}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Right */}
          <aside className="self-start lg:sticky lg:top-28">
            <div className="rounded-2xl border bg-card p-5">
              <div className="text-lg font-extrabold tracking-tight">Order Summary</div>

              {items.length === 0 ? (
                <div className="mt-4 rounded-xl border bg-surface-2 p-4 text-sm text-ink-muted">Cart empty.</div>
              ) : (
                <div className="mt-4 flex items-center gap-3 rounded-xl border bg-background p-3">
                  <img
                    src={firstItem?.imageUrl}
                    alt={firstItem?.name ?? "Product"}
                    className="h-12 w-12 shrink-0 rounded-lg object-cover"
                    loading="lazy"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="line-clamp-2 text-sm font-extrabold text-foreground">{firstItem?.name}</div>
                    <div className="mt-0.5 text-xs text-ink-muted">{count} quantity</div>
                  </div>
                </div>
              )}

              <div className="mt-6">
                <div className="text-sm font-extrabold">Apply Coupon</div>
                <div className="mt-2 flex gap-2">
                  <input
                    value={form.coupon}
                    onChange={(e) => setForm((p) => ({ ...p, coupon: e.target.value }))}
                    className="h-10 w-full rounded-full border bg-background px-4 text-sm"
                    placeholder="Apply Coupon"
                    maxLength={30}
                  />
                  <Button type="button" className="shrink-0 rounded-full px-5" variant="default">
                    Apply Coupon
                  </Button>
                </div>
              </div>

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <div className="text-ink-muted">Sub Total ({count} items)</div>
                  <div className="font-extrabold">
                    <Price value={subtotal} />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-ink-muted">Delivery</div>
                  <div className="text-xs text-ink-muted">{deliveryFeeLabel}</div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-ink-muted">Discount</div>
                  <div className="font-extrabold">
                    <Price value={0} />
                  </div>
                </div>

                <div className="border-t pt-3">
                  <div className="flex items-center justify-between">
                    <div className="text-base font-extrabold">Total Amount</div>
                    <div className="text-base font-extrabold">
                      <Price value={total} />
                    </div>
                  </div>
                </div>
              </div>

              <label className="mt-5 flex items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={form.agreeTerms}
                  onChange={(e) => setForm((p) => ({ ...p, agreeTerms: e.target.checked }))}
                  className="mt-1 h-4 w-4 rounded border-input accent-[hsl(var(--primary))]"
                />
                <span className="text-foreground/80">
                  I have read & agree to the website{" "}
                  <a className="text-primary underline-offset-4 hover:underline" href="#">
                    Terms and Conditions
                  </a>
                </span>
              </label>

              {errors.cart ? (
                <div className="mt-4 rounded-xl border bg-accent p-3 text-sm font-semibold text-foreground">
                  Your cart is empty. Please add products first.
                </div>
              ) : null}

              {!form.agreeTerms ? (
                <div className="mt-3 text-xs text-ink-muted">Confirm করার আগে Terms accept করুন।</div>
              ) : null}

              <Button
                type="button"
                className="mt-5 w-full rounded-full py-6 text-base font-extrabold"
                onClick={onPlaceOrder}
                disabled={items.length === 0 || !form.agreeTerms}
              >
                Confirm & Place Order
              </Button>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
