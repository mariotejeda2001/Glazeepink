import { Hero } from "../components/Hero";
import { ProductCard } from "../components/ProductCard";
import { CategorySelector } from "../components/CategorySelector";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

interface HomePageProps {
  onNavigate: (page: string, productId?: number) => void;
}

// Productos destacados para la homepage
const featuredProducts = [
  {
    id: 2,
    name: "Cheesecake de Fresas",
    description: "Cremoso cheesecake con base de galleta y topping de fresas naturales y coulis de fresa.",
    price: 280,
    image: "https://images.unsplash.com/photo-1553882299-9601a48ebe6a?w=500",
    category: "Postres"
  },
  {
    id: 1,
    name: "Pastel de Cumpleaños",
    description: "Esponjoso pastel decorado con crema de mantequilla, cubierto con coloridos detalles y velas. Perfecto para hacer de tu celebración un momento inolvidable.",
    price: 350,
    image: "https://images.unsplash.com/photo-1635349135195-ea08a39fcc5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ0aGRheSUyMGNha2UlMjBjZWxlYnJhdGlvbnxlbnwxfHx8fDE3NjE1NDYzNjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Pastelería"
  },
  {
    id: 4,
    name: "Tiramisú Tradicional",
    description: "Auténtico tiramisú italiano con mascarpone, café expresso y cacao en polvo. Una delicia clásica.",
    price: 220,
    image: "https://images.unsplash.com/photo-1710106519622-8c49d0bcff2f?w=500",
    category: "Postres"
  },
  {
    id: 3,
    name: "Cupcakes de Vainilla",
    description: "Set de 6 cupcakes de vainilla con buttercream de diferentes sabores y decoraciones artesanales.",
    price: 180,
    image: "https://images.unsplash.com/photo-1658422928126-6120ea188353?w=500",
    category: "Pastelería"
  },
  {
    id: 12,
    name: "Pastel Red Velvet",
    description: "Clásico pastel de terciopelo rojo con frosting de queso crema. Suave, húmedo e irresistible.",
    price: 380,
    image: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=500",
    category: "Pastelería"
  },
  {
    id: 10,
    name: "Crème Brûlée",
    description: "Clásico postre francés con crema de vainilla y costra de azúcar caramelizada crujiente.",
    price: 205,
    image: "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=500",
    category: "Postres"
  }
];

export function HomePage({ onNavigate }: HomePageProps) {
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
              ¡Sabores únicos que solo encuentras en esta época del año!
            </p>
            
            {/* Imágenes destacadas de temporada */}
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
                  <p className="text-sm opacity-90">Sabores únicos de temporada</p>
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
                  <p className="text-sm opacity-90">Hasta 30% de descuento</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Productos más populares */}
          <div className="text-center mb-8">
            <h3 className="text-2xl lg:text-3xl font-bold text-primary mb-4">
              Nuestros Productos Más Populares
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Descubre los favoritos de nuestros clientes y las novedades de temporada
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} onNavigate={onNavigate} />
            ))}
          </div>
          
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

      {/* Category Selector - Navigate to specific pages */}
      <CategorySelector 
        onNavigate={(page) => {
          onNavigate(page);
        }} 
      />
    </>
  );
}
