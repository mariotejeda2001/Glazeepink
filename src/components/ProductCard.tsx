import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { ShoppingCart, Heart } from "lucide-react";
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useCart } from "../contexts/CartContext";
import { toast } from "sonner@2.0.3";

interface ProductCardProps {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  onNavigate?: (page: string, productId: number) => void;
}

export function ProductCard({ id, name, description, price, image, category, onNavigate }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleCardClick = () => {
    if (onNavigate) {
      onNavigate('product-detail', id);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({ id, name, description, price, image, category });
    toast.success(`${name} añadido al carrito`);
  };

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300 cursor-pointer" onClick={handleCardClick}>
      <CardContent className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <ImageWithFallback
            src={image}
            alt={name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 bg-white/80 hover:bg-white"
          >
            <Heart className="h-4 w-4" />
          </Button>
          <div className="absolute top-2 left-2">
            <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs">
              {category}
            </span>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="mb-2">{name}</h3>
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
            {description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-primary">
              ${price} MXN
            </span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 px-4 pb-4">
        <Button className="w-full" size="sm" onClick={handleAddToCart}>
          <ShoppingCart className="h-4 w-4 mr-2" />
          Añadir al Carrito
        </Button>
      </CardFooter>
    </Card>
  );
}