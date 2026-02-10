import { Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { useCart } from "@/components/storefront/cart/CartProvider";

const Price = ({ value }: { value: number }) => (
	<span className="tabular-nums">৳{value.toLocaleString("en-US", { maximumFractionDigits: 0 })}</span>
);

export const CartDrawer = () => {
	const { isOpen, closeCart, items, subtotal, inc, dec, remove, count } = useCart();

	return (
		<Sheet open={isOpen} onOpenChange={(open) => (open ? null : closeCart())}>
			<SheetContent className="p-0" side="right">
				<div className="flex h-full flex-col">
					<SheetHeader className="border-b p-6">
						<SheetTitle>Cart</SheetTitle>
						<SheetDescription>
							{count > 0 ? `${count} item(s) added` : "Cart is empty"}
						</SheetDescription>
					</SheetHeader>

					<div className="flex-1 overflow-auto p-6">
						{items.length === 0 ? (
							<div className="rounded-xl border bg-card p-4 text-sm text-ink-muted">
								No items yet. Add from any product page.
							</div>
						) : (
							<ul className="space-y-4">
								{items.map((i) => (
									<li key={i.key} className="rounded-xl border bg-card p-4">
										<div className="flex gap-3">
											<img
												src={i.imageUrl}
												alt={i.name}
												className="h-14 w-14 shrink-0 rounded-lg object-cover"
												loading="lazy"
											/>

											<div className="min-w-0 flex-1">
												<div className="flex items-start justify-between gap-3">
													<div className="min-w-0">
														<div className="line-clamp-2 text-sm font-extrabold text-foreground">
															{i.name}
														</div>
														<div className="mt-1 text-xs text-ink-muted">Variant: {i.variant}</div>
													</div>
													<button
														type="button"
														onClick={() => remove(i.key)}
														className="inline-flex items-center justify-center rounded-md border bg-background p-2 text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
														aria-label="Remove item"
													>
														<Trash2 className="h-4 w-4" />
													</button>
												</div>

												<div className="mt-3 flex items-center justify-between gap-2">
													<div className="inline-flex items-center gap-1 rounded-md border bg-background p-0.5">
														<Button
															type="button"
															variant="ghost"
															size="icon"
															onClick={() => dec(i.key)}
															aria-label="Decrease quantity"
															className="h-7 w-7"
														>
															<Minus className="h-3.5 w-3.5" />
														</Button>
														<div className="min-w-7 text-center text-sm font-bold tabular-nums">
															{i.quantity}
														</div>
														<Button
															type="button"
															variant="ghost"
															size="icon"
															onClick={() => inc(i.key)}
															aria-label="Increase quantity"
															className="h-7 w-7"
														>
															<Plus className="h-3.5 w-3.5" />
														</Button>
													</div>

													<div className="text-right">
														<div className="text-base font-extrabold">
															<Price value={i.unitPrice * i.quantity} />
														</div>
														<div className="text-xs text-ink-muted">
															<Price value={i.unitPrice} /> / item
														</div>
													</div>
												</div>
											</div>
										</div>
									</li>
								))}
							</ul>
						)}
					</div>

					<div className="border-t p-6">
						<div className="flex items-center justify-between text-sm">
							<div className="text-ink-muted">Subtotal</div>
							<div className="text-lg font-extrabold">
								<Price value={subtotal} />
							</div>
						</div>
						<Button type="button" className="mt-4 w-full" disabled={items.length === 0} asChild>
							<Link to="/checkout" onClick={closeCart}>
								Checkout
							</Link>
						</Button>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
};
