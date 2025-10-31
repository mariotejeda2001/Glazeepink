import { useState } from "react";
import { useCart } from "../contexts/CartContext";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Checkbox } from "../components/ui/checkbox";
import { Minus, Plus, Trash2 } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { ProductCard } from "../components/ProductCard";

interface CartPageProps {
  onNavigate: (page: string, productId?: number) => void;
}

// Productos sugeridos
const suggestedProducts = [
  {
    id: 10,
    name: "Crème Brûlée",
    description: "Clásico postre francés con crema de vainilla y costra de azúcar caramelizada crujiente.",
    price: 205,
    image: "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=500",
    category: "Postres"
  },
  {
    id: 7,
    name: "Mousse de Chocolate",
    description: "Suave mousse de chocolate belga con crema batida y virutas de chocolate. Un clásico irresistible.",
    price: 195,
    image: "https://images.unsplash.com/photo-1702566039177-5b39c2126486?w=500",
    category: "Postres"
  },
  {
    id: 8,
    name: "Panna Cotta de Vainilla",
    description: "Delicada panna cotta italiana con salsa de frutos rojos y flores comestibles.",
    price: 175,
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500",
    category: "Postres"
  }
];

export function CartPage({ onNavigate }: CartPageProps) {
  const { items, updateQuantity, removeFromCart, toggleSelectItem, subtotal } = useCart();
  const [isGift, setIsGift] = useState(false);

  const selectedCount = items.filter(item => item.selected).length;

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="mb-4">Tu carrito está vacío</h1>
          <p className="text-muted-foreground mb-6">
            ¡Agrega algunos de nuestros deliciosos pasteles y postres para comenzar!
          </p>
          <Button onClick={() => onNavigate('products')} size="lg">
            Ver Productos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1 className="mb-6 sm:mb-8">Carrito</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Lista de productos */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-4 sm:p-6">
                <div className="flex gap-4">
                  {/* Checkbox */}
                  <div className="flex-shrink-0 pt-1">
                    <Checkbox
                      checked={item.selected}
                      onCheckedChange={() => toggleSelectItem(item.id)}
                    />
                  </div>

                  {/* Imagen */}
                  <div className="flex-shrink-0 w-20 h-20 sm:w-32 sm:h-32 rounded-lg overflow-hidden bg-muted">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Información del producto */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="mb-1 line-clamp-1">{item.name}</h3>
                        <p className="text-sm text-green-600 mb-2 sm:mb-3">Disponible</p>

                        {/* Controles de cantidad */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {
                              if (item.quantity === 1) {
                                removeFromCart(item.id);
                              } else {
                                updateQuantity(item.id, item.quantity - 1);
                              }
                            }}
                          >
                            {item.quantity === 1 ? (
                              <Trash2 className="h-4 w-4" />
                            ) : (
                              <Minus className="h-4 w-4" />
                            )}
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Precio */}
                      <div className="flex-shrink-0">
                        <p className="text-right sm:text-left">
                          <span className="text-sm text-muted-foreground sm:hidden">Precio: </span>
                          <span className="font-semibold">${item.price} MXN</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Subtotal móvil */}
          <div className="lg:hidden">
            <p className="text-center text-muted-foreground">
              Subtotal ({selectedCount} {selectedCount === 1 ? 'producto' : 'productos'}): 
              <span className="font-semibold text-foreground ml-2">${subtotal} MXN</span>
            </p>
          </div>
        </div>

        {/* Resumen del pedido - Desktop */}
        <div className="hidden lg:block">
          <Card className="sticky top-24">
            <CardContent className="p-6 space-y-6">
              <div>
                <p className="text-muted-foreground mb-2">
                  Subtotal ({selectedCount} {selectedCount === 1 ? 'producto' : 'productos'}):
                </p>
                <p className="text-2xl font-semibold">${subtotal} MXN</p>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="gift"
                  checked={isGift}
                  onCheckedChange={(checked) => setIsGift(checked as boolean)}
                />
                <label
                  htmlFor="gift"
                  className="text-sm cursor-pointer select-none"
                >
                  Este pedido es un regalo
                </label>
              </div>

              <Button
                className="w-full"
                size="lg"
                disabled={selectedCount === 0}
                onClick={() => onNavigate('checkout')}
              >
                PROCEDER AL PAGO
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Botón proceder al pago - Móvil (sticky) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t p-4 shadow-lg z-40">
        <div className="flex items-center gap-3 mb-3">
          <Checkbox
            id="gift-mobile"
            checked={isGift}
            onCheckedChange={(checked) => setIsGift(checked as boolean)}
          />
          <label
            htmlFor="gift-mobile"
            className="text-sm cursor-pointer select-none"
          >
            Este pedido es un regalo
          </label>
        </div>
        <Button
          className="w-full"
          size="lg"
          disabled={selectedCount === 0}
          onClick={() => onNavigate('checkout')}
        >
          PROCEDER AL PAGO - ${subtotal} MXN
        </Button>
      </div>

      {/* Sección de productos sugeridos */}
      <div className="mt-12 sm:mt-16 mb-20 lg:mb-0">
        <div className="text-center mb-8">
          <h2 className="mb-2">Agrega un antojo más</h2>
          <p className="text-muted-foreground">
            Dale un toque extra de dulzura a tu pedido
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {suggestedProducts.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
