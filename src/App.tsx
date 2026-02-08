import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ProductPreview from "./pages/ProductPreview";
import Checkout from "./pages/Checkout";
import CategoryListing from "./pages/CategoryListing";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrders from "./pages/AdminOrders";
import AdminCustomers from "./pages/AdminCustomers";
import AdminPayments from "./pages/AdminPayments";
import AdminSettings from "./pages/AdminSettings";
import AdminLogin from "./pages/AdminLogin";
import CategoryPage from "./pages/Category";
import SearchResults from "./pages/SearchResults";
import NotFound from "./pages/NotFound";
import { CartProvider } from "@/components/storefront/cart/CartProvider";
import { CartDrawer } from "@/components/storefront/cart/CartDrawer";

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
				</BrowserRouter>
			</CartProvider>
		</TooltipProvider>
	</QueryClientProvider>
);

export default App;
