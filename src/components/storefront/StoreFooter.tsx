import { MapPin, Mail, Phone, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { categoryMenu } from "@/data/storefront";
import { MENU_TO_SLUG } from "@/data/categorySlugMap";

/* ── inline SVG social icons (larger) ── */
const FacebookIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
		<path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
	</svg>
);

const InstagramIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
		<path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.97.24 2.43.403a4.088 4.088 0 011.523.99 4.088 4.088 0 01.99 1.524c.163.46.349 1.26.403 2.43.058 1.265.07 1.645.07 4.849s-.012 3.584-.07 4.85c-.054 1.17-.24 1.97-.403 2.43a4.088 4.088 0 01-.99 1.523 4.088 4.088 0 01-1.524.99c-.46.163-1.26.349-2.43.403-1.265.058-1.645.07-4.849.07s-3.584-.012-4.85-.07c-1.17-.054-1.97-.24-2.43-.403a4.088 4.088 0 01-1.523-.99 4.088 4.088 0 01-.99-1.524c-.163-.46-.349-1.26-.403-2.43C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.054-1.17.24-1.97.403-2.43a4.088 4.088 0 01.99-1.523A4.088 4.088 0 015.15 2.636c.46-.163 1.26-.349 2.43-.403C8.845 2.175 9.225 2.163 12 2.163zm0 1.802c-3.153 0-3.506.012-4.744.069-1.144.052-1.765.243-2.178.404a3.637 3.637 0 00-1.35.879 3.637 3.637 0 00-.879 1.35c-.161.413-.352 1.034-.404 2.178C2.388 9.082 2.376 9.435 2.376 12s.012 2.918.069 4.156c.052 1.144.243 1.765.404 2.178.192.502.444.927.879 1.35.423.435.848.687 1.35.879.413.161 1.034.352 2.178.404 1.238.057 1.591.069 4.744.069s3.506-.012 4.744-.069c1.144-.052 1.765-.243 2.178-.404a3.637 3.637 0 001.35-.879c.435-.423.687-.848.879-1.35.161-.413.352-1.034.404-2.178.057-1.238.069-1.591.069-4.744s-.012-3.506-.069-4.744c-.052-1.144-.243-1.765-.404-2.178a3.637 3.637 0 00-.879-1.35 3.637 3.637 0 00-1.35-.879c-.413-.161-1.034-.352-2.178-.404C15.506 3.977 15.153 3.965 12 3.965zm0 3.067a4.968 4.968 0 110 9.936 4.968 4.968 0 010-9.936zm0 1.802a3.166 3.166 0 100 6.332 3.166 3.166 0 000-6.332zm5.168-2.11a1.162 1.162 0 110 2.323 1.162 1.162 0 010-2.323z" />
	</svg>
);

const WhatsAppIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
		<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
	</svg>
);

const YouTubeIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
		<path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
	</svg>
);

