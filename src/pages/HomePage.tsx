import { useState, useEffect } from "react";
import { Hero } from "../components/Hero";
import { ProductCard } from "../components/ProductCard";
import { CategorySelector } from "../components/CategorySelector";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

interface HomePageProps {
  onNavigate: (page: string, productId?: number) => void;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4242';
    
    // Obtenemos todos y tomamos los primeros 6 como "destacados"
    fetch(`${apiUrl}/api/products`)
      .then(res => res.json())
      .then(data => {
        // Si quieres aleatorios: data.sort(() => 0.5 - Math.random()).slice(0, 6)
        setFeaturedProducts(data.slice(0, 6)); 
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Hero onNavigate={onNavigate} />
      
      {/* Featured Products Section */}
      <section id="productos-destacados" className="py-16 bg-background relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Hero de temporada y ofertas */}
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-primary/20">
              ✨ Especiales de Temporada
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-primary mb-6">
              Postres de Temporada y Ofertas
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Deléitate con nuestras creaciones especiales de temporada y aprovecha nuestras ofertas exclusivas.
            </p>
            
            {/* Imágenes estáticas de marketing (estas se pueden quedar fijas o venir de un CMS) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
              <div className="relative group overflow-hidden rounded-2xl shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1704819353665-7337e5692414?w=600"
                  alt="Postres especiales de temporada"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <Badge className="bg-primary text-white mb-2">🎄 Temporada Navideña</Badge>
                  <h3 className="font-bold text-lg">Postres Especiales</h3>
                </div>
              </div>
              
              <div className="relative group overflow-hidden rounded-2xl shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1607877107150-de8a24f3900b?w=600"
                  alt="Ofertas especiales en postres"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <Badge className="bg-red-500 text-white mb-2">🔥 Oferta Especial</Badge>
                  <h3 className="font-bold text-lg">Descuentos Exclusivos</h3>
                </div>
              </div>
            </div>
          </div>
          
          {/* Productos más populares (desde BD) */}
          <div className="text-center mb-8">
            <h3 className="text-2xl lg:text-3xl font-bold text-primary mb-4">
              Nuestros Productos Más Populares
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Descubre los favoritos de nuestros clientes
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">Cargando destacados...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  {...product}
                  image={product.images[0] || ''} 
                  onNavigate={onNavigate} 
                />
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90"
              onClick={() => onNavigate('products')}
            >
              Ver Catálogo Completo
            </Button>
          </div>
        </div>
      </section>

      <CategorySelector onNavigate={onNavigate} />
    </>
  );
}