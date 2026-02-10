import { BadgeCheck, Clock, Package, Truck } from "lucide-react";

const items = [
	{
		title: "বিশ্বস্ত পণ্য",
		desc: "খাঁটি ও যাচাইকৃত",
		Icon: BadgeCheck,
	},
	{
		title: "দ্রুত ডেলিভারি",
		desc: "ঢাকার ভিতরে দ্রুত",
		Icon: Truck,
	},
	{
		title: "প্যাকেজিং",
		desc: "সতর্ক প্যাকিং",
		Icon: Package,
	},
	{
		title: "সাপোর্ট",
		desc: "হটলাইন/WhatsApp",
		Icon: Clock,
	},
];

export const TrustStrip = () => {
	return (
		<section className="bg-background">
			<div className="container pb-2">
				<div className="grid grid-cols-2 gap-2 sm:gap-3 rounded-2xl border bg-card p-3 sm:p-4 lg:grid-cols-4">
					{items.map(({ title, desc, Icon }) => (
						<div key={title} className="flex items-start gap-2 sm:gap-3">
							<div className="inline-flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-foreground">
								<Icon className="h-4 w-4 sm:h-5 sm:w-5" />
							</div>
							<div className="min-w-0">
								<div className="text-xs sm:text-sm font-extrabold text-foreground">{title}</div>
								<div className="text-[10px] sm:text-xs text-ink-muted">{desc}</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};
