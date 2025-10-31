import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Button } from "./ui/button";
import { X } from "lucide-react";

interface ProductFiltersProps {
  selectedCategories: string[];
  selectedFlavors: string[];
  priceRange: [number, number];
  onCategoryChange: (category: string) => void;
  onFlavorChange: (flavor: string) => void;
  onPriceRangeChange: (range: [number, number]) => void;
  onClearFilters: () => void;
  maxPrice: number;
}

export function ProductFilters({
  selectedCategories,
  selectedFlavors,
  priceRange,
  onCategoryChange,
  onFlavorChange,
  onPriceRangeChange,
  onClearFilters,
  maxPrice
}: ProductFiltersProps) {
  const categories = ["Postres", "Pastelería"];
  const flavors = ["Chocolate", "Vainilla", "Fresa", "Café", "Frutas", "Caramelo"];
  const showCategories = selectedCategories.length > 0 || onCategoryChange.toString().includes('setSelectedCategories');

  const hasActiveFilters = 
    selectedCategories.length > 0 || 
    selectedFlavors.length > 0 || 
    priceRange[0] > 0 || 
    priceRange[1] < maxPrice;

  return (
    <div className="w-full space-y-6 bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg">Filtros</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-8 px-2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Limpiar
          </Button>
        )}
      </div>

      {/* Categorías - solo mostrar si estamos en la página de todos los productos */}
      {showCategories && (
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Categorías</h4>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category}`}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={() => onCategoryChange(category)}
                />
                <Label
                  htmlFor={`category-${category}`}
                  className="text-sm cursor-pointer"
                >
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sabores */}
      <div className="space-y-3">
        <h4 className="font-semibold text-sm">Sabores</h4>
        <div className="space-y-2">
          {flavors.map((flavor) => (
            <div key={flavor} className="flex items-center space-x-2">
              <Checkbox
                id={`flavor-${flavor}`}
                checked={selectedFlavors.includes(flavor)}
                onCheckedChange={() => onFlavorChange(flavor)}
              />
              <Label
                htmlFor={`flavor-${flavor}`}
                className="text-sm cursor-pointer"
              >
                {flavor}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Rango de Precio */}
      <div className="space-y-4">
        <h4 className="font-semibold text-sm">Rango de Precio</h4>
        <div className="px-2">
          <Slider
            min={0}
            max={maxPrice}
            step={50}
            value={priceRange}
            onValueChange={(value) => onPriceRangeChange(value as [number, number])}
            className="w-full"
          />
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>
    </div>
  );
}
