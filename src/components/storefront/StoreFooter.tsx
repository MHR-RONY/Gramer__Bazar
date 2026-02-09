import { MapPin, Mail, Phone, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { categoryMenu } from "@/data/storefront";
import { MENU_TO_SLUG } from "@/data/categorySlugMap";

/* ── inline SVG social icons (stylish) ── */
const FacebookIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]">
		<path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 011-1h3v-4h-3a5 5 0 00-5 5v2.01h-2l-.396 3.98h2.396v8.01z" />
	</svg>
);

const InstagramIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
		<rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
		<path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
		<line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
	</svg>
);

const WhatsAppIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]">
		<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
	</svg>
);

const LinkedInIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]">
		<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
	</svg>
);

export const StoreFooter = () => {
	return (
		<>
		<footer className="bg-footer text-footer-foreground pb-16 lg:pb-0">
			{/* ── Gradient accent bar ── */}
			<div className="h-1.5 bg-gradient-to-r from-orange-600 via-amber-400 to-orange-600" />

			{/* ── Newsletter / CTA strip ── */}
			<div className="border-b border-footer-border bg-white/[0.03]">
				<div className="container flex flex-col items-center justify-between gap-4 py-6 sm:py-12 md:flex-row">
					<div className="text-center md:text-left">
						<h3 className="text-base sm:text-xl font-bold">
							Stay Connected with <span className="text-primary">Gramer Bazar</span>
						</h3>
						<p className="mt-1 text-xs sm:text-sm text-footer-muted">
							Get exclusive offers, new arrivals and fresh deals directly!
						</p>
					</div>
					<div className="flex w-full max-w-md items-center gap-0">
						<input
							type="email"
							placeholder="Enter your email address"
							className="h-10 sm:h-12 flex-1 rounded-l-lg border border-white/10 bg-white/5 px-3 sm:px-4 text-xs sm:text-sm text-white placeholder:text-gray-500 focus:border-primary focus:outline-none"
						/>
						<button
							type="button"
							className="flex h-10 sm:h-12 items-center gap-1.5 sm:gap-2 rounded-r-lg bg-primary px-4 sm:px-6 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-primary/80"
						>
							Subscribe
							<ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
						</button>
					</div>
				</div>
			</div>

			{/* ── Main footer content ── */}
			<div className="container pb-10 sm:pb-16" style={{ paddingTop: "2rem" }}>
				<div className="grid gap-8 sm:gap-12 grid-cols-2 lg:grid-cols-4">
					{/* On mobile the brand column spans full width */}
					{/* ── Brand Column ── */}
					<div className="col-span-2 lg:col-span-1 space-y-4 sm:space-y-6">
						<div>
							<div className="text-2xl sm:text-3xl font-extrabold tracking-tight">
								<span className="text-primary">Gramer</span> Bazar
							</div>
							<div className="mt-1 h-0.5 w-10 sm:w-12 rounded bg-primary" />
						</div>
						<p className="text-xs sm:text-sm leading-relaxed text-footer-muted">
							দেশি-খাঁটি খাবারের অনলাইন শপ। খাঁটি পণ্য, দ্রুত ডেলিভারি এবং ভালো সার্ভিস—সব এক
							জায়গায়।
						</p>

						{/* social icons */}
						<div className="flex items-center gap-3">
							{[
								{
									href: "https://www.facebook.com/devstationit",
									label: "Facebook",
									icon: <FacebookIcon />,
								},
								{
									href: "https://www.instagram.com/devstationit",
									label: "Instagram",
									icon: <InstagramIcon />,
								},
								{
									href: "https://api.whatsapp.com/send/?phone=8801577302590&text&type=phone_number&app_absent=0",
									label: "WhatsApp",
									icon: <WhatsAppIcon />,
								},
								{
									href: "https://www.linkedin.com/company/devstation-it/",
									label: "LinkedIn",
									icon: <LinkedInIcon />,
								},
							].map((s) => (
								<a
									key={s.label}
									href={s.href}
									target="_blank"
									rel="noopener noreferrer"
									className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-footer-muted transition-all duration-300 hover:scale-110 hover:border-white/40 hover:text-white hover:shadow-lg hover:shadow-white/10"
									aria-label={s.label}
								>
									{s.icon}
								</a>
							))}
						</div>
					</div>

					{/* ── Categories ── */}
					<div>
						<div className="mb-3 sm:mb-5 flex items-center gap-2">
							<div className="h-4 sm:h-5 w-1 rounded-full bg-primary" />
							<span className="text-xs sm:text-sm font-bold uppercase tracking-widest">Categories</span>
						</div>
						<ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
							{categoryMenu.slice(0, 8).map((c) => (
								<li key={c}>
									<Link
										to={`/category/${MENU_TO_SLUG[c]}`}
										className="text-footer-muted transition-colors hover:text-primary"
									>
										{c}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* ── Quick Links ── */}
					<div>
						<div className="mb-3 sm:mb-5 flex items-center gap-2">
							<div className="h-4 sm:h-5 w-1 rounded-full bg-primary" />
							<span className="text-xs sm:text-sm font-bold uppercase tracking-widest">Quick Links</span>
						</div>
						<ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
							{[
								{ label: "Home", href: "/" },
								{ label: "Shop", href: "/" },
								{ label: "Offer Zone", href: "/category/offer-zone" },
								{ label: "My Profile", href: "/profile" },
								{ label: "About Us", href: "/" },
								{ label: "Privacy Policy", href: "/" },
							].map((l) => (
								<li key={l.label}>
									<Link
										to={l.href}
										className="text-footer-muted transition-colors hover:text-primary"
									>
										{l.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* ── Contact & Address ── */}
					<div className="col-span-2 lg:col-span-1">
						<div className="mb-3 sm:mb-5 flex items-center gap-2">
							<div className="h-4 sm:h-5 w-1 rounded-full bg-primary" />
							<span className="text-xs sm:text-sm font-bold uppercase tracking-widest">Contact Us</span>
						</div>
						<div className="space-y-3 sm:space-y-5 text-xs sm:text-sm">
							<div className="flex items-start gap-4 text-footer-muted">
								<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15">
									<MapPin className="h-4 w-4 text-primary" />
								</div>
								<div>
									<div className="font-medium text-footer-foreground">Our Address</div>
									<div className="mt-0.5">Dhaka, Bangladesh</div>
								</div>
							</div>
							<div className="flex items-start gap-4 text-footer-muted">
								<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15">
									<Phone className="h-4 w-4 text-primary" />
								</div>
								<div>
									<div className="font-medium text-footer-foreground">Call Us</div>
									<div className="mt-0.5">+880 1577-302590</div>
								</div>
							</div>
							<div className="flex items-start gap-4 text-footer-muted">
								<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15">
									<Mail className="h-4 w-4 text-primary" />
								</div>
								<div>
									<div className="font-medium text-footer-foreground">Email Us</div>
									<div className="mt-0.5">info@gramerbazar.com</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* ── Bottom bar ── */}
			<div className="border-t border-footer-border bg-white/[0.02]">
				<div className="container flex flex-col items-center gap-2 sm:gap-4 py-4 sm:py-6 text-[10px] sm:text-xs text-footer-muted sm:flex-row sm:justify-between">
					<div>© {new Date().getFullYear()} Gramer Bazar. All rights reserved to <a href="https://devstationit.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">DevStation IT</a></div>
					<div className="flex items-center gap-1.5 sm:gap-2">
						<span className="inline-block h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-primary" />
						Quality products
						<span className="inline-block h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-primary" />
						Fast delivery
						<span className="inline-block h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-primary" />
						Great service
					</div>
				</div>
			</div>
		</footer>
		</>
	);
};

