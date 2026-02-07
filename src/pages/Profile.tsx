import { useState } from "react";
import { StoreHeader } from "@/components/storefront/StoreHeader";
import { StoreFooter } from "@/components/storefront/StoreFooter";

const tabs = ["orders", "addresses", "profile", "settings"] as const;
type Tab = (typeof tabs)[number];

const demoOrders = [
  {
    id: "GB-1001",
    date: "2025-02-01",
    total: 1499,
    status: "Processing",
  },
  {
    id: "GB-0998",
    date: "2025-01-23",
    total: 899,
    status: "Delivered",
  },
];

const demoAddresses = [
  {
    label: "Home",
    name: "Demo User",
    phone: "+8801XXXXXXXXX",
    address: "House 23, Road 24, Block B, Dhaka",
    isDefault: true,
  },
  {
    label: "Office",
    name: "Demo User",
    phone: "+8801XXXXXXXXX",
    address: "Gulshan, Dhaka",
    isDefault: false,
  },
];

const ProfilePage = () => {
  const [active, setActive] = useState<Tab>("orders");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <StoreHeader />

      <main className="bg-background">
        <section className="border-b bg-surface-2">
          <div className="container py-6">
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">My Account</h1>
            <p className="mt-1 text-sm text-ink-muted">
              Manage your orders, delivery addresses, profile information and preferences.
            </p>
          </div>
        </section>

        <section className="bg-background">
          <div className="container py-8">
            <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
              {/* Left nav */}
              <aside className="self-start lg:sticky lg:top-24">
                <div className="rounded-2xl border bg-card p-4">
                  <div className="text-sm font-extrabold tracking-tight">Dashboard</div>
                  <nav className="mt-4 space-y-1 text-sm">
                    <button
                      type="button"
                      onClick={() => setActive("orders")}
                      className={
                        "flex w-full items-center justify-between rounded-md px-3 py-2 text-left transition-colors " +
                        (active === "orders"
                          ? "bg-accent font-extrabold text-foreground"
                          : "text-foreground/80 hover:bg-accent/70")
                      }
                    >
                      <span>Orders</span>
                      <span className="text-xs text-ink-muted">{demoOrders.length}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActive("addresses")}
                      className={
                        "flex w-full items-center justify-between rounded-md px-3 py-2 text-left transition-colors " +
                        (active === "addresses"
                          ? "bg-accent font-extrabold text-foreground"
                          : "text-foreground/80 hover:bg-accent/70")
                      }
                    >
                      <span>Addresses</span>
                      <span className="text-xs text-ink-muted">{demoAddresses.length}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActive("profile")}
                      className={
                        "w-full rounded-md px-3 py-2 text-left text-sm transition-colors " +
                        (active === "profile"
                          ? "bg-accent font-extrabold text-foreground"
                          : "text-foreground/80 hover:bg-accent/70")
                      }
                    >
                      Profile
                    </button>

                    <button
                      type="button"
                      onClick={() => setActive("settings")}
                      className={
                        "w-full rounded-md px-3 py-2 text-left text-sm transition-colors " +
                        (active === "settings"
                          ? "bg-accent font-extrabold text-foreground"
                          : "text-foreground/80 hover:bg-accent/70")
                      }
                    >
                      Settings
                    </button>
                  </nav>
                </div>
              </aside>

              {/* Right content */}
              <section className="space-y-6">
                {active === "orders" && (
                  <div className="rounded-2xl border bg-card p-5">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <h2 className="text-base font-extrabold tracking-tight">Your Orders</h2>
                        <p className="mt-1 text-xs text-ink-muted">
                          This is demo data for UI only. Real orders will show here later.
                        </p>
                      </div>
                    </div>

                    {demoOrders.length === 0 ? (
                      <div className="mt-4 rounded-xl border bg-surface-2 p-4 text-sm text-ink-muted">
                        No orders yet.
                      </div>
                    ) : (
                      <div className="mt-4 overflow-x-auto">
                        <table className="min-w-full text-left text-sm">
                          <thead className="border-b text-xs text-ink-muted">
                            <tr className="align-middle">
                              <th className="py-2 pr-4">Order ID</th>
                              <th className="py-2 pr-4">Date</th>
                              <th className="py-2 pr-4">Total</th>
                              <th className="py-2">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {demoOrders.map((o) => (
                              <tr key={o.id} className="border-b last:border-0">
                                <td className="py-2 pr-4 text-xs font-semibold text-foreground">{o.id}</td>
                                <td className="py-2 pr-4 text-xs text-ink-muted">{o.date}</td>
                                <td className="py-2 pr-4 text-xs font-semibold text-foreground">
                                  ৳{o.total.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                                </td>
                                <td className="py-2 text-xs">
                                  <span className="inline-flex rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground">
                                    {o.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {active === "addresses" && (
                  <div className="rounded-2xl border bg-card p-5">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <h2 className="text-base font-extrabold tracking-tight">Saved Addresses</h2>
                        <p className="mt-1 text-xs text-ink-muted">
                          Manage delivery locations. This is demo content only.
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      {demoAddresses.map((addr) => (
                        <div key={addr.label} className="rounded-xl border bg-background p-4 text-sm">
                          <div className="flex items-center justify-between gap-2">
                            <div className="font-extrabold text-foreground">{addr.label}</div>
                            {addr.isDefault ? (
                              <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-semibold text-secondary-foreground">
                                Default
                              </span>
                            ) : null}
                          </div>
                          <div className="mt-2 text-xs text-ink-muted">{addr.name}</div>
                          <div className="text-xs text-ink-muted">{addr.phone}</div>
                          <div className="mt-2 text-xs text-foreground/80">{addr.address}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {active === "profile" && (
                  <div className="rounded-2xl border bg-card p-5">
                    <h2 className="text-base font-extrabold tracking-tight">Profile</h2>
                    <p className="mt-1 text-xs text-ink-muted">
                      Static demo profile fields. Hook these to real data later.
                    </p>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div>
                        <div className="text-xs font-semibold text-ink-muted">Full Name</div>
                        <div className="mt-1 rounded-md border bg-background px-3 py-2 text-sm">
                          Demo User
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-ink-muted">Email</div>
                        <div className="mt-1 rounded-md border bg-background px-3 py-2 text-sm">
                          user@example.com
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-ink-muted">Phone</div>
                        <div className="mt-1 rounded-md border bg-background px-3 py-2 text-sm">
                          +8801XXXXXXXXX
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {active === "settings" && (
                  <div className="rounded-2xl border bg-card p-5">
                    <h2 className="text-base font-extrabold tracking-tight">Settings</h2>
                    <p className="mt-1 text-xs text-ink-muted">
                      Basic preferences for your account (frontend-only demo).
                    </p>

                    <div className="mt-4 space-y-4 text-sm">
                      <label className="flex items-center justify-between gap-4">
                        <span className="text-foreground/80">Order notifications (SMS)</span>
                        <input type="checkbox" className="h-4 w-4 rounded border-input accent-[hsl(var(--primary))]" />
                      </label>
                      <label className="flex items-center justify-between gap-4">
                        <span className="text-foreground/80">Order notifications (Email)</span>
                        <input type="checkbox" className="h-4 w-4 rounded border-input accent-[hsl(var(--primary))]" />
                      </label>
                      <label className="flex items-center justify-between gap-4">
                        <span className="text-foreground/80">Save checkout address as default</span>
                        <input type="checkbox" className="h-4 w-4 rounded border-input accent-[hsl(var(--primary))]" />
                      </label>
                    </div>
                  </div>
                )}
              </section>
            </div>
          </div>
        </section>
      </main>

      <StoreFooter />
    </div>
  );
};

export default ProfilePage;
