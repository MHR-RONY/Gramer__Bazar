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
import { Eye, RefreshCcw, ShieldBan } from "lucide-react";
import {
	readAdminCustomers,
	setAdminCustomerStatus,
	type AdminCustomer,
	type CustomerStatus,
} from "@/data/admin/customerAdmin";

type StatusFilter = "all" | CustomerStatus;

function money(value: number) {
	return `৳${value.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function StatCard({ label, value }: { label: string; value: string }) {
	return (
		<div className="rounded-xl border bg-card p-4 md:rounded-2xl md:p-5">
			<div className="text-xs font-semibold text-ink-muted md:text-sm">{label}</div>
			<div className="mt-1.5 text-2xl font-extrabold tracking-tight tabular-nums text-foreground md:mt-2 md:text-3xl">
				{value}
			</div>
		</div>
	);
}

function statusBadge(status: CustomerStatus) {
	return status === "banned"
		? "bg-destructive/10 text-destructive"
		: "bg-primary/10 text-primary";
}

function CustomerDetails({ c }: { c: AdminCustomer }) {
	return (
		<div className="grid gap-6">
			<section className="rounded-2xl border bg-card p-5">
				<div className="flex items-start justify-between gap-3">
					<div className="min-w-0">
						<div className="text-xl font-extrabold tracking-tight truncate">{c.name}</div>
						<div className="mt-1 font-mono text-sm text-ink-muted">{c.phone}</div>
						{c.email ? <div className="mt-1 text-sm text-ink-muted">{c.email}</div> : null}
					</div>
					<Badge variant="secondary" className={cn("text-xs", statusBadge(c.status))}>
						{c.status === "banned" ? "Banned" : "Active"}
					</Badge>
				</div>
			</section>

			<section className="grid gap-3 rounded-2xl border bg-card p-5">
				<div className="text-sm font-extrabold tracking-tight">Address</div>
				<div className="text-sm text-foreground/80">{c.address || "—"}</div>
				<div className="text-xs text-ink-muted">{c.area || ""}</div>
			</section>

			<section className="grid gap-4 rounded-2xl border bg-card p-5 sm:grid-cols-3">
				<div>
					<div className="text-xs font-semibold text-ink-muted">Orders</div>
					<div className="mt-1 text-lg font-extrabold tabular-nums">{c.ordersCount}</div>
				</div>
				<div>
					<div className="text-xs font-semibold text-ink-muted">Lifetime value</div>
					<div className="mt-1 text-lg font-extrabold tabular-nums">{money(c.lifetimeValue)}</div>
				</div>
				<div>
					<div className="text-xs font-semibold text-ink-muted">Last order</div>
					<div className="mt-1 text-sm font-semibold">{c.lastOrderAt ? new Date(c.lastOrderAt).toLocaleString() : "—"}</div>
				</div>
			</section>
		</div>
	);
}

export function AdminCustomersSection() {
	const [customers, setCustomers] = useState<AdminCustomer[]>([]);
	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState<StatusFilter>("all");

	const [open, setOpen] = useState(false);
	const [selected, setSelected] = useState<AdminCustomer | null>(null);

	const refresh = () => setCustomers(readAdminCustomers());

	useEffect(() => {
		refresh();
	}, []);

	const stats = useMemo(() => {
		const total = customers.length;
		const banned = customers.filter((c) => c.status === "banned").length;
		const active = total - banned;
		const ltv = customers.reduce((sum, c) => sum + c.lifetimeValue, 0);
		return { total, active, banned, ltv };
	}, [customers]);

	const filtered = useMemo(() => {
		const q = search.trim().toLowerCase();
		return customers.filter((c) => {
			if (filter !== "all" && c.status !== filter) return false;
			if (!q) return true;
			return (
				c.name.toLowerCase().includes(q) ||
				c.phone.toLowerCase().includes(q) ||
				(c.email ?? "").toLowerCase().includes(q)
			);
		});
	}, [customers, search, filter]);

	const openDetails = (c: AdminCustomer) => {
		setSelected(c);
		setOpen(true);
	};

	const setStatus = (id: string, status: CustomerStatus) => {
		setAdminCustomerStatus(id, status);
		refresh();
		if (selected?.id === id) {
			setSelected(readAdminCustomers().find((x) => x.id === id) ?? null);
		}
	};

	return (
		<section className="space-y-6">
			<div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
				<div>
					<h1 className="text-2xl font-extrabold tracking-tight">Customers</h1>
					<p className="mt-1 text-base text-ink-muted">See customer list from placed orders</p>
				</div>

				<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
					<Button variant="outline" size="lg" onClick={refresh}>
						<RefreshCcw />
						Refresh
					</Button>
				</div>
			</div>

			<div className="grid gap-3 grid-cols-2 md:grid-cols-4">
				<StatCard label="Total" value={String(stats.total)} />
				<StatCard label="Active" value={String(stats.active)} />
				<StatCard label="Banned" value={String(stats.banned)} />
				<StatCard label="Total LTV" value={money(stats.ltv)} />
			</div>

			<div className="rounded-2xl border bg-card p-4 sm:p-5">
				<div className="grid gap-3 lg:grid-cols-[1fr_240px]">
					<div className="grid gap-2">
						<div className="text-sm font-semibold text-ink-muted">Search</div>
						<Input
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search by name / phone / email"
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
								<SelectItem value="active">Active</SelectItem>
								<SelectItem value="banned">Banned</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>

			<div className="rounded-xl border bg-card md:rounded-2xl">
				<div className="flex items-center justify-between gap-3 border-b px-4 py-3 md:px-5 md:py-4">
					<div className="text-base font-extrabold tracking-tight md:text-lg">Customer List</div>
					<div className="text-xs text-ink-muted tabular-nums md:text-sm">{filtered.length} customers</div>
				</div>

				<div className="overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-[360px]">Customer</TableHead>
								<TableHead>Last order</TableHead>
								<TableHead className="text-right">Orders</TableHead>
								<TableHead className="text-right">LTV</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filtered.length === 0 ? (
								<TableRow>
									<TableCell colSpan={6} className="py-10 text-center text-base text-ink-muted">
										No customers found.
									</TableCell>
								</TableRow>
							) : (
								filtered.map((c) => (
									<TableRow key={c.id} className="hover:bg-accent/30">
										<TableCell>
											<div className="grid gap-1">
												<div className="text-base font-extrabold leading-tight">{c.name}</div>
												<div className="text-sm text-ink-muted font-mono">{c.phone}</div>
												{c.email ? <div className="text-xs text-ink-muted">{c.email}</div> : null}
											</div>
										</TableCell>

										<TableCell className="text-sm text-ink-muted">
											{c.lastOrderAt ? new Date(c.lastOrderAt).toLocaleString() : "—"}
										</TableCell>

										<TableCell className="text-right text-base font-extrabold tabular-nums">
											{c.ordersCount}
										</TableCell>

										<TableCell className="text-right text-base font-extrabold tabular-nums">
											{money(c.lifetimeValue)}
										</TableCell>

										<TableCell>
											<Badge variant="secondary" className={cn("text-xs", statusBadge(c.status))}>
												{c.status === "banned" ? "Banned" : "Active"}
											</Badge>
										</TableCell>

										<TableCell className="text-right">
											<div className="inline-flex flex-wrap items-center justify-end gap-1.5">
												<Button
													variant="outline"
													size="sm"
													className="h-9 px-3"
													onClick={() => openDetails(c)}
												>
													<Eye className="h-4 w-4" />
													<span className="hidden xl:inline">View</span>
												</Button>

												<Button
													variant="outline"
													size="sm"
													className={cn(
														"h-9 px-3",
														c.status === "banned"
															? "text-primary hover:bg-accent"
															: "text-destructive hover:bg-destructive/10",
													)}
													onClick={() => {
														const next = c.status === "banned" ? "active" : "banned";
														const ok = window.confirm(
															next === "banned"
																? `Ban ${c.name} (${c.phone})?`
																: `Unban ${c.name} (${c.phone})?`,
														);
														if (!ok) return;
														setStatus(c.id, next);
													}}
												>
													<ShieldBan className="h-4 w-4" />
													<span className="hidden xl:inline">{c.status === "banned" ? "Unban" : "Ban"}</span>
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>
			</div>

			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0">
					<DialogHeader className="px-4 pt-6 pb-4 sm:px-6">
						<DialogTitle className="text-xl font-extrabold">Customer details</DialogTitle>
						<DialogDescription className="text-sm">Customer profile derived from orders.</DialogDescription>
					</DialogHeader>

					{selected ? (
						<>
							<div className="flex-1 overflow-y-auto px-4 sm:px-6">
								<CustomerDetails c={selected} />
							</div>

							<div className="sticky bottom-0 border-t bg-background px-4 py-4 sm:px-6">
								<div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
									<Button
										type="button"
										variant={selected.status === "banned" ? "outline" : "destructive"}
										className="w-full sm:w-auto"
										onClick={() => {
											const next: CustomerStatus = selected.status === "banned" ? "active" : "banned";
											const ok = window.confirm(
												next === "banned"
													? `Ban ${selected.name} (${selected.phone})?`
													: `Unban ${selected.name} (${selected.phone})?`,
											);
											if (!ok) return;
											setStatus(selected.id, next);
										}}
									>
										<ShieldBan />
										{selected.status === "banned" ? "Unban customer" : "Ban customer"}
									</Button>

									<Button type="button" variant="outline" className="w-full sm:w-auto" onClick={() => setOpen(false)}>
										Close
									</Button>
								</div>
							</div>
						</>
					) : null}
				</DialogContent>
			</Dialog>
		</section>
	);
}
