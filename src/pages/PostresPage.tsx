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

const postresProducts: Product[] = [
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
  }
];

type SortOption = "popular" | "price-asc" | "price-desc" | "name-asc" | "name-desc";

interface PostresPageProps {
  onNavigate: (page: string, productId?: number) => void;
}

export function PostresPage({ onNavigate }: PostresPageProps) {
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  
  const maxPrice = Math.max(...postresProducts.map(p => p.price));
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
    let filtered = postresProducts.filter(product => {
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
            🍮 Categoría
          </Badge>
          <h1 className="text-5xl lg:text-6xl font-bold text-primary mb-4">
            Postres
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Deléitate con nuestros exquisitos postres artesanales, desde clásicos italianos hasta creaciones modernas
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
                    Mostrando {filteredAndSortedProducts.length} {filteredAndSortedProducts.length === 1 ? 'postre' : 'postres'}
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
                    No se encontraron postres con los filtros seleccionados
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
            ¿Tienes un evento especial?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Creamos postres personalizados para cualquier ocasión. 
            Cuéntanos tu idea y la haremos realidad.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Pedir Postre Personalizado
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
