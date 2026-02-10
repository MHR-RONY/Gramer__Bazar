import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/storefront/Index";
import ProductPreview from "./pages/storefront/ProductPreview";
import Checkout from "./pages/storefront/Checkout";
import CategoryListing from "./pages/storefront/CategoryListing";
import Profile from "./pages/storefront/Profile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminLogin from "./pages/admin/AdminLogin";
import CategoryPage from "./pages/storefront/Category";
import SearchResults from "./pages/storefront/SearchResults";
import NotFound from "./pages/NotFound";
import AllProducts from "./pages/storefront/AllProducts";
import { CartProvider } from "@/components/storefront/cart/CartProvider";
import { CartDrawer } from "@/components/storefront/cart/CartDrawer";
import { MobileBottomNav } from "@/components/storefront/MobileBottomNav";

const queryClient = new QueryClient();

const App = () => (
	<QueryClientProvider client={queryClient}>
		<TooltipProvider>
			<CartProvider>
				<Toaster />
				<Sonner />
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<Index />} />
						<Route path="/products" element={<AllProducts />} />
						<Route path="/category/:slug" element={<CategoryListing />} />
						<Route path="/product/:id" element={<ProductPreview />} />
						<Route path="/checkout" element={<Checkout />} />
						<Route path="/search" element={<SearchResults />} />
						<Route path="/profile" element={<Profile />} />
						<Route path="/admin" element={<AdminDashboard />} />
						<Route path="/admin/orders" element={<AdminOrders />} />
						<Route path="/admin/customers" element={<AdminCustomers />} />
						<Route path="/admin/payments" element={<AdminPayments />} />
						<Route path="/admin/settings" element={<AdminSettings />} />
						<Route path="/admin/login" element={<AdminLogin />} />
						<Route path="/category" element={<CategoryPage />} />
						{/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
						<Route path="*" element={<NotFound />} />
					</Routes>
					<CartDrawer />
					<MobileBottomNav />
				</BrowserRouter>
			</CartProvider>
		</TooltipProvider>
	</QueryClientProvider>
);

export default App;
