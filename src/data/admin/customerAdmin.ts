import { z } from "zod";
import { readAdminOrders, type AdminOrder } from "@/data/admin/orderAdmin";

const CUSTOMERS_KEY = "gb_customers_v1";

export type CustomerStatus = "active" | "banned";

export type AdminCustomer = {
	id: string; // phone (normalized)
	name: string;
	phone: string;
	email?: string;
	address?: string;
	area?: string;
	status: CustomerStatus;
	createdAt: string;
	lastOrderAt?: string;
	ordersCount: number;
	lifetimeValue: number;
};

const customerSchema = z.object({
	id: z.string().min(1),
	name: z.string().catch("Customer"),
	phone: z.string().catch(""),
	email: z.string().optional().catch(undefined),
	address: z.string().optional().catch(undefined),
	area: z.string().optional().catch(undefined),
	status: z.enum(["active", "banned"]).catch("active"),
	createdAt: z.string().catch(() => new Date().toISOString()),
	lastOrderAt: z.string().optional().catch(undefined),
	ordersCount: z.coerce.number().catch(0),
	lifetimeValue: z.coerce.number().catch(0),
});

type ParsedCustomer = z.infer<typeof customerSchema>;

function normalizePhone(phone: string) {
	return phone.replace(/\s+/g, "").trim();
}

function readCustomerFlags(): Record<string, ParsedCustomer> {
	try {
		const raw = localStorage.getItem(CUSTOMERS_KEY);
		const parsed = raw ? (JSON.parse(raw) as unknown) : {};
		if (!parsed || typeof parsed !== "object") return {};

		const out: Record<string, ParsedCustomer> = {};
		for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
			const res = customerSchema.safeParse(v);
			if (res.success) out[k] = res.data;
		}
		return out;
	} catch {
		return {};
	}
}

function writeCustomerFlags(map: Record<string, ParsedCustomer>) {
	try {
		localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(map));
	} catch {
		// ignore
	}
}

function deriveFromOrders(orders: AdminOrder[]): Record<string, Omit<AdminCustomer, "status">> {
	const byPhone: Record<string, Omit<AdminCustomer, "status">> = {};

	for (const o of orders) {
		const phone = normalizePhone(o.customer.phone ?? "");
		if (!phone) continue;

		const id = phone;
		const total = o.pricing?.total ?? 0;

		if (!byPhone[id]) {
			byPhone[id] = {
				id,
				name: o.customer.name ?? "Customer",
				phone,
				email: o.customer.email,
				address: o.customer.address,
				area: o.customer.area,
				createdAt: o.createdAt,
				lastOrderAt: o.createdAt,
				ordersCount: 1,
				lifetimeValue: total,
			};
		} else {
			const prev = byPhone[id];
			byPhone[id] = {
				...prev,
				name: prev.name || o.customer.name,
				email: prev.email || o.customer.email,
				address: prev.address || o.customer.address,
				area: prev.area || o.customer.area,
				createdAt: prev.createdAt < o.createdAt ? prev.createdAt : o.createdAt,
				lastOrderAt: (prev.lastOrderAt ?? "") > o.createdAt ? prev.lastOrderAt : o.createdAt,
				ordersCount: prev.ordersCount + 1,
				lifetimeValue: prev.lifetimeValue + total,
			};
		}
	}

	return byPhone;
}

export function readAdminCustomers(): AdminCustomer[] {
	const orders = readAdminOrders();
	const derived = deriveFromOrders(orders);
	const flags = readCustomerFlags();

	const customers = Object.values(derived).map((d) => {
		const saved = flags[d.id];
		return {
			...d,
			status: saved?.status ?? "active",
		} satisfies AdminCustomer;
	});

	return customers.sort((a, b) => (b.lastOrderAt ?? "").localeCompare(a.lastOrderAt ?? ""));
}

export function setAdminCustomerStatus(customerId: string, status: CustomerStatus) {
	const flags = readCustomerFlags();
	const existing = flags[customerId];

	const next: ParsedCustomer = customerSchema.parse({
		...(existing ?? {
			id: customerId,
			name: "Customer",
			phone: customerId,
			createdAt: new Date().toISOString(),
			ordersCount: 0,
			lifetimeValue: 0,
		}),
		status,
	});

	const updated = { ...flags, [customerId]: next };
	writeCustomerFlags(updated);
}
