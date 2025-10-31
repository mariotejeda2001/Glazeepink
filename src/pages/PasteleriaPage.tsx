import { useState, useMemo } from "react";
import { ProductCard } from "../components/ProductCard";
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
import { Filter, ArrowUpDown } from "lucide-react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  flavors: string[];
}

const pasteleriaProducts: Product[] = [
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
    name: "Pastel de Cumpleaños",
    description: "Esponjoso pastel decorado con crema de mantequilla, cubierto con coloridos detalles y velas. Perfecto para hacer de tu celebración un momento inolvidable.",
    price: 350,
    image: "https://images.unsplash.com/photo-1635349135195-ea08a39fcc5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ0aGRheSUyMGNha2UlMjBjZWxlYnJhdGlvbnxlbnwxfHx8fDE3NjE1NDYzNjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
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

interface PasteleriaPageProps {
  onNavigate: (page: string, productId?: number) => void;
}

export function PasteleriaPage({ onNavigate }: PasteleriaPageProps) {
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  
  const maxPrice = Math.max(...pasteleriaProducts.map(p => p.price));
  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice]);

  const handleFlavorChange = (flavor: string) => {
    setSelectedFlavors(prev =>
      prev.includes(flavor)
        ? prev.filter(f => f !== flavor)
        : [...prev, flavor]
    );
  };

  const handleClearFilters = () => {
    setSelectedFlavors([]);
    setPriceRange([0, maxPrice]);
  };

  // Filtrar y ordenar productos
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = pasteleriaProducts.filter(product => {
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
  }, [selectedFlavors, priceRange, sortBy]);

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
      {/* Header Section */}
      <section className="py-16 bg-gradient-to-br from-pink-50 via-rose-50 to-fuchsia-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-primary/20">
            🎂 Categoría
          </Badge>
          <h1 className="text-5xl lg:text-6xl font-bold text-primary mb-4">
            Pastelería
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Descubre nuestros pasteles y tartas artesanales, perfectos para cualquier celebración especial
          </p>
        </div>
      </section>

      {/* Products Section with Filters */}
      <section className="py-16 bg-background relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
                    selectedCategories={[]}
                    selectedFlavors={selectedFlavors}
                    priceRange={priceRange}
                    onCategoryChange={() => {}}
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
                  selectedCategories={[]}
                  selectedFlavors={selectedFlavors}
                  priceRange={priceRange}
                  onCategoryChange={() => {}}
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
            ¿Buscas un pastel único?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Creamos pasteles personalizados para bodas, cumpleaños y cualquier ocasión especial. 
            Cuéntanos tu visión y la convertiremos en una obra de arte comestible.
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
