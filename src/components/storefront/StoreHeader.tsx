import { useEffect, useMemo, useRef, useState } from "react";
import { Menu, Phone, Search, ShoppingCart, User, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { categoryMenu, demoProducts } from "@/data/storefront";
import { MENU_TO_SLUG } from "@/data/storefront/categorySlugMap";
import { useCart } from "@/components/storefront/cart/CartProvider";

const InfoBar = () => {
	const [visible, setVisible] = useState(true);
	const lastScrollY = useRef(0);

	useEffect(() => {
		const onScroll = () => {
			const y = window.scrollY;
			if (y > 60) {
				setVisible(false);
			} else {
				setVisible(true);
			}
			lastScrollY.current = y;
		};
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	return (
		<div
			className={
				"bg-topbar text-topbar-foreground overflow-hidden transition-all duration-300 " +
				(visible ? "max-h-12 opacity-100" : "max-h-0 opacity-0")
			}
		>
			{/* Desktop: centered, no marquee */}
			<div className="hidden sm:flex min-h-10 items-center justify-center gap-2 py-2 text-sm font-medium container">
				<Phone className="h-4 w-4 shrink-0" />
				<span>
					আমাদের যে কোন পণ্য অর্ডার করতে কল বা WhatsApp করুন: +8801577302590 হট লাইন:
					09000000000
				</span>
			</div>
			{/* Mobile: single-line marquee */}
			<div className="sm:hidden whitespace-nowrap overflow-hidden">
				<div className="inline-block animate-marquee py-2 text-sm font-medium">
					<Phone className="mr-1.5 inline h-4 w-4 align-text-bottom" />
					আমাদের যে কোন পণ্য অর্ডার করতে কল বা WhatsApp করুন: +8801577302590 হট লাইন:
					09000000000
				</div>
			</div>
		</div>
	);
};

const IconButton = ({
	label,
	children,
	onClick,
}: {
	label: string;
	children: React.ReactNode;
	onClick?: () => void;
}) => (
	<button
		type="button"
		aria-label={label}
		onClick={onClick}
		className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border/70 bg-background/70 text-foreground transition-colors hover:bg-accent"
	>
		{children}
	</button>
);

export const StoreHeader = () => {
	const { openCart, count } = useCart();
	const navigate = useNavigate();
	const [query, setQuery] = useState("");
	const [focused, setFocused] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const wrapperRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	/* Close dropdown on click outside */
	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
				setFocused(false);
			}
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, []);

	/* Close on Escape */
	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				setFocused(false);
				inputRef.current?.blur();
			}
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, []);

	const results = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (q.length < 2) return [];
		return demoProducts.filter(
			(p) =>
				p.name.toLowerCase().includes(q) ||
				p.category.toLowerCase().includes(q)
		).slice(0, 8);
	}, [query]);

	const showDropdown = focused && query.trim().length >= 2;

	return (
		<header className="sticky top-0 z-40 w-full bg-header text-header-foreground">
			<InfoBar />

			<div className="border-b bg-header/70 backdrop-blur supports-[backdrop-filter]:bg-header/60">
				<div className="container">
					<div className="flex items-center gap-3 py-3">
						{/* Logo */}
						<div className="shrink-0">
							<Link to="/" className="leading-none">
								<img
									src="https://res.cloudinary.com/dreby3qi3/image/upload/v1770491278/Untitled_240_x_60_px_ttkwjj.png"
									alt="Gramer Bazar"
									className="h-9 sm:h-14 w-auto object-contain"
								/>
							</Link>
						</div>

						{/* Search bar — takes up remaining space */}
						<div ref={wrapperRef} className="relative min-w-0 flex-1 max-w-2xl mx-auto">
							<div
								className={
									"flex items-center gap-1.5 sm:gap-2 rounded-xl border-2 bg-background px-2.5 sm:px-4 py-2 sm:py-2.5 transition-all " +
									(focused
										? "border-primary shadow-md shadow-primary/10"
										: "border-border/60 hover:border-primary/40")
								}
							>
								<Search className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-muted-foreground" />
								<input
									ref={inputRef}
									type="text"
									value={query}
									onChange={(e) => setQuery(e.target.value)}
									onFocus={() => setFocused(true)}
									onKeyDown={(e) => {
										if (e.key === "Enter" && query.trim().length >= 1) {
											setFocused(false);
											inputRef.current?.blur();
											navigate(`/search?q=${encodeURIComponent(query.trim())}`);
										}
									}}
									placeholder="Search products... (e.g. Honey, Oil, Ghee)"
									className="min-w-0 flex-1 bg-transparent text-xs sm:text-sm text-foreground placeholder:text-muted-foreground outline-none"
								/>
								{query && (
									<button
										type="button"
										onClick={() => { setQuery(""); inputRef.current?.focus(); }}
										className="inline-flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
									>
										<X className="h-3.5 w-3.5" />
									</button>
								)}
							</div>

							{/* Results dropdown */}
							{showDropdown && (
								<div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-[60vh] overflow-y-auto rounded-xl border bg-card shadow-2xl">
									{results.length === 0 ? (
										<p className="px-4 py-6 text-center text-sm text-muted-foreground">
											No products found for "<span className="font-semibold text-foreground">{query}</span>"
										</p>
									) : (
										<ul className="p-1.5">
											{results.map((p) => (
												<li key={p.id}>
													<button
														type="button"
														onClick={() => {
															setFocused(false);
															setQuery("");
															navigate(`/product/${p.id}`);
														}}
														className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-accent"
													>
														<img
															src={p.imageUrl}
															alt={p.name}
															className="h-12 w-12 shrink-0 rounded-lg border object-cover"
														/>
														<div className="min-w-0 flex-1">
															<p className="truncate text-sm font-semibold text-foreground">{p.name}</p>
															<p className="text-xs text-muted-foreground">{p.category}</p>
														</div>
														<div className="text-right shrink-0">
															<p className="text-sm font-bold text-primary">৳{p.discountedPrice}</p>
															{p.originalPrice > p.discountedPrice && (
																<p className="text-xs text-muted-foreground line-through">৳{p.originalPrice}</p>
															)}
														</div>
													</button>
												</li>
											))}
										</ul>
									)}
								</div>
							)}
						</div>

						{/* Right icons — hidden on mobile (shown in bottom nav) */}
						<div className="shrink-0 hidden lg:flex items-center gap-2">
							<button
								type="button"
								aria-label="Cart"
								onClick={openCart}
								className="relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-border/70 bg-background/70 text-foreground transition-colors hover:bg-accent"
							>
								<ShoppingCart className="h-5 w-5" />
								{count > 0 && (
									<span className="absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold leading-none text-white">
										{count}
									</span>
								)}
							</button>
							<Link
								to="/profile"
								aria-label="User profile"
								className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border/70 bg-background/70 text-foreground transition-colors hover:bg-accent"
							>
								<User className="h-5 w-5" />
							</Link>
						</div>

						{/* Hamburger menu button — mobile only */}
						<div className="shrink-0 lg:hidden">
							<button
								type="button"
								aria-label="Menu"
								onClick={() => setMobileMenuOpen(true)}
								className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border/70 bg-background/70 text-foreground transition-colors hover:bg-accent"
							>
								<Menu className="h-5 w-5" />
							</button>
						</div>

						{/* Side drawer overlay + panel */}
						{mobileMenuOpen && (
							<div className="fixed inset-0 z-[100] lg:hidden">
								{/* Backdrop */}
								<div
									className="absolute inset-0 bg-black/40 animate-fade-in"
									onClick={() => setMobileMenuOpen(false)}
								/>
								{/* Drawer */}
								<div className="absolute right-0 top-0 h-full w-72 bg-card shadow-2xl animate-slide-in-right flex flex-col">
									{/* Header */}
									<div className="flex items-center justify-between border-b px-4 py-3">
										<span className="text-base font-bold text-foreground">মেনু</span>
										<button
											type="button"
											aria-label="Close menu"
											onClick={() => setMobileMenuOpen(false)}
											className="inline-flex h-8 w-8 items-center justify-center rounded-md text-foreground hover:bg-accent"
										>
											<X className="h-5 w-5" />
										</button>
									</div>
									{/* Categories */}
									<div className="flex-1 overflow-y-auto p-3">
										<p className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
											Categories
										</p>
										{categoryMenu.map((item) => {
											const slug = MENU_TO_SLUG[item];
											const to = `/category/${slug}`;
											return (
												<Link
													key={item}
													to={to}
													onClick={() => setMobileMenuOpen(false)}
													className="flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-primary"
												>
													{item}
												</Link>
											);
										})}
									</div>
								</div>
							</div>
						)}
					</div>
				</div>

				{/* Full-width category bar (desktop) */}
				<div className="hidden lg:block border-t bg-background">
					<div className="container">
						<nav className="w-full">
							<ul className="flex w-full flex-wrap items-center justify-center gap-x-6 gap-y-2 py-2">
								{categoryMenu.map((item) => {
									const slug = MENU_TO_SLUG[item];
									const to = `/category/${slug}`;
									return (
										<li key={item}>
											<Link
												to={to}
												className="nav-underline rounded-md px-1 py-1 text-sm font-semibold text-foreground/75 transition-colors hover:text-primary"
											>
												{item}
											</Link>
										</li>
									);
								})}
							</ul>
						</nav>
					</div>
				</div>

			</div>

		</header>
	);
};
