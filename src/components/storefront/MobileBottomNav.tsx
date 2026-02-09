import { Home, Package, ShoppingCart, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "@/components/storefront/cart/CartProvider";

const navItems = [
	{ label: "Home", icon: Home, to: "/" },
	{ label: "Products", icon: Package, to: "/products" },
	{ label: "Cart", icon: ShoppingCart, to: "__cart__" },
	{ label: "Profile", icon: User, to: "/profile" },
] as const;

export const MobileBottomNav = () => {
	const location = useLocation();
	const { openCart, count } = useCart();

	// Hide on admin pages
	if (location.pathname.startsWith("/admin")) return null;

	return (
		<nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:hidden">
			<div className="flex items-center justify-around">
				{navItems.map((item) => {
					const isCart = item.to === "__cart__";
					const isActive = !isCart && location.pathname === item.to;

					if (isCart) {
						return (
							<button
								key={item.label}
								type="button"
								onClick={openCart}
								className="relative flex flex-1 flex-col items-center gap-0.5 py-2 text-muted-foreground transition-colors hover:text-primary"
							>
								<div className="relative">
									<item.icon className="h-5 w-5" />
									{count > 0 && (
										<span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
											{count}
										</span>
									)}
								</div>
								<span className="text-[10px] font-medium">{item.label}</span>
							</button>
						);
					}

					return (
						<Link
							key={item.label}
							to={item.to}
							className={
								"flex flex-1 flex-col items-center gap-0.5 py-2 transition-colors " +
								(isActive
									? "text-primary"
									: "text-muted-foreground hover:text-primary")
							}
						>
							<item.icon className="h-5 w-5" />
							<span className="text-[10px] font-medium">{item.label}</span>
						</Link>
					);
				})}
			</div>
		</nav>
	);
};
