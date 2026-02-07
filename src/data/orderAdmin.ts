import { z } from "zod";

export const ORDERS_KEY = "gb_orders_v1";

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

export type AdminOrderItem = {
  key?: string;
  productId?: string;
  name: string;
  variant: string;
  unitPrice: number;
  quantity: number;
};

export type AdminOrder = {
  id: string;
  createdAt: string;
  status: OrderStatus;
  customer: {
    name: string;
    phone: string;
    email?: string;
    address: string;
    area?: string;
    note?: string;
  };
  payment?: {
    method?: string;
    transactionId?: string;
    senderNumber?: string;
    bankName?: string;
  };
  delivery?: {
    method?: string;
    postCode?: string;
  };
  pricing: {
    subtotal: number;
    deliveryFee: number;
    discount: number;
    total: number;
  };
  items: AdminOrderItem[];
};

const orderItemSchema = z.object({
  key: z.string().optional(),
  productId: z.string().optional(),
  name: z.string().catch("Unnamed"),
  variant: z.string().catch(""),
  unitPrice: z.coerce.number().catch(0),
  quantity: z.coerce.number().catch(1),
});

const orderSchema = z.object({
  id: z.string().min(1),
  createdAt: z.string().catch(() => new Date().toISOString()),
  status: z.enum(["pending", "confirmed", "shipped", "delivered", "cancelled"]).catch("pending"),
  customer: z
    .object({
      name: z.string().catch("Customer"),
      phone: z.string().catch(""),
      email: z.string().optional().catch(undefined),
      address: z.string().catch(""),
      area: z.string().optional().catch(undefined),
      note: z.string().optional().catch(undefined),
    })
    .catch({ name: "Customer", phone: "", address: "" }),
  payment: z
    .object({
      method: z.string().optional().catch(undefined),
      transactionId: z.string().optional().catch(undefined),
      senderNumber: z.string().optional().catch(undefined),
      bankName: z.string().optional().catch(undefined),
    })
    .optional()
    .catch(undefined),
  delivery: z
    .object({
      method: z.string().optional().catch(undefined),
      postCode: z.string().optional().catch(undefined),
    })
    .optional()
    .catch(undefined),
  pricing: z
    .object({
      subtotal: z.coerce.number().catch(0),
      deliveryFee: z.coerce.number().catch(0),
      discount: z.coerce.number().catch(0),
      total: z.coerce.number().catch(0),
    })
    .catch({ subtotal: 0, deliveryFee: 0, discount: 0, total: 0 }),
  items: z.array(orderItemSchema).catch([]),
});

type ParsedOrder = z.infer<typeof orderSchema>;

export function readAdminOrders(): AdminOrder[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item) => {
        const res = orderSchema.safeParse(item);
        if (!res.success) return null;
        return res.data as ParsedOrder;
      })
      .filter((x): x is ParsedOrder => Boolean(x))
      .map((o) => o as AdminOrder)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch {
    return [];
  }
}

export function writeAdminOrders(orders: AdminOrder[]) {
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch {
    // ignore
  }
}

export function updateAdminOrderStatus(id: string, status: OrderStatus) {
  const prev = readAdminOrders();
  const next = prev.map((o) => (o.id === id ? { ...o, status } : o));
  writeAdminOrders(next);
  return next;
}
