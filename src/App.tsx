// src/App.tsx
import { useState } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { BackgroundDoodles } from "./components/BackgroundDoodles";
// Páginas existentes
import { HomePage } from "./pages/HomePage";
import { ProductsPage } from "./pages/ProductsPage";
import { PostresPage } from "./pages/PostresPage";
import { PasteleriaPage } from "./pages/PasteleriaPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
// NUEVAS Páginas e Imports
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { AuthProvider, useAuth } from "./contexts/AuthContext"; 
import { CartProvider } from "./contexts/CartContext";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import { OrdersPage } from "./pages/OrdersPage";

// Componente interno que contiene la lógica de navegación
function GlazeeShop() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  
  // Obtenemos el estado de la sesión
  const { isAuthenticated } = useAuth();

  const handleNavigate = (page: string, productId?: number) => {
    // --- LÓGICA DE PROTECCIÓN ---
    // Si intenta ir a pagar ('checkout') y NO está autenticado:
    if (page === 'checkout' && !isAuthenticated) {
       toast.info("Para realizar una compra, necesitas iniciar sesión o crear una cuenta.");
       setCurrentPage('login'); // Lo redirigimos al login
       return;
    }

    setCurrentPage(page);
    if (productId !== undefined) {
      setSelectedProductId(productId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background relative">
      <BackgroundDoodles />
      <div className="relative z-10">
        <Header currentPage={currentPage} onNavigate={handleNavigate} />
        
        {/* Rutas Públicas */}
        {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
        {currentPage === 'products' && <ProductsPage onNavigate={handleNavigate} />}
        {currentPage === 'postres' && <PostresPage onNavigate={handleNavigate} />}
        {currentPage === 'pasteleria' && <PasteleriaPage onNavigate={handleNavigate} />}
        {currentPage === 'product-detail' && selectedProductId && (
          <ProductDetailPage productId={selectedProductId} onNavigate={handleNavigate} />
        )}
        {currentPage === 'cart' && <CartPage onNavigate={handleNavigate} />}
        
        {/* Rutas de Autenticación */}
        {currentPage === 'login' && <LoginPage onNavigate={handleNavigate} />}
        {currentPage === 'register' && <RegisterPage onNavigate={handleNavigate} />}
        
        {/* Ruta Protegida (Solo se muestra si está autenticado) */}
        {currentPage === 'checkout' && isAuthenticated && (
          <CheckoutPage onNavigate={handleNavigate} />

        )}
            {currentPage === 'orders' && isAuthenticated && (
              <OrdersPage onNavigate={handleNavigate} />
            )}

        <Footer />
      </div>
      <Toaster />
    </div>
  );
}

// Componente Principal: Envuelve la tienda con los Proveedores (Auth y Cart)
export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <GlazeeShop />
      </CartProvider>
    </AuthProvider>
  );
}