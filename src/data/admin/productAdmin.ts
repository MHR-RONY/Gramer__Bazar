export type AdminProductStatus = "active" | "inactive";

export type AdminProduct = {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  status: AdminProductStatus;
  createdAt: string;
};

const PRODUCTS_KEY = "gb_products_v1";

const demoAdminProducts: AdminProduct[] = [
  {
    id: "p-1",
    name: "Pure Honey Jar (খাঁটি মধু)",
    sku: "HONEY-001",
    category: "Honey",
    price: 699,
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "p-2",
    name: "Mustard Oil Bottle (সরিষার তেল)",
    sku: "OIL-001",
    category: "Oil",
    price: 549,
    status: "active",
    createdAt: new Date().toISOString(),
  },
];

export const readAdminProducts = (): AdminProduct[] => {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    if (!raw) return demoAdminProducts;
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return demoAdminProducts;
    return (parsed as any[]).map((item, index) => ({
      id: String(item.id ?? `p-${index + 1}`),
      name: String(item.name ?? "Unnamed product"),
      sku: String(item.sku ?? "SKU-000"),
      category: String(item.category ?? "Uncategorized"),
      price: Number.isFinite(Number(item.price)) ? Number(item.price) : 0,
      status: item.status === "inactive" ? "inactive" : "active",
      createdAt: item.createdAt ?? new Date().toISOString(),
    }));
  } catch {
    return demoAdminProducts;
  }
};

export const writeAdminProducts = (items: AdminProduct[]) => {
  try {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
};
