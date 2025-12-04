import { useState, useMemo, useEffect } from "react";
import { ProductCard } from "../components/ProductCard";
import { ProductFilters } from "../components/ProductFilters"; // Asegúrate que la ruta sea correcta
import { Button } from "../components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Filter, ArrowUpDown } from "lucide-react";

// Definimos la interfaz basada en tu base de datos
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  images: string[]; // Nota: ahora es un array de strings
  category: string;
  flavors: string[];
}

type SortOption = "popular" | "price-asc" | "price-desc" | "name-asc" | "name-desc";

interface ProductsPageProps {
  onNavigate: (page: string, productId?: number) => void;
}

export function ProductsPage({ onNavigate }: ProductsPageProps) {
  // 1. Estados para datos y carga
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  
  // Precio máximo dinámico (inicializamos en 0 hasta cargar datos)
  const maxPrice = products.length > 0 ? Math.max(...products.map(p => p.price)) : 1000;
  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice]);

  // 2. Fetch a la API al cargar el componente
  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4242';
    
    fetch(`${apiUrl}/api/products`)
      .then((res) => {
        if (!res.ok) throw new Error("Error en la respuesta de la red");
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        // Actualizar el rango de precios una vez tenemos datos
        const max = Math.max(...data.map((p: Product) => p.price));
        setPriceRange([0, max]);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error cargando productos:", error);
        setLoading(false);
      });
  }, []);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const handleFlavorChange = (flavor: string) => {
    setSelectedFlavors(prev =>
      prev.includes(flavor) ? prev.filter(f => f !== flavor) : [...prev, flavor]
    );
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedFlavors([]);
    setPriceRange([0, maxPrice]);
  };

  // 3. Filtrar y ordenar (usando el estado 'products' en lugar de la constante 'allProducts')
  const filteredAndSortedProducts = useMemo(() => {
    if (loading) return [];

    let filtered = products.filter(product => {
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) return false;
      
      if (selectedFlavors.length > 0) {
        // Aseguramos que flavors exista (puede venir null de la BD si no se cargó bien)
        const productFlavors = product.flavors || [];
        const hasMatchingFlavor = productFlavors.some(flavor => selectedFlavors.includes(flavor));
        if (!hasMatchingFlavor) return false;
      }

      if (product.price < priceRange[0] || product.price > priceRange[1]) return false;

      return true;
    });

    switch (sortBy) {
      case "price-asc": return [...filtered].sort((a, b) => a.price - b.price);
      case "price-desc": return [...filtered].sort((a, b) => b.price - a.price);
      case "name-asc": return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc": return [...filtered].sort((a, b) => b.name.localeCompare(a.name));
      case "popular": default: return filtered;
    }
  }, [products, selectedCategories, selectedFlavors, priceRange, sortBy, loading]);

  const sortOptions = [
    { value: "popular", label: "Más Populares" },
    { value: "price-asc", label: "Precio: Menor a Mayor" },
    { value: "price-desc", label: "Precio: Mayor a Menor" },
    { value: "name-asc", label: "Nombre: A - Z" },
    { value: "name-desc", label: "Nombre: Z - A" }
  ];

  const currentSortLabel = sortOptions.find(opt => opt.value === sortBy)?.label || "Más Populares";

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Horneando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-background relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-primary mb-4">Todos los Productos</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explora nuestra colección completa de pasteles y postres artesanales
          </p>
        </div>

        {/* Controles de Filtros y Ordenamiento */}
        <div className="flex items-center justify-between mb-8 gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden gap-2">
                <Filter className="h-4 w-4" /> Filtrar
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <ArrowUpDown className="h-4 w-4" /> Ordenar por: {currentSortLabel}
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

        <div className="flex gap-8">
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

          <div className="flex-1">
            {filteredAndSortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredAndSortedProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    {...product} 
                    // Adaptamos la propiedad image porque la BD devuelve un array
                    image={product.images && product.images.length > 0 ? product.images[0] : ''}
                    onNavigate={onNavigate} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-lg text-muted-foreground mb-4">
                  No se encontraron productos con los filtros seleccionados
                </p>
                <Button onClick={handleClearFilters} variant="outline">Limpiar Filtros</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}