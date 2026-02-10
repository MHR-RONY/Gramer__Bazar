import { z } from "zod";

const PAYMENTS_KEY = "gb_payments_v1";

export type PaymentStatus = "pending" | "approved" | "rejected";
export type PaymentMethod = "cod" | "online_transfer" | "card";

export type AdminPayment = {
  id: string;
  orderNumber: string;
  status: PaymentStatus;
  method: PaymentMethod;
  amount: number;
  currency: "BDT";
  createdAt: string;

  transactionId?: string;
  senderNumber?: string;
  proofImageUrl?: string;

  customer: {
    name: string;
    phone: string;
    email?: string;
  };

  notes?: string;
};

const paymentSchema = z
  .object({
    id: z.string().min(1),
    orderNumber: z.string().min(1).max(60),
    status: z.enum(["pending", "approved", "rejected"]),
    method: z.enum(["cod", "online_transfer", "card"]),
    amount: z.number().finite().nonnegative(),
    currency: z.literal("BDT"),
    createdAt: z.string().min(1),
    transactionId: z.string().max(120).optional(),
    senderNumber: z.string().max(30).optional(),
    proofImageUrl: z.string().max(500).optional(),
    customer: z.object({
      name: z.string().min(1).max(120),
      phone: z.string().min(1).max(30),
      email: z.string().email().max(255).optional().or(z.literal("")),
    }),
    notes: z.string().max(500).optional(),
  })
  .strict() as z.ZodType<AdminPayment>;

const paymentArraySchema = z.array(paymentSchema);

function safeJsonParse(raw: string | null): unknown {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function seedDemoPayments(): AdminPayment[] {
  const now = Date.now();
  return [
    {
      id: `pay-${now - 1000}`,
      orderNumber: "GB-2048",
      status: "pending",
      method: "online_transfer",
      amount: 2890,
      currency: "BDT",
      createdAt: new Date(now - 1000 * 60 * 18).toISOString(),
      transactionId: "BKASH-7F91A1",
      senderNumber: "+88017XXXXXXX",
      proofImageUrl: "/placeholder.svg",
      customer: {
        name: "Nusrat Jahan",
        phone: "+88018XXXXXXX",
        email: "nusrat@example.com",
      },
      notes: "Requested same-day delivery.",
    },
    {
      id: `pay-${now - 1000 * 2}`,
      orderNumber: "GB-2047",
      status: "approved",
      method: "card",
      amount: 5120,
      currency: "BDT",
      createdAt: new Date(now - 1000 * 60 * 60 * 2).toISOString(),
      transactionId: "CARD-CH_1QX0...",
      senderNumber: "—",
      proofImageUrl: "/placeholder.svg",
      customer: {
        name: "Rafiq Uddin",
        phone: "+88015XXXXXXX",
      },
    },
    {
      id: `pay-${now - 1000 * 3}`,
      orderNumber: "GB-2046",
      status: "rejected",
      method: "online_transfer",
      amount: 1790,
      currency: "BDT",
      createdAt: new Date(now - 1000 * 60 * 60 * 8).toISOString(),
      transactionId: "NAGAD-XX12YY",
      senderNumber: "+88019XXXXXXX",
      proofImageUrl: "/placeholder.svg",
      customer: {
        name: "Samiul Islam",
        phone: "+88016XXXXXXX",
      },
      notes: "Transaction ID did not match.",
    },
    {
      id: `pay-${now - 1000 * 4}`,
      orderNumber: "GB-2045",
      status: "pending",
      method: "cod",
      amount: 2450,
      currency: "BDT",
      createdAt: new Date(now - 1000 * 60 * 45).toISOString(),
      transactionId: "—",
      senderNumber: "—",
      proofImageUrl: "/placeholder.svg",
      customer: {
        name: "Mahmud Hasan",
        phone: "+88013XXXXXXX",
      },
      notes: "COD confirmation required.",
    },
  ];
}

export function readAdminPayments(): AdminPayment[] {
  const parsed = safeJsonParse(localStorage.getItem(PAYMENTS_KEY));
  const result = paymentArraySchema.safeParse(parsed);
  if (result.success) return result.data;

  // first run or invalid shape → seed demo
  const seeded = seedDemoPayments();
  writeAdminPayments(seeded);
  return seeded;
}

export function writeAdminPayments(items: AdminPayment[]) {
  // validate before writing
  const safe = paymentArraySchema.safeParse(items);
  if (!safe.success) return;
  try {
    localStorage.setItem(PAYMENTS_KEY, JSON.stringify(safe.data));
  } catch {
    // ignore
  }
}

export function updateAdminPaymentStatus(id: string, status: PaymentStatus): AdminPayment[] {
  const current = readAdminPayments();
  const next = current.map((p) => (p.id === id ? { ...p, status } : p));
  writeAdminPayments(next);
  return next;
}

export function paymentMethodLabel(method: PaymentMethod) {
  switch (method) {
    case "cod":
      return "COD";
    case "online_transfer":
      return "Online Transfer";
    case "card":
      return "Card";
    default:
      return method;
  }
}
