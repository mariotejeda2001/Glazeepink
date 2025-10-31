import { useState } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { BackgroundDoodles } from "./components/BackgroundDoodles";
import { HomePage } from "./pages/HomePage";
import { ProductsPage } from "./pages/ProductsPage";
import { PostresPage } from "./pages/PostresPage";
import { PasteleriaPage } from "./pages/PasteleriaPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { CartProvider } from "./contexts/CartContext";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  const handleNavigate = (page: string, productId?: number) => {
    setCurrentPage(page);
    if (productId !== undefined) {
      setSelectedProductId(productId);
    }
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-background relative">
        <BackgroundDoodles />
        <div className="relative z-10">
          <Header currentPage={currentPage} onNavigate={handleNavigate} />
          
          {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
          {currentPage === 'products' && <ProductsPage onNavigate={handleNavigate} />}
          {currentPage === 'postres' && <PostresPage onNavigate={handleNavigate} />}
          {currentPage === 'pasteleria' && <PasteleriaPage onNavigate={handleNavigate} />}
          {currentPage === 'product-detail' && selectedProductId && (
            <ProductDetailPage productId={selectedProductId} onNavigate={handleNavigate} />
          )}
          {currentPage === 'cart' && <CartPage onNavigate={handleNavigate} />}
          {currentPage === 'checkout' && <CheckoutPage onNavigate={handleNavigate} />}

          <Footer />
        </div>
        <Toaster />
      </div>
    </CartProvider>
  );
}
