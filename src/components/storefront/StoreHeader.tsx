import { Phone, Search, ShoppingCart, User } from "lucide-react";
import { categoryMenu } from "@/data/storefront";
import { useCart } from "@/components/storefront/cart/CartProvider";

const InfoBar = () => {
	return (
		<div className="bg-topbar text-topbar-foreground">
			<div className="container">
				<div className="flex min-h-10 items-center justify-center gap-2 py-2 text-sm font-medium">
					<Phone className="h-4 w-4 shrink-0" />
					<span>
						আমাদের যে কোন পণ্য অর্ডার করতে কল বা WhatsApp করুন: +8801577302590 হট লাইন:
						09000000000
					</span>
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
	const { openCart } = useCart();

	return (
		<header className="sticky top-0 z-40 w-full bg-header text-header-foreground">
			<InfoBar />

			<div className="border-b bg-header/70 backdrop-blur supports-[backdrop-filter]:bg-header/60">
				<div className="container">
					<div className="flex items-center justify-between gap-3 py-3">
						<div className="flex items-center gap-3">
							<a href="/" className="leading-none">
								<img
									src="https://res.cloudinary.com/dreby3qi3/image/upload/v1770491278/Untitled_240_x_60_px_ttkwjj.png"
									alt="Gramer Bazar"
									className="h-14 w-auto object-contain"
								/>
							</a>
						</div>

						<div className="ml-auto flex items-center gap-2">
							<IconButton label="Search">
								<Search className="h-5 w-5" />
							</IconButton>
							<IconButton label="Cart" onClick={openCart}>
								<ShoppingCart className="h-5 w-5" />
							</IconButton>
							<a
								href="/profile"
								aria-label="User profile"
								className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border/70 bg-background/70 text-foreground transition-colors hover:bg-accent"
							>
								<User className="h-5 w-5" />
							</a>
						</div>
					</div>
				</div>

				{/* Full-width category bar (desktop) */}
				<div className="hidden lg:block border-t bg-background">
					<div className="container">
						<nav className="w-full">
							<ul className="flex w-full flex-wrap items-center justify-center gap-x-6 gap-y-2 py-2">
								{categoryMenu.map((item) => {
									const href = item === "Offer Zone" ? "/offer" : `/category/${encodeURIComponent(item)}`;
									return (
										<li key={item}>
											<a
												href={href}
												className="nav-underline rounded-md px-1 py-1 text-sm font-semibold text-foreground/75 transition-colors hover:text-primary"
											>
												{item}
											</a>
										</li>
									);
								})}
							</ul>
						</nav>
					</div>
				</div>

				{/* Mobile category scroller */}
				<div className="lg:hidden">
					<div className="container pb-3">
						<div className="flex gap-2 overflow-x-auto whitespace-nowrap pr-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
							{categoryMenu.map((item) => {
								const href = item === "Offer Zone" ? "/offer" : `/category/${encodeURIComponent(item)}`;
								return (
									<a
										key={item}
										href={href}
										className="nav-underline shrink-0 rounded-full border bg-background px-3 py-1.5 text-sm text-foreground/80 transition-colors hover:bg-accent hover:text-primary"
									>
										{item}
									</a>
								);
							})}
						</div>
					</div>
				</div>
			</div>
		</header>
	);
};
