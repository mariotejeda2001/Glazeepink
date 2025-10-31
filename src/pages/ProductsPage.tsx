import { useState, useMemo } from "react";
import { ProductCard } from "../components/ProductCard";
import { CategorySelector } from "../components/CategorySelector";
import { ProductFilters } from "../components/ProductFilters";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Filter, ArrowUpDown, Menu } from "lucide-react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  flavors: string[];
}

const allProducts: Product[] = [
  {
    id: 2,
    name: "Cheesecake de Fresas",
    description: "Cremoso cheesecake con base de galleta y topping de fresas naturales y coulis de fresa.",
    price: 280,
    image: "https://images.unsplash.com/photo-1553882299-9601a48ebe6a?w=500",
    category: "Postres",
    flavors: ["Fresa"]
  },
  {
    id: 4,
    name: "Tiramisú Tradicional",
    description: "Auténtico tiramisú italiano con mascarpone, café expresso y cacao en polvo. Una delicia clásica.",
    price: 220,
    image: "https://images.unsplash.com/photo-1710106519622-8c49d0bcff2f?w=500",
    category: "Postres",
    flavors: ["Café", "Chocolate"]
  },
  {
    id: 7,
    name: "Mousse de Chocolate",
    description: "Suave mousse de chocolate belga con crema batida y virutas de chocolate. Un clásico irresistible.",
    price: 195,
    image: "https://images.unsplash.com/photo-1702566039177-5b39c2126486?w=500",
    category: "Postres",
    flavors: ["Chocolate"]
  },
  {
    id: 8,
    name: "Panna Cotta de Vainilla",
    description: "Delicada panna cotta italiana con salsa de frutos rojos y flores comestibles.",
    price: 175,
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500",
    category: "Postres",
    flavors: ["Vainilla", "Frutas"]
  },
  {
    id: 9,
    name: "Brownie con Helado",
    description: "Brownie de chocolate caliente con helado de vainilla y salsa de caramelo.",
    price: 165,
    image: "https://images.unsplash.com/photo-1702827402870-7c33dc7b67be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm93bmllJTIwaWNlJTIwY3JlYW18ZW58MXx8fHwxNzYxODYxNDc3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Postres",
    flavors: ["Chocolate", "Vainilla", "Caramelo"]
  },
  {
    id: 10,
    name: "Crème Brûlée",
    description: "Clásico postre francés con crema de vainilla y costra de azúcar caramelizada crujiente.",
    price: 205,
    image: "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=500",
    category: "Postres",
    flavors: ["Vainilla", "Caramelo"]
  },
  {
    id: 1,
    name: "Tarta de Chocolate Premium",
    description: "Deliciosa tarta de chocolate negro con ganache y fresas frescas. Perfecta para celebraciones especiales.",
    price: 350,
    image: "https://images.unsplash.com/photo-1745342542427-93d9acdabd20?w=500",
    category: "Pastelería",
    flavors: ["Chocolate", "Fresa"]
  },
  {
    id: 3,
    name: "Cupcakes de Vainilla",
    description: "Set de 6 cupcakes de vainilla con buttercream de diferentes sabores y decoraciones artesanales.",
    price: 180,
    image: "https://images.unsplash.com/photo-1658422928126-6120ea188353?w=500",
    category: "Pastelería",
    flavors: ["Vainilla"]
  },
  {
    id: 5,
    name: "Tarta de Boda Elegante",
    description: "Hermosa tarta de 3 pisos para bodas, personalizable en sabores y decoración según tus preferencias.",
    price: 1500,
    image: "https://images.unsplash.com/photo-1584158531319-96912adae663?w=500",
    category: "Pastelería",
    flavors: ["Vainilla", "Chocolate"]
  },
  {
    id: 6,
    name: "Pastelería Variada",
    description: "Selección de mini pasteles y petits fours perfectos para eventos y celebraciones empresariales.",
    price: 450,
    image: "https://images.unsplash.com/photo-1652365283468-c507a8fc0dd8?w=500",
    category: "Pastelería",
    flavors: ["Chocolate", "Vainilla", "Frutas"]
  },
  {
    id: 11,
    name: "Tarta de Frutas Frescas",
    description: "Tarta de crema pastelera cubierta con frutas frescas de temporada y glaseado brillante.",
    price: 320,
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500",
    category: "Pastelería",
    flavors: ["Vainilla", "Frutas"]
  },
  {
    id: 12,
    name: "Pastel Red Velvet",
    description: "Clásico pastel de terciopelo rojo con frosting de queso crema. Suave, húmedo e irresistible.",
    price: 380,
    image: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=500",
    category: "Pastelería",
    flavors: ["Chocolate", "Vainilla"]
  }
];

