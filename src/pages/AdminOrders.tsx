import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart3, CreditCard, Package, ShoppingBag, Tags, Users, Settings } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminOrdersSection } from "@/components/admin/AdminOrdersSection";
import { isAdminDemoAuthed } from "@/lib/adminDemoAuth";

const sidebarItems = [
	{ key: "overview", label: "Dashboard", Icon: BarChart3 },
	{ key: "products", label: "Products", Icon: Package },
	{ key: "orders", label: "Orders", Icon: ShoppingBag },
	{ key: "payments", label: "Payments", Icon: CreditCard },
	{ key: "customers", label: "Customers", Icon: Users },
	{ key: "categories", label: "Categories", Icon: Tags },
	{ key: "content", label: "Content / Banners", Icon: Settings },
	{ key: "settings", label: "Settings", Icon: Settings },
] as const;

type SectionKey = (typeof sidebarItems)[number]["key"];

export default function AdminOrdersPage() {
	const navigate = useNavigate();

	useEffect(() => {
		if (!isAdminDemoAuthed()) navigate("/admin/login", { replace: true });
	}, [navigate]);

	const onChange = (key: string) => {
		const k = key as SectionKey;
		if (k === "orders") return;
		if (k === "customers") return navigate("/admin/customers");
		if (k === "payments") return navigate("/admin/payments");
		if (k === "settings") return navigate("/admin/settings");
		if (k === "overview" || k === "products" || k === "categories" || k === "content") {
			return navigate(`/admin?tab=${k}`);
		}

		navigate("/admin");
	};

	return (
		<AdminShell
			brandTitle="Gramer Bazar"
			items={sidebarItems as any}
			activeKey="orders"
			onChange={onChange}
			pageTitle="Orders"
			pageSubtitle="Manage and track orders"
		>
			<AdminOrdersSection />
		</AdminShell>
	);
}
