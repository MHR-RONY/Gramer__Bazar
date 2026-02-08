import { categoryMenu } from "@/data/storefront";

/** Map each nav menu label → URL slug */
export const MENU_TO_SLUG: Record<(typeof categoryMenu)[number], string> = {
	"Offer Zone": "offer-zone",
	"Best Seller": "best-seller",
	Oil: "oil",
	"Ghee (ঘি)": "ghee",
	"Dates (খেজুর)": "dates",
	Honey: "honey",
	Masala: "masala",
	"Nuts & Seeds": "nuts-seeds",
	"Tea/Coffee": "tea-coffee",
	"Organic Zone": "organic-zone",
	HoneyComb: "honeycomb",
};

/** Map URL slug → nav menu label */
export const SLUG_TO_MENU: Record<string, (typeof categoryMenu)[number]> = Object.fromEntries(
	Object.entries(MENU_TO_SLUG).map(([k, v]) => [v, k]),
) as Record<string, (typeof categoryMenu)[number]>;
