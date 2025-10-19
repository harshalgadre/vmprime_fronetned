import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext"; // Import CartProvider
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import NotFound from "./pages/NotFound";
import CartPage from "./pages/CartPage"; // Import CartPage
import CheckoutPage from "./pages/CheckoutPage"; // Import CheckoutPage
import OrderTrackingPage from "./pages/OrderTrackingPage"; // Import OrderTrackingPage
import Dashboard from "./pages/admin/Dashboard";
import ProductsPage from "./pages/admin/ProductsPage";
import OrdersPage from "./pages/admin/OrdersPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider> {/* Wrap the entire app with CartProvider */}
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faqs" element={<FAQ />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/orders/:orderId?" element={<OrderTrackingPage />} />
              
              {/* Protected Admin Routes */}
              <Route path="/admin" element={<Dashboard />}>
                <Route index element={<ProductsPage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="orders" element={<OrdersPage />} />
              </Route>

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;