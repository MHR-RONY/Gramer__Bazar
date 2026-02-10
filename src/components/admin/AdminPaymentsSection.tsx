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
import { Eye, RefreshCcw, ThumbsDown, ThumbsUp } from "lucide-react";
import {
	paymentMethodLabel,
	readAdminPayments,
	updateAdminPaymentStatus,
	type AdminPayment,
	type PaymentMethod,
	type PaymentStatus,
} from "@/data/admin/paymentAdmin";

type StatusFilter = "all" | PaymentStatus;
type MethodFilter = "all" | PaymentMethod;

function money(value: number) {
	return `৳${value.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function statusBadgeClass(status: PaymentStatus) {
	switch (status) {
		case "approved":
			return "bg-primary/10 text-primary";
		case "rejected":
			return "bg-destructive/10 text-destructive";
		default:
			return "bg-muted text-muted-foreground";
	}
}

function StatCard({ label, value }: { label: string; value: string }) {
	return (
		<div className="rounded-lg border bg-card p-4 md:rounded-xl md:p-5">
			<div className="text-sm font-semibold text-ink-muted md:text-sm">{label}</div>
			<div className="mt-2 text-3xl font-extrabold tracking-tight tabular-nums text-foreground md:text-3xl">
				{value}
			</div>
		</div>
	);
}

function PaymentDetails({ p }: { p: AdminPayment }) {
	return (
		<div className="grid gap-4 sm:gap-6">
			<section className="rounded-lg border bg-card p-4 sm:rounded-xl sm:p-5">
				<div className="flex items-start justify-between gap-3">
					<div>
						<div className="text-sm font-semibold text-ink-muted">Payment ID</div>
						<div className="mt-1 font-mono text-base font-extrabold">{p.id}</div>
						<div className="mt-1 text-sm text-ink-muted">{new Date(p.createdAt).toLocaleString()}</div>
					</div>
					<Badge variant="secondary" className={cn("text-xs", statusBadgeClass(p.status))}>
						{p.status === "pending" ? "Pending" : p.status === "approved" ? "Approved" : "Rejected"}
					</Badge>
				</div>
			</section>

			<section className="grid gap-3 rounded-lg border bg-card p-4 sm:rounded-xl sm:p-5 grid-cols-1 sm:grid-cols-2">
				<div className="grid gap-1">
					<div className="text-sm font-semibold text-ink-muted">Order Number</div>
					<div className="text-base font-extrabold">{p.orderNumber}</div>
				</div>
				<div className="grid gap-1 sm:text-right">
					<div className="text-sm font-semibold text-ink-muted">Amount</div>
					<div className="text-base font-extrabold tabular-nums">{money(p.amount)}</div>
				</div>
				<div className="grid gap-1">
					<div className="text-sm font-semibold text-ink-muted">Method</div>
					<div className="text-sm font-semibold">{paymentMethodLabel(p.method)}</div>
				</div>
				<div className="grid gap-1">
					<div className="text-sm font-semibold text-ink-muted">Transaction ID</div>
					<div className="font-mono text-sm font-extrabold">{p.transactionId || "—"}</div>
				</div>
			</section>

			<section className="grid gap-3 rounded-lg border bg-card p-4 sm:rounded-xl sm:p-5">
				<div className="text-base font-extrabold tracking-tight">Customer</div>
				<div className="grid gap-1 text-sm">
					<div className="font-extrabold">{p.customer.name}</div>
					<div className="font-mono text-sm text-ink-muted">{p.customer.phone}</div>
					{p.customer.email ? <div className="text-sm text-ink-muted">{p.customer.email}</div> : null}
				</div>
			</section>

			<section className="grid gap-3 rounded-lg border bg-card p-4 sm:rounded-xl sm:p-5">
				<div className="text-base font-extrabold tracking-tight">Sender number</div>
				<div className="font-mono text-base font-extrabold">{p.senderNumber || "—"}</div>
			</section>

			<section className="grid gap-3 rounded-lg border bg-card p-4 sm:rounded-xl sm:p-5">
				<div className="text-base font-extrabold tracking-tight">Proof</div>
				{p.proofImageUrl ? (
					<img
						src={p.proofImageUrl}
						alt={`Payment proof for order ${p.orderNumber}`}
						className="max-h-[320px] w-full rounded-lg border object-contain bg-background"
						loading="lazy"
					/>
				) : (
					<div className="text-sm text-ink-muted">—</div>
				)}
			</section>

			{p.notes ? (
				<section className="grid gap-2 rounded-lg border bg-card p-4 sm:rounded-xl sm:p-5">
					<div className="text-base font-extrabold tracking-tight">Notes</div>
					<div className="text-base text-foreground/80">{p.notes}</div>
				</section>
			) : null}
		</div>
	);
}

export function AdminPaymentsSection() {
	const [payments, setPayments] = useState<AdminPayment[]>([]);
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
	const [methodFilter, setMethodFilter] = useState<MethodFilter>("all");

	const [open, setOpen] = useState(false);
	const [selected, setSelected] = useState<AdminPayment | null>(null);

	const refresh = () => setPayments(readAdminPayments());

	useEffect(() => {
		refresh();
	}, []);

	const stats = useMemo(() => {
		const total = payments.length;
		const pending = payments.filter((p) => p.status === "pending").length;
		const approved = payments.filter((p) => p.status === "approved").length;
		const rejected = payments.filter((p) => p.status === "rejected").length;
		return { total, pending, approved, rejected };
	}, [payments]);

	const filtered = useMemo(() => {
		const q = search.trim().toLowerCase();
		return payments
			.slice()
			.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
			.filter((p) => {
				if (statusFilter !== "all" && p.status !== statusFilter) return false;
				if (methodFilter !== "all" && p.method !== methodFilter) return false;
				if (!q) return true;
				return (
					p.orderNumber.toLowerCase().includes(q) ||
					p.id.toLowerCase().includes(q) ||
					(p.transactionId ?? "").toLowerCase().includes(q) ||
					(p.senderNumber ?? "").toLowerCase().includes(q) ||
					p.customer.name.toLowerCase().includes(q) ||
					(p.customer.phone ?? "").toLowerCase().includes(q)
				);
			});
	}, [payments, search, statusFilter, methodFilter]);

	const openDetails = (p: AdminPayment) => {
		setSelected(p);
		setOpen(true);
	};

	const setStatus = (id: string, status: PaymentStatus) => {
		const ok = window.confirm(
			status === "approved"
				? "Approve this payment?"
				: status === "rejected"
					? "Reject this payment?"
					: "Set payment to pending?",
		);
		if (!ok) return;

		const next = updateAdminPaymentStatus(id, status);
		setPayments(next);
		if (selected?.id === id) {
			setSelected(next.find((x) => x.id === id) ?? null);
		}
	};

	return (
		<section className="space-y-5 md:space-y-6 max-w-full">
			<div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
				<div>
					<h1 className="text-2xl font-extrabold tracking-tight md:text-2xl">Payments</h1>
					<p className="mt-1 text-base text-ink-muted md:text-base">Review payments and approve or reject them</p>
				</div>

				<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
					<Button variant="outline" size="default" className="h-11" onClick={refresh}>
						<RefreshCcw className="h-4 w-4" />
						Refresh
					</Button>
				</div>
			</div>

			<div className="grid gap-3 grid-cols-2 md:grid-cols-4">
				<StatCard label="Total" value={String(stats.total)} />
				<StatCard label="Pending" value={String(stats.pending)} />
				<StatCard label="Approved" value={String(stats.approved)} />
				<StatCard label="Rejected" value={String(stats.rejected)} />
			</div>

			<div className="rounded-lg border bg-card p-4 md:rounded-xl md:p-5">
				<div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-[1fr_200px_200px]">
					<div className="grid gap-2">
						<div className="text-sm font-semibold text-ink-muted md:text-sm">Search</div>
						<Input
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search order / txn / sender / customer"
							className="h-11 text-base md:h-12 md:text-base"
							maxLength={120}
						/>
					</div>

					<div className="grid gap-2">
						<div className="text-sm font-semibold text-ink-muted md:text-sm">Status</div>
						<Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
							<SelectTrigger className="h-11 text-base md:h-12 md:text-base">
								<SelectValue placeholder="All" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All</SelectItem>
								<SelectItem value="pending">Pending</SelectItem>
								<SelectItem value="approved">Approved</SelectItem>
								<SelectItem value="rejected">Rejected</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="grid gap-2">
						<div className="text-sm font-semibold text-ink-muted md:text-sm">Method</div>
						<Select value={methodFilter} onValueChange={(v) => setMethodFilter(v as MethodFilter)}>
							<SelectTrigger className="h-11 text-base md:h-12 md:text-base">
								<SelectValue placeholder="All" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All</SelectItem>
								<SelectItem value="cod">COD</SelectItem>
								<SelectItem value="online_transfer">Online Transfer</SelectItem>
								<SelectItem value="card">Card</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>

			<div className="rounded-lg border bg-card md:rounded-xl">
				<div className="flex items-center justify-between gap-3 border-b px-4 py-4 md:px-5 md:py-4">
					<div className="text-lg font-extrabold tracking-tight md:text-lg">Payment List</div>
					<div className="text-sm text-ink-muted tabular-nums md:text-sm">{filtered.length} payments</div>
				</div>

				<div className="overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-[220px]">Order</TableHead>
								<TableHead className="w-[320px]">Customer</TableHead>
								<TableHead>Created</TableHead>
								<TableHead>Method</TableHead>
								<TableHead className="text-right">Amount</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filtered.length === 0 ? (
								<TableRow>
									<TableCell colSpan={7} className="py-10 text-center text-base text-ink-muted">
										No payments found.
									</TableCell>
								</TableRow>
							) : (
								filtered.map((p) => (
									<TableRow key={p.id} className="hover:bg-accent/30">
										<TableCell>
											<div className="grid gap-1">
												<div className="text-sm font-extrabold">{p.orderNumber}</div>
												<div className="font-mono text-xs text-ink-muted">{p.transactionId || "—"}</div>
											</div>
										</TableCell>

										<TableCell>
											<div className="grid gap-1">
												<div className="text-base font-extrabold leading-tight">{p.customer.name}</div>
												<div className="text-sm text-ink-muted font-mono">{p.customer.phone}</div>
											</div>
										</TableCell>

										<TableCell className="text-sm text-ink-muted">
											{new Date(p.createdAt).toLocaleString()}
										</TableCell>

										<TableCell className="text-sm font-semibold">{paymentMethodLabel(p.method)}</TableCell>

										<TableCell className="text-right text-base font-extrabold tabular-nums">
											{money(p.amount)}
										</TableCell>

										<TableCell>
											<Badge variant="secondary" className={cn("text-xs", statusBadgeClass(p.status))}>
												{p.status === "pending" ? "Pending" : p.status === "approved" ? "Approved" : "Rejected"}
											</Badge>
										</TableCell>

										<TableCell className="text-right">
											<div className="inline-flex flex-wrap items-center justify-end gap-1.5">
												<Button
													variant="outline"
													size="sm"
													className="h-9 px-3"
													onClick={() => openDetails(p)}
												>
													<Eye className="h-4 w-4" />
													<span className="hidden xl:inline">View</span>
												</Button>

												<Button
													variant="outline"
													size="sm"
													className="h-9 px-3"
													onClick={() => setStatus(p.id, "approved")}
													disabled={p.status === "approved"}
												>
													<ThumbsUp className="h-4 w-4" />
													<span className="hidden xl:inline">Approve</span>
												</Button>

												<Button
													variant="outline"
													size="sm"
													className={cn("h-9 px-3", "text-destructive hover:bg-destructive/10")}
													onClick={() => setStatus(p.id, "rejected")}
													disabled={p.status === "rejected"}
												>
													<ThumbsDown className="h-4 w-4" />
													<span className="hidden xl:inline">Reject</span>
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
				<DialogContent className="w-[calc(100vw-2rem)] max-w-3xl h-[90vh] flex flex-col p-0 gap-0">
					<DialogHeader className="px-4 pt-6 pb-3 sm:px-6 shrink-0 border-b">
						<DialogTitle className="text-xl font-extrabold md:text-xl">Payment details</DialogTitle>
						<DialogDescription className="text-sm md:text-sm">Review payment info and proof.</DialogDescription>
					</DialogHeader>

					{selected ? (
						<>
							<div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 min-h-0">
								<PaymentDetails p={selected} />
							</div>

							<div className="shrink-0 border-t bg-background px-4 py-3 sm:px-6 sm:py-4">
								<div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
									<Button
										type="button"
										size="sm"
										variant="outline"
										className="w-full sm:w-auto h-10"
										onClick={() => setStatus(selected.id, "approved")}
										disabled={selected.status === "approved"}
									>
										<ThumbsUp className="h-4 w-4" />
										Approve
									</Button>

									<Button
										type="button"
										size="sm"
										variant="destructive"
										className="w-full sm:w-auto h-10"
										onClick={() => setStatus(selected.id, "rejected")}
										disabled={selected.status === "rejected"}
									>
										<ThumbsDown className="h-4 w-4" />
										Reject
									</Button>

									<Button type="button" size="sm" variant="outline" className="w-full sm:w-auto h-10" onClick={() => setOpen(false)}>
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
