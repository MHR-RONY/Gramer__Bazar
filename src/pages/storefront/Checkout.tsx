
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { StoreHeader } from "@/components/storefront/StoreHeader";
import { StoreFooter } from "@/components/storefront/StoreFooter";
import { useCart } from "@/components/storefront/cart/CartProvider";
import { Button } from "@/components/ui/button";
import { CheckoutCompactUI, type CheckoutCompactForm } from "@/components/checkout/CheckoutCompactUI";


const ORDERS_KEY = "gb_orders_v1";

const safeTrim = (v: string) => v.trim();

const isValidPhone = (phone: string) => {
	const p = phone.replace(/\s+/g, "");
	// Bangladesh-friendly: allow +880 or 0 prefix, 10-13 digits total.
	return /^((\+?880)|0)?1\d{9}$/.test(p);
};

const readOrders = (): unknown[] => {
	try {
		const raw = localStorage.getItem(ORDERS_KEY);
		const parsed = raw ? (JSON.parse(raw) as unknown) : [];
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
};

const writeOrders = (orders: unknown[]) => {
	try {
		localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
	} catch {
		// ignore
	}
};


const Checkout = () => {
	const navigate = useNavigate();
	const { items, subtotal, count, clearCart } = useCart();


	const [form, setForm] = useState<CheckoutCompactForm>({
		name: "",
		phone: "",
		email: "",
		division: "",
		district: "",
		upazila: "",
		postCode: "",
		address: "",
		coupon: "",
		agreeTerms: false,
		paymentChoice: "cod",
		deliveryChoice: "courier",
	});


	const [errors, setErrors] = useState<Record<string, string>>({});
	const [placed, setPlaced] = useState(false);

	const deliveryFee = 0; // frontend-only (you can wire this later)
	const discount = 0; // frontend-only

	const total = useMemo(() => Math.max(0, subtotal + deliveryFee - discount), [subtotal, deliveryFee, discount]);


	// Keep existing order logic minimal: only COD vs online toggle for UI.
	// (We still validate the core required fields like the previous version.)
	const validate = () => {
		const e: Record<string, string> = {};

		const name = safeTrim(form.name);
		const phone = safeTrim(form.phone);
		const address = safeTrim(form.address);

		if (!name) e.name = "নাম দিন";
		if (!phone) e.phone = "ফোন নম্বর দিন";
		else if (!isValidPhone(phone)) e.phone = "সঠিক ফোন নম্বর দিন";

		if (!address) e.address = "ঠিকানা দিন";

		if (items.length === 0) e.cart = "Cart empty";

		if (!form.agreeTerms) e.terms = "Please accept terms";

		setErrors(e);
		return Object.keys(e).length === 0;
	};


	const placeOrder = () => {
		if (!validate()) return;


		const order = {
			id: `gb_${Date.now()}`,
			createdAt: new Date().toISOString(),
			customer: {
				name: safeTrim(form.name),
				phone: safeTrim(form.phone),
				email: safeTrim(form.email),
				address: safeTrim(form.address),
				// Keep compatibility with previous storage shape
				area: [safeTrim(form.division), safeTrim(form.district), safeTrim(form.upazila)]
					.filter(Boolean)
					.join(", "),
				note: "",
			},
			payment: {
				method: form.paymentChoice,
				transactionId: "",
				senderNumber: "",
				bankName: "",
			},
			delivery: {
				method: form.deliveryChoice,
				postCode: safeTrim(form.postCode),
			},
			pricing: { subtotal, deliveryFee, discount, total },
			items: items.map((i) => ({
				key: i.key,
				productId: i.productId,
				name: i.name,
				variant: i.variant,
				unitPrice: i.unitPrice,
				quantity: i.quantity,
			})),
		};


		const prev = readOrders();
		writeOrders([order, ...prev].slice(0, 50));

		clearCart();
		setPlaced(true);
	};

	if (placed) {
		return (
			<div className="min-h-screen bg-background text-foreground">
				<StoreHeader />
				<main className="container py-10">
					<section className="rounded-2xl border bg-card p-6 sm:p-8">
						<h1 className="text-2xl font-extrabold tracking-tight">Order placed!</h1>
						<p className="mt-2 text-sm text-ink-muted">
							আপনার অর্ডার সফলভাবে সাবমিট হয়েছে (frontend-only demo)। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।
						</p>
						<div className="mt-6 flex flex-col gap-3 sm:flex-row">
							<Button type="button" onClick={() => navigate("/")}
							>Continue shopping</Button>
							<Button type="button" variant="outline" onClick={() => navigate("/category/offer-zone")}
							>Go to Offer</Button>
						</div>
					</section>
				</main>
				<StoreFooter />
			</div>
		);
	}


	return (
		<div className="min-h-screen bg-background text-foreground">
			<StoreHeader />

			<div className="container pt-5">
				<div className="flex items-center gap-3">
					<Link
						to="/"
						className="inline-flex items-center justify-center rounded-full border bg-background px-4 py-2 text-sm font-semibold text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
					>
						← Back
					</Link>
				</div>
			</div>

			<CheckoutCompactUI
				form={form}
				setForm={setForm}
				errors={errors}
				items={items}
				subtotal={subtotal}
				total={total}
				count={count}
				onPlaceOrder={placeOrder}
			/>

			<StoreFooter />
		</div>
	);
};

export default Checkout;

