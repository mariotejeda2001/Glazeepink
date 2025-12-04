// ... imports iguales a PostresPage ...
import { useState, useMemo, useEffect } from "react";
import { ProductCard } from "../components/ProductCard";
import { ProductFilters } from "../components/ProductFilters";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu";
import { Filter, ArrowUpDown } from "lucide-react";

// ... interfaces iguales ...
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  flavors: string[];
}
type SortOption = "popular" | "price-asc" | "price-desc" | "name-asc" | "name-desc";

interface PasteleriaPageProps {
  onNavigate: (page: string, productId?: number) => void;
}

export function PasteleriaPage({ onNavigate }: PasteleriaPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const maxPrice = products.length > 0 ? Math.max(...products.map(p => p.price)) : 1000;
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  // Fetch solo PASTELERÍA
  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4242';
    // Nota: Si tienes problemas con el acento en la URL, usa encodeURIComponent('Pastelería')
    fetch(`${apiUrl}/api/products?category=Pastelería`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        if(data.length > 0) {
            const max = Math.max(...data.map((p: Product) => p.price));
            setPriceRange([0, max]);
        }
        setLoading(false);
      })
      .catch(err => setLoading(false));
  }, []);

  const handleFlavorChange = (flavor: string) => {
    setSelectedFlavors(prev => prev.includes(flavor) ? prev.filter(f => f !== flavor) : [...prev, flavor]);
  };

  const handleClearFilters = () => {
    setSelectedFlavors([]);
    setPriceRange([0, maxPrice]);
  };

  const filteredAndSortedProducts = useMemo(() => {
    if (loading) return [];
    let filtered = products.filter(product => {
      if (selectedFlavors.length > 0) {
        const productFlavors = product.flavors || [];
        if (!productFlavors.some(flavor => selectedFlavors.includes(flavor))) return false;
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
  }, [products, selectedFlavors, priceRange, sortBy, loading]);

  const currentSortLabel = ({ "popular": "Más Populares", "price-asc": "Precio: Menor a Mayor", "price-desc": "Precio: Mayor a Menor", "name-asc": "Nombre: A - Z", "name-desc": "Nombre: Z - A" } as any)[sortBy];

  return (
    <>
      <section className="py-16 bg-gradient-to-br from-pink-50 via-rose-50 to-fuchsia-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-primary/20">🎂 Categoría</Badge>
          <h1 className="text-5xl lg:text-6xl font-bold text-primary mb-4">Pastelería</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Descubre nuestros pasteles perfectos para cualquier celebración.</p>
        </div>
      </section>

      <section className="py-16 bg-background relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-between mb-8 gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden gap-2"><Filter className="h-4 w-4" /> Filtrar</Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto">
                <div className="py-6">
                  <ProductFilters selectedCategories={[]} selectedFlavors={selectedFlavors} priceRange={priceRange} onCategoryChange={()=>{}} onFlavorChange={handleFlavorChange} onPriceRangeChange={setPriceRange} onClearFilters={handleClearFilters} maxPrice={maxPrice} />
                </div>
              </SheetContent>
            </Sheet>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2"><ArrowUpDown className="h-4 w-4" /> Ordenar por: {currentSortLabel}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {["popular", "price-asc", "price-desc", "name-asc", "name-desc"].map((opt) => (
                  <DropdownMenuItem key={opt} onClick={() => setSortBy(opt as SortOption)}>{opt}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex gap-8">
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24">
                <ProductFilters selectedCategories={[]} selectedFlavors={selectedFlavors} priceRange={priceRange} onCategoryChange={()=>{}} onFlavorChange={handleFlavorChange} onPriceRangeChange={setPriceRange} onClearFilters={handleClearFilters} maxPrice={maxPrice} />
              </div>
            </aside>
            <div className="flex-1">
              {loading ? <div className="text-center py-16">Cargando...</div> : (
                filteredAndSortedProducts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredAndSortedProducts.map((product) => (
                      <ProductCard key={product.id} {...product} image={product.images[0]} onNavigate={onNavigate} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16"><p>No se encontraron pasteles.</p><Button onClick={handleClearFilters} variant="outline">Limpiar</Button></div>
                )
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}