type SortOption = "popular" | "price-asc" | "price-desc" | "name-asc" | "name-desc";

interface ProductsPageProps {
  onNavigate: (page: string, productId?: number) => void;
}

export function ProductsPage({ onNavigate }: ProductsPageProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  
  const maxPrice = Math.max(...allProducts.map(p => p.price));
  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleFlavorChange = (flavor: string) => {
    setSelectedFlavors(prev =>
      prev.includes(flavor)
        ? prev.filter(f => f !== flavor)
        : [...prev, flavor]
    );
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedFlavors([]);
    setPriceRange([0, maxPrice]);
  };

  // Filtrar y ordenar productos
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = allProducts.filter(product => {
      // Filtro de categoría
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
        return false;
      }

      // Filtro de sabores
      if (selectedFlavors.length > 0) {
        const hasMatchingFlavor = product.flavors.some(flavor => 
          selectedFlavors.includes(flavor)
        );
        if (!hasMatchingFlavor) return false;
      }

      // Filtro de precio
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }

      return true;
    });

    // Ordenar
    switch (sortBy) {
      case "price-asc":
        return [...filtered].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...filtered].sort((a, b) => b.price - a.price);
      case "name-asc":
        return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return [...filtered].sort((a, b) => b.name.localeCompare(a.name));
      case "popular":
      default:
        return filtered;
    }
  }, [selectedCategories, selectedFlavors, priceRange, sortBy]);

  const sortOptions = [
    { value: "popular", label: "Más Populares" },
    { value: "price-asc", label: "Precio: Menor a Mayor" },
    { value: "price-desc", label: "Precio: Mayor a Menor" },
    { value: "name-asc", label: "Nombre: A - Z" },
    { value: "name-desc", label: "Nombre: Z - A" }
  ];

  const currentSortLabel = sortOptions.find(opt => opt.value === sortBy)?.label || "Más Populares";

  return (
    <>
      {/* Products Section with Filters */}
      <section className="py-16 bg-background relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-primary mb-4">
              Todos los Productos
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explora nuestra colección completa de pasteles y postres artesanales
            </p>
          </div>

          {/* Filter and Sort Controls */}
          <div className="flex items-center justify-between mb-8 gap-4">
            {/* Mobile Filter Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden gap-2">
                  <Filter className="h-4 w-4" />
                  Filtrar
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto">
                <div className="py-6">
                  <ProductFilters
                    selectedCategories={selectedCategories}
                    selectedFlavors={selectedFlavors}
                    priceRange={priceRange}
                    onCategoryChange={handleCategoryChange}
                    onFlavorChange={handleFlavorChange}
                    onPriceRangeChange={setPriceRange}
                    onClearFilters={handleClearFilters}
                    maxPrice={maxPrice}
                  />
                </div>
              </SheetContent>
            </Sheet>

            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <ArrowUpDown className="h-4 w-4" />
                  Ordenar por: {currentSortLabel}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {sortOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setSortBy(option.value as SortOption)}
                    className={sortBy === option.value ? "bg-accent" : ""}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Desktop Layout: Filters + Products */}
          <div className="flex gap-8">
            {/* Desktop Filters Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24">
                <ProductFilters
                  selectedCategories={selectedCategories}
                  selectedFlavors={selectedFlavors}
                  priceRange={priceRange}
                  onCategoryChange={handleCategoryChange}
                  onFlavorChange={handleFlavorChange}
                  onPriceRangeChange={setPriceRange}
                  onClearFilters={handleClearFilters}
                  maxPrice={maxPrice}
                />
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {filteredAndSortedProducts.length > 0 ? (
                <>
                  <div className="mb-4 text-sm text-muted-foreground">
                    Mostrando {filteredAndSortedProducts.length} {filteredAndSortedProducts.length === 1 ? 'producto' : 'productos'}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredAndSortedProducts.map((product) => (
                      <ProductCard key={product.id} {...product} onNavigate={onNavigate} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-16">
                  <p className="text-lg text-muted-foreground mb-4">
                    No se encontraron productos con los filtros seleccionados
                  </p>
                  <Button onClick={handleClearFilters} variant="outline">
                    Limpiar Filtros
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-pink-50 via-rose-50 to-fuchsia-50 relative">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
            ¿No encuentras lo que buscas?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Creamos pasteles personalizados para cualquier ocasión. 
            Cuéntanos tu idea y la haremos realidad.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Pedir Pastel Personalizado
            </Button>
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
              Contactar
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
