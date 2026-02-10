import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
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
import { Plus, RefreshCcw, Trash2, Pencil } from "lucide-react";
import { readAdminProducts, writeAdminProducts, type AdminProduct } from "@/data/admin/productAdmin";

type StatusFilter = "all" | "active" | "inactive";

type ProductDraft = {
	name: string;
	sku: string;
	category: string;
	price: number;
	status: "active" | "inactive";
};

const emptyDraft = (): ProductDraft => ({
	name: "",
	sku: "",
	category: "",
	price: 0,
	status: "active",
});

function StatCard({
	label,
	value,
	tone,
}: {
	label: string;
	value: string;
	tone?: "default" | "good" | "warn";
}) {
	return (
		<div className="rounded-xl border bg-card p-4 md:rounded-2xl md:p-5">
			<div className="text-xs font-semibold text-ink-muted md:text-sm">{label}</div>
			<div
				className={cn(
					"mt-1.5 text-2xl font-extrabold tracking-tight tabular-nums md:mt-2 md:text-3xl",
					tone === "good" ? "text-emerald-600" : tone === "warn" ? "text-destructive" : "text-foreground",
				)}
			>
				{value}
			</div>
		</div>
	);
}

function ProductDialog({
	open,
	onOpenChange,
	mode,
	draft,
	setDraft,
	error,
	onSubmit,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	mode: "create" | "edit";
	draft: ProductDraft;
	setDraft: (updater: (prev: ProductDraft) => ProductDraft) => void;
	error: string | null;
	onSubmit: () => void;
}) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="text-xl font-extrabold">
						{mode === "create" ? "Add Product" : "Edit Product"}
					</DialogTitle>
					<DialogDescription className="text-sm">
						Fill in the product info and save changes.
					</DialogDescription>
				</DialogHeader>

				<div className="grid gap-4">
					<div className="grid gap-2">
						<label className="text-sm font-semibold">Product name</label>
						<Input
							value={draft.name}
							onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))}
							placeholder="e.g. Pure Honey Jar"
							className="h-11 text-base"
							maxLength={140}
						/>
					</div>

					<div className="grid gap-4 sm:grid-cols-2">
						<div className="grid gap-2">
							<label className="text-sm font-semibold">SKU</label>
							<Input
								value={draft.sku}
								onChange={(e) => setDraft((p) => ({ ...p, sku: e.target.value }))}
								placeholder="e.g. HONEY-001"
								className="h-11 text-base"
								maxLength={40}
							/>
						</div>

						<div className="grid gap-2">
							<label className="text-sm font-semibold">Category</label>
							<Input
								value={draft.category}
								onChange={(e) => setDraft((p) => ({ ...p, category: e.target.value }))}
								placeholder="e.g. Honey"
								className="h-11 text-base"
								maxLength={80}
							/>
						</div>
					</div>

					<div className="grid gap-4 sm:grid-cols-2">
						<div className="grid gap-2">
							<label className="text-sm font-semibold">Price (৳)</label>
							<Input
								type="number"
								value={draft.price}
								onChange={(e) => setDraft((p) => ({ ...p, price: Number(e.target.value) || 0 }))}
								className="h-11 text-base"
								min={0}
							/>
						</div>

						<div className="grid gap-2">
							<label className="text-sm font-semibold">Status</label>
							<Select
								value={draft.status}
								onValueChange={(v) => setDraft((p) => ({ ...p, status: v as "active" | "inactive" }))}
							>
								<SelectTrigger className="h-11 text-base">
									<SelectValue placeholder="Select status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="active">Active</SelectItem>
									<SelectItem value="inactive">Inactive</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					{error ? (
						<div className="rounded-xl border bg-destructive/10 p-3 text-sm font-semibold text-destructive">
							{error}
						</div>
					) : null}
				</div>

				<DialogFooter className="mt-2 gap-2">
					<Button variant="outline" size="lg" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button size="lg" onClick={onSubmit}>
						{mode === "create" ? "Create product" : "Save changes"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export function AdminProductsSection() {
	const [products, setProducts] = useState<AdminProduct[]>([]);

	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState<StatusFilter>("all");

	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
	const [editingId, setEditingId] = useState<string | null>(null);
	const [draft, setDraft] = useState<ProductDraft>(emptyDraft());
	const [error, setError] = useState<string | null>(null);

	const refresh = () => {
		setProducts(readAdminProducts());
	};

	useEffect(() => {
		refresh();
	}, []);

	const counts = useMemo(() => {
		const total = products.length;
		const active = products.filter((p) => p.status === "active").length;
		const inactive = total - active;
		return { total, active, inactive };
	}, [products]);

	const filtered = useMemo(() => {
		const q = search.trim().toLowerCase();
		return products
			.slice()
			.sort((a, b) => a.name.localeCompare(b.name))
			.filter((p) => {
				if (filter !== "all" && p.status !== filter) return false;
				if (!q) return true;
				return (
					p.name.toLowerCase().includes(q) ||
					p.sku.toLowerCase().includes(q) ||
					p.category.toLowerCase().includes(q)
				);
			});
	}, [products, search, filter]);

	const openCreate = () => {
		setDialogMode("create");
		setEditingId(null);
		setDraft(emptyDraft());
		setError(null);
		setDialogOpen(true);
	};

	const openEdit = (p: AdminProduct) => {
		setDialogMode("edit");
		setEditingId(p.id);
		setDraft({
			name: p.name,
			sku: p.sku,
			category: p.category,
			price: p.price,
			status: p.status,
		});
		setError(null);
		setDialogOpen(true);
	};

	const upsert = () => {
		const trimmedName = draft.name.trim();
		const trimmedSku = draft.sku.trim();
		const trimmedCategory = draft.category.trim();

		if (!trimmedName) return setError("Product name is required");
		if (!trimmedSku) return setError("SKU is required");

		const normalizedSku = trimmedSku.toUpperCase();
		const skuExists = products.some((p) => p.sku.toUpperCase() === normalizedSku && p.id !== editingId);
		if (skuExists) return setError("A product with this SKU already exists");

		const safePrice = Number.isFinite(Number(draft.price)) ? Number(draft.price) : 0;

		if (editingId) {
			const updated = products.map((p) =>
				p.id === editingId
					? {
						...p,
						name: trimmedName,
						sku: normalizedSku,
						category: trimmedCategory || "Uncategorized",
						price: Math.max(0, safePrice),
						status: draft.status,
					}
					: p,
			);
			setProducts(updated);
			writeAdminProducts(updated);
		} else {
			const next: AdminProduct = {
				id: `p-${Date.now()}`,
				name: trimmedName,
				sku: normalizedSku,
				category: trimmedCategory || "Uncategorized",
				price: Math.max(0, safePrice),
				status: draft.status,
				createdAt: new Date().toISOString(),
			};
			const updated = [next, ...products];
			setProducts(updated);
			writeAdminProducts(updated);
		}

		setDialogOpen(false);
	};

	const remove = (id: string) => {
		const target = products.find((p) => p.id === id);
		const label = target ? `${target.name} (${target.sku})` : "this product";
		const ok = window.confirm(`Are you sure you want to delete ${label}?`);
		if (!ok) return;

		const updated = products.filter((p) => p.id !== id);
		setProducts(updated);
		writeAdminProducts(updated);

		if (editingId === id) {
			setEditingId(null);
			setDraft(emptyDraft());
			setDialogOpen(false);
		}
	};

	const setStatus = (id: string, next: boolean) => {
		const nextStatus = (next ? "active" : "inactive") as AdminProduct["status"];
		const updated = products.map((p) => (p.id === id ? { ...p, status: nextStatus } : p));
		setProducts(updated);
		writeAdminProducts(updated);
	};

	return (
		<section className="space-y-6">
			{/* Header */}
			<div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
				<div>
					<h2 className="text-2xl font-extrabold tracking-tight">Products</h2>
					<p className="mt-1 text-base text-ink-muted">Manage your product inventory</p>
				</div>

				<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
					<Button variant="outline" size="lg" onClick={refresh}>
						<RefreshCcw />
						Refresh
					</Button>
					<Button size="lg" onClick={openCreate}>
						<Plus />
						Add Product
					</Button>
				</div>
			</div>

			{/* Stats */}
			<div className="grid gap-3 grid-cols-2 md:grid-cols-3">
				<StatCard label="Total Products" value={String(counts.total)} />
				<StatCard label="Active" value={String(counts.active)} tone="good" />
				<StatCard label="Inactive" value={String(counts.inactive)} tone="warn" />
			</div>

			{/* Filters */}
			<div className="rounded-2xl border bg-card p-4 sm:p-5">
				<div className="grid gap-3 lg:grid-cols-[1fr_240px]">
					<div className="grid gap-2">
						<div className="text-sm font-semibold text-ink-muted">Search</div>
						<Input
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search name / SKU / category"
							className="h-12 text-base"
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
								<SelectItem value="inactive">Inactive</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>

			{/* Table */}
			<div className="rounded-xl border bg-card md:rounded-2xl">
				<div className="flex items-center justify-between gap-3 border-b px-4 py-3 md:px-5 md:py-4">
					<div className="text-base font-extrabold tracking-tight md:text-lg">Product List</div>
					<div className="text-xs text-ink-muted tabular-nums md:text-sm">{filtered.length} products</div>
				</div>

				<div className="overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-[420px]">Product</TableHead>
								<TableHead>Category</TableHead>
								<TableHead className="text-right">Price</TableHead>
								<TableHead className="text-center">Active</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filtered.length === 0 ? (
								<TableRow>
									<TableCell colSpan={5} className="py-10 text-center text-base text-ink-muted">
										No products found.
									</TableCell>
								</TableRow>
							) : (
								filtered.map((p) => (
									<TableRow key={p.id} className="hover:bg-accent/30">
										<TableCell>
											<div className="grid gap-1">
												<div className="text-base font-extrabold leading-tight">{p.name}</div>
												<div className="text-sm text-ink-muted">
													SKU: <span className="font-mono">{p.sku}</span>
												</div>
											</div>
										</TableCell>
										<TableCell className="text-base">{p.category}</TableCell>
										<TableCell className="text-right text-base font-extrabold tabular-nums">
											৳{p.price.toLocaleString("en-US")}
										</TableCell>
										<TableCell>
											<div className="flex items-center justify-center gap-3">
												<Switch
													checked={p.status === "active"}
													onCheckedChange={(v) => setStatus(p.id, v)}
													aria-label={`Toggle ${p.name} active`}
												/>
												<Badge
													variant="secondary"
													className={cn(
														"text-xs",
														p.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-muted text-muted-foreground",
													)}
												>
													{p.status === "active" ? "Active" : "Inactive"}
												</Badge>
											</div>
										</TableCell>
										<TableCell className="text-right">
											<div className="inline-flex flex-wrap items-center justify-end gap-1.5">
												<Button variant="outline" size="sm" className="h-9 px-3" onClick={() => openEdit(p)}>
													<Pencil className="h-4 w-4" />
													<span className="hidden xl:inline">Edit</span>
												</Button>
												<Button
													variant="outline"
													size="sm"
													className="h-9 px-3 text-destructive hover:bg-destructive/10"
													onClick={() => remove(p.id)}
												>
													<Trash2 className="h-4 w-4" />
													<span className="hidden xl:inline">Delete</span>
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

			<ProductDialog
				open={dialogOpen}
				onOpenChange={(open) => {
					setDialogOpen(open);
					if (!open) {
						setError(null);
					}
				}}
				mode={dialogMode}
				draft={draft}
				setDraft={setDraft}
				error={error}
				onSubmit={upsert}
			/>
		</section>
	);
}