export const StoreFooter = () => {
	return (
		<footer className="bg-footer text-footer-foreground">
			{/* ── Gradient accent bar ── */}
			<div className="h-1.5 bg-gradient-to-r from-orange-600 via-amber-400 to-orange-600" />

			{/* ── Newsletter / CTA strip ── */}
			<div className="border-b border-footer-border bg-white/[0.03]">
				<div className="container flex flex-col items-center justify-between gap-5 py-12 md:flex-row">
					<div>
						<h3 className="text-xl font-bold">
							Stay Connected with <span className="text-primary">Gramer Bazar</span>
						</h3>
						<p className="mt-1 text-sm text-footer-muted">
							Get exclusive offers, new arrivals and fresh deals directly!
						</p>
					</div>
					<div className="flex w-full max-w-md items-center gap-0">
						<input
							type="email"
							placeholder="Enter your email address"
							className="h-12 flex-1 rounded-l-lg border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-gray-500 focus:border-primary focus:outline-none"
						/>
						<button
							type="button"
							className="flex h-12 items-center gap-2 rounded-r-lg bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary/80"
						>
							Subscribe
							<ArrowRight className="h-4 w-4" />
						</button>
					</div>
				</div>
			</div>

			{/* ── Main footer content ── */}
			<div className="container pb-16" style={{ paddingTop: "4rem" }}>
				<div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
					{/* ── Brand Column ── */}
					<div className="space-y-6">
						<div>
							<div className="text-3xl font-extrabold tracking-tight">
								<span className="text-primary">Gramer</span> Bazar
							</div>
							<div className="mt-1 h-0.5 w-12 rounded bg-primary" />
						</div>
						<p className="text-sm leading-relaxed text-footer-muted">
							দেশি-খাঁটি খাবারের অনলাইন শপ। খাঁটি পণ্য, দ্রুত ডেলিভারি এবং ভালো সার্ভিস—সব এক
							জায়গায়।
						</p>

						{/* social icons */}
						<div className="flex items-center gap-3">
							{[
								{
									href: "https://facebook.com",
									label: "Facebook",
									icon: <FacebookIcon />,
									hover: "hover:bg-blue-600 hover:shadow-blue-600/30",
								},
								{
									href: "https://instagram.com",
									label: "Instagram",
									icon: <InstagramIcon />,
									hover: "hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-pink-500 hover:to-purple-600 hover:shadow-pink-500/30",
								},
								{
									href: "https://wa.me/8801577302590",
									label: "WhatsApp",
									icon: <WhatsAppIcon />,
									hover: "hover:bg-green-600 hover:shadow-green-600/30",
								},
								{
									href: "https://youtube.com",
									label: "YouTube",
									icon: <YouTubeIcon />,
									hover: "hover:bg-red-600 hover:shadow-red-600/30",
								},
							].map((s) => (
								<a
									key={s.label}
									href={s.href}
									target="_blank"
									rel="noopener noreferrer"
									className={`flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-footer-muted transition-all duration-300 hover:border-transparent hover:text-white hover:shadow-lg ${s.hover}`}
									aria-label={s.label}
								>
									{s.icon}
								</a>
							))}
						</div>
					</div>

					{/* ── Categories ── */}
					<div>
						<div className="mb-5 flex items-center gap-2">
							<div className="h-5 w-1 rounded-full bg-primary" />
							<span className="text-sm font-bold uppercase tracking-widest">Categories</span>
						</div>
						<ul className="space-y-3 text-sm">
							{categoryMenu.slice(0, 8).map((c) => (
								<li key={c}>
									<Link
										to={`/category/${MENU_TO_SLUG[c]}`}
										className="group flex items-center gap-2 text-footer-muted transition-colors hover:text-primary"
									>
										<span className="inline-block h-1 w-1 rounded-full bg-footer-muted transition-colors group-hover:bg-primary" />
										{c}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* ── Quick Links ── */}
					<div>
						<div className="mb-5 flex items-center gap-2">
							<div className="h-5 w-1 rounded-full bg-primary" />
							<span className="text-sm font-bold uppercase tracking-widest">Quick Links</span>
						</div>
						<ul className="space-y-3 text-sm">
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
										className="group flex items-center gap-2 text-footer-muted transition-colors hover:text-primary"
									>
										<span className="inline-block h-1 w-1 rounded-full bg-footer-muted transition-colors group-hover:bg-primary" />
										{l.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* ── Contact & Address ── */}
					<div>
						<div className="mb-5 flex items-center gap-2">
							<div className="h-5 w-1 rounded-full bg-primary" />
							<span className="text-sm font-bold uppercase tracking-widest">Contact Us</span>
						</div>
						<div className="space-y-5 text-sm">
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
				<div className="container flex flex-col items-center gap-4 py-6 text-xs text-footer-muted sm:flex-row sm:justify-between">
					<div>© {new Date().getFullYear()} Gramer Bazar. All rights reserved.</div>
					<div className="flex items-center gap-2">
						<span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
						Quality products
						<span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
						Fast delivery
						<span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
						Great service
					</div>
				</div>
			</div>
		</footer>
	);
};

