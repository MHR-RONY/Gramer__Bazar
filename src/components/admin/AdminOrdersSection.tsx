import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Eye, RefreshCcw } from "lucide-react";
import {
  readAdminOrders,
  updateAdminOrderStatus,
  type AdminOrder,
  type OrderStatus,
} from "@/data/admin/orderAdmin";

type StatusFilter = "all" | OrderStatus;

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

function money(value: number) {
  return `৳${value.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function statusBadgeClass(status: OrderStatus) {
  switch (status) {
    case "delivered":
      return "bg-emerald-50 text-emerald-700";
    case "cancelled":
      return "bg-destructive/10 text-destructive";
    case "shipped":
      return "bg-primary/10 text-primary";
    case "confirmed":
      return "bg-accent text-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border bg-card p-5">
      <div className="text-sm font-semibold text-ink-muted">{label}</div>
      <div className="mt-2 text-3xl font-extrabold tracking-tight tabular-nums text-foreground">
        {value}
      </div>
      {sub ? <div className="mt-1 text-xs text-ink-muted">{sub}</div> : null}
    </div>
  );
}

function OrderDetails({ order }: { order: AdminOrder }) {
  return (
    <div className="grid gap-6">
      <section className="grid gap-3 rounded-2xl border bg-card p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs font-semibold text-ink-muted">Order ID</div>
            <div className="mt-1 font-mono text-sm font-extrabold">{order.id}</div>
            <div className="mt-1 text-xs text-ink-muted">
              {new Date(order.createdAt).toLocaleString()}
            </div>
          </div>
          <Badge variant="secondary" className={cn("text-xs", statusBadgeClass(order.status))}>
            {STATUS_LABEL[order.status]}
          </Badge>
        </div>
      </section>

      <section className="grid gap-3 rounded-2xl border bg-card p-5">
        <div className="text-sm font-extrabold tracking-tight">Customer</div>
        <div className="grid gap-2 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="font-extrabold">{order.customer.name}</div>
            <div className="font-mono text-xs text-ink-muted">{order.customer.phone}</div>
          </div>
          {order.customer.email ? (
            <div className="text-xs text-ink-muted">{order.customer.email}</div>
          ) : null}
          <div className="text-sm text-foreground/80">{order.customer.address}</div>
          {order.customer.area ? <div className="text-xs text-ink-muted">{order.customer.area}</div> : null}
        </div>
      </section>

      <section className="grid gap-3 rounded-2xl border bg-card p-5">
        <div className="text-sm font-extrabold tracking-tight">Items</div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b bg-surface-2/60">
              <tr>
                <th className="px-3 py-3 font-semibold">Product</th>
                <th className="px-3 py-3 font-semibold">Variant</th>
                <th className="px-3 py-3 font-semibold text-right">Qty</th>
                <th className="px-3 py-3 font-semibold text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((it, idx) => (
                <tr key={`${it.name}-${idx}`} className="border-b last:border-0">
                  <td className="px-3 py-3 font-semibold">{it.name}</td>
                  <td className="px-3 py-3 text-ink-muted">{it.variant}</td>
                  <td className="px-3 py-3 text-right font-semibold tabular-nums">{it.quantity}</td>
                  <td className="px-3 py-3 text-right font-extrabold tabular-nums">
                    {money(it.unitPrice * it.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-3 rounded-2xl border bg-card p-5">
        <div className="text-sm font-extrabold tracking-tight">Pricing</div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <div className="text-ink-muted">Subtotal</div>
            <div className="font-semibold tabular-nums">{money(order.pricing.subtotal)}</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-ink-muted">Delivery fee</div>
            <div className="font-semibold tabular-nums">{money(order.pricing.deliveryFee)}</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-ink-muted">Discount</div>
            <div className="font-semibold tabular-nums">{money(order.pricing.discount)}</div>
          </div>
          <div className="border-t pt-3">
            <div className="flex items-center justify-between">
              <div className="text-base font-extrabold">Total</div>
              <div className="text-base font-extrabold tabular-nums">{money(order.pricing.total)}</div>
            </div>
          </div>
        </div>
      </section>

      {(order.payment?.method || order.delivery?.method) && (
        <section className="grid gap-4 rounded-2xl border bg-card p-5 sm:grid-cols-2">
          <div className="grid gap-2">
            <div className="text-sm font-extrabold tracking-tight">Payment</div>
            <div className="text-sm text-foreground/80">Method: {order.payment?.method ?? "—"}</div>
            {order.payment?.transactionId ? (
              <div className="text-xs text-ink-muted">TXN: {order.payment.transactionId}</div>
            ) : null}
            {order.payment?.senderNumber ? (
              <div className="text-xs text-ink-muted">Sender: {order.payment.senderNumber}</div>
            ) : null}
            {order.payment?.bankName ? (
              <div className="text-xs text-ink-muted">Bank: {order.payment.bankName}</div>
            ) : null}
          </div>
          <div className="grid gap-2">
            <div className="text-sm font-extrabold tracking-tight">Delivery</div>
            <div className="text-sm text-foreground/80">Method: {order.delivery?.method ?? "—"}</div>
            {order.delivery?.postCode ? (
              <div className="text-xs text-ink-muted">Post code: {order.delivery.postCode}</div>
            ) : null}
          </div>
        </section>
      )}
    </div>
  );
}

export function AdminOrdersSection() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("all");

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<AdminOrder | null>(null);

  const refresh = () => {
    setOrders(readAdminOrders());
  };

  useEffect(() => {
    refresh();
  }, []);

  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const revenue = orders.reduce((sum, o) => sum + (o.pricing?.total ?? 0), 0);
    const pending = orders.filter((o) => o.status === "pending").length;
    const delivered = orders.filter((o) => o.status === "delivered").length;
    return { totalOrders, revenue, pending, delivered };
  }, [orders]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((o) => {
      if (filter !== "all" && o.status !== filter) return false;
      if (!q) return true;
      return (
        o.id.toLowerCase().includes(q) ||
        o.customer.name.toLowerCase().includes(q) ||
        (o.customer.phone ?? "").toLowerCase().includes(q)
      );
    });
  }, [orders, search, filter]);

  const openDetails = (order: AdminOrder) => {
    setSelected(order);
    setOpen(true);
  };

  const setStatus = (id: string, status: OrderStatus) => {
    const next = updateAdminOrderStatus(id, status);
    setOrders(next);
    if (selected?.id === id) {
      const updated = next.find((o) => o.id === id) ?? null;
      setSelected(updated);
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Orders</h1>
          <p className="mt-1 text-base text-ink-muted">Track and manage incoming orders</p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button variant="outline" size="lg" onClick={refresh}>
            <RefreshCcw />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total Orders" value={String(stats.totalOrders)} />
        <StatCard label="Revenue" value={money(stats.revenue)} sub="(sum of totals)" />
        <StatCard label="Pending" value={String(stats.pending)} />
        <StatCard label="Delivered" value={String(stats.delivered)} />
      </div>

      <div className="rounded-2xl border bg-card p-4 sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[1fr_240px]">
          <div className="grid gap-2">
            <div className="text-sm font-semibold text-ink-muted">Search</div>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order id / name / phone"
              className="h-12 text-base"
              maxLength={80}
            />
          </div>

          <div className="grid gap-2">
            <div className="text-sm font-semibold text-ink-muted">Status</div>
            <Select value={filter} onValueChange={(v) => setFilter(v as StatusFilter)}>
              <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border bg-card">
        <div className="flex items-center justify-between gap-3 border-b px-5 py-4">
          <div className="text-lg font-extrabold tracking-tight">Order List</div>
          <div className="text-sm text-ink-muted tabular-nums">{filtered.length} orders</div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[220px]">Order</TableHead>
                <TableHead className="w-[320px]">Customer</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="w-[220px]">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-base text-ink-muted">
                    No orders found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((o) => (
                  <TableRow key={o.id} className="hover:bg-accent/30">
                    <TableCell>
                      <div className="grid gap-1">
                        <div className="font-mono text-sm font-extrabold">{o.id}</div>
                        <div className="text-xs text-ink-muted">{o.items.length} item(s)</div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="grid gap-1">
                        <div className="text-base font-extrabold leading-tight">{o.customer.name}</div>
                        <div className="text-sm text-ink-muted font-mono">{o.customer.phone}</div>
                      </div>
                    </TableCell>

                    <TableCell className="text-sm text-ink-muted">
                      {new Date(o.createdAt).toLocaleString()}
                    </TableCell>

                    <TableCell className="text-right text-base font-extrabold tabular-nums">
                      {money(o.pricing.total)}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className={cn("text-xs", statusBadgeClass(o.status))}
                        >
                          {STATUS_LABEL[o.status]}
                        </Badge>
                        <Select value={o.status} onValueChange={(v) => setStatus(o.id, v as OrderStatus)}>
                          <SelectTrigger className="h-10 w-[140px] text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-10 px-4"
                        onClick={() => openDetails(o)}
                      >
                        <Eye />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold">Order details</DialogTitle>
            <DialogDescription className="text-sm">
              Review items, customer info, and pricing.
            </DialogDescription>
          </DialogHeader>
          {selected ? <OrderDetails order={selected} /> : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}
