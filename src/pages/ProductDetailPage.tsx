import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card } from "../components/ui/card";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { ProductCard } from "../components/ProductCard";
import { Star, ShoppingCart, Heart, ChefHat, Users, Minus, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner"; // Asegúrate de que sea "sonner" o "sonner@2.0.3" según tu package.json
import { useCart } from "../contexts/CartContext";

// --- INTERFACES ---
interface ProductDetailPageProps {
  productId: number;
  onNavigate: (page: string, productId?: number) => void;
}

interface Product {
  id: number;
  name: string;
  description: string;
  longDescription?: string;
  price: number;
  images: string[];
  category: string;
  flavors?: string[];
  rating: number;
  reviews: number;
  servings?: number;
  ingredients?: string;
}

interface Review {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

// --- COMPONENTE PRINCIPAL ---
export function ProductDetailPage({ productId, onNavigate }: ProductDetailPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const { addToCart } = useCart();

  // Fetch del producto individual
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4242';
        const response = await fetch(`${apiUrl}/api/products/${productId}`);
        
        if (!response.ok) throw new Error("Producto no encontrado");
        
        const data = await response.json();
        setProduct(data);
        // Resetear selección de imagen al cambiar de producto
        setSelectedImageIndex(0); 
      } catch (error) {
        console.error("Error cargando el producto:", error);
        toast.error("No se pudo cargar el producto");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleQuantityChange = (delta: number) => {
    setQuantity(Math.max(1, quantity + delta));
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    // Añadimos al carrito la cantidad seleccionada
    // Nota: addToCart del contexto podría necesitar un bucle o aceptar cantidad directa
    // Asumimos que tu contexto actual añade de 1 en 1, así que hacemos un bucle simple
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.images && product.images.length > 0 ? product.images[0] : '', // Fallback si no hay imagen
        category: product.category
      });
    }
    
    toast.success(`${quantity} ${product.name} agregado${quantity > 1 ? 's' : ''} al carrito`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    onNavigate('cart'); // O 'checkout' directamente
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Eliminado de favoritos" : "Agregado a favoritos");
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="h-5 w-5 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="h-5 w-5 text-gray-300" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-5 w-5 text-gray-300" />);
    }

    return stars;
  };

  // --- ESTADO DE CARGA ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-medium text-foreground">Cargando delicia...</h2>
        </div>
      </div>
    );
  }

  // --- ESTADO DE ERROR / NO ENCONTRADO ---
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">Producto no encontrado</h2>
          <Button onClick={() => onNavigate('products')}>
            Volver a Productos
          </Button>
        </div>
      </div>
    );
  }

  // --- RENDER PRINCIPAL ---
  return (
    <section className="py-6 sm:py-8 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-4 sm:mb-6 text-xs sm:text-sm text-muted-foreground overflow-x-auto whitespace-nowrap">
          <button onClick={() => onNavigate('home')} className="hover:text-primary">Inicio</button>
          <span className="mx-1 sm:mx-2">/</span>
          <button onClick={() => onNavigate('products')} className="hover:text-primary">Productos</button>
          <span className="mx-1 sm:mx-2">/</span>
          <span className="text-foreground truncate inline-block max-w-[150px] sm:max-w-none align-bottom">
            {product.name}
          </span>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Left Column - Images */}
          <div>
            <div className="mb-3 sm:mb-4 relative overflow-hidden rounded-xl sm:rounded-2xl bg-gray-100 aspect-square">
              <ImageWithFallback
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleToggleFavorite}
                className={`absolute top-2 right-2 sm:top-4 sm:right-4 h-8 w-8 sm:h-10 sm:w-10 bg-white/90 hover:bg-white ${
                  isFavorite ? "text-red-500" : ""
                }`}
              >
                <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${isFavorite ? "fill-current" : ""}`} />
              </Button>
            </div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative overflow-hidden rounded-md sm:rounded-lg bg-gray-100 aspect-square border-2 transition-all ${
                      selectedImageIndex === index
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <ImageWithFallback
                      src={image}
                      alt={`${product.name} - Vista ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Product Info */}
          <div>
            <Badge variant="secondary" className="mb-3 bg-primary/10 text-primary border-primary/20">
              {product.category}
            </Badge>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4">
              {product.name}
            </h1>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="flex items-center gap-1">
                {renderStars(product.rating)}
              </div>
              <span className="font-semibold text-foreground text-sm sm:text-base">{product.rating}</span>
              <span className="text-muted-foreground text-sm sm:text-base">({product.reviews} reseñas)</span>
            </div>

            <div className="mb-4 sm:mb-6">
              <span className="text-3xl sm:text-4xl font-bold text-primary">
                ${product.price} MXN
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="mb-4 sm:mb-6">
              <label className="block text-xs sm:text-sm font-medium text-foreground mb-2">
                CANTIDAD
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="rounded-r-none h-9 w-9 sm:h-10 sm:w-10"
                  >
                    <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                  <span className="px-4 sm:px-6 py-2 font-semibold min-w-[50px] sm:min-w-[60px] text-center text-sm sm:text-base">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange(1)}
                    className="rounded-l-none h-9 w-9 sm:h-10 sm:w-10"
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6 sm:mb-8">
              <Button
                size="lg"
                onClick={handleAddToCart}
                className="flex-1 bg-gray-800 hover:bg-gray-900 text-white text-sm sm:text-base"
              >
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Agregar al carrito
              </Button>
              <Button
                size="lg"
                onClick={handleBuyNow}
                variant="outline"
                className="flex-1 border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white text-sm sm:text-base"
              >
                Comprar ahora
              </Button>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="font-bold text-base sm:text-lg mb-2 sm:mb-3">Descripción</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {product.longDescription || product.description}
              </p>
            </div>

            {/* Ingredients */}
            {product.ingredients && (
              <div className="mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start gap-2 sm:gap-3">
                  <ChefHat className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Hecho con:</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {product.ingredients}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Servings */}
            {product.servings && (
              <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                  <div className="text-sm sm:text-base">
                    <span className="font-semibold">Porciones:</span>
                    <span className="ml-2 text-muted-foreground">{product.servings}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recommended Products Section */}
      <RecommendedProducts 
        currentProductId={productId} 
        currentCategory={product.category}
        onNavigate={onNavigate}
      />

      {/* Customer Reviews Section */}
      <CustomerReviews 
        rating={product.rating}
        totalReviews={product.reviews}
      />
    </section>
  );
}

// --- SUBCOMPONENTES ---

function RecommendedProducts({ 
  currentProductId, 
  currentCategory,
  onNavigate 
}: { 
  currentProductId: number; 
  currentCategory: string;
  onNavigate: (page: string, productId?: number) => void;
}) {
  const [recommended, setRecommended] = useState<Product[]>([]);

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4242';
        // Buscamos productos de la misma categoría
        const response = await fetch(`${apiUrl}/api/products?category=${currentCategory}`);
        if (response.ok) {
          const data = await response.json();
          // Filtramos para no mostrar el producto actual y limitamos a 4
          const filtered = data
            .filter((p: Product) => p.id !== currentProductId)
            .slice(0, 4);
          setRecommended(filtered);
        }
      } catch (error) {
        console.error("Error fetching recommended:", error);
      }
    };

    if (currentCategory) {
      fetchRecommended();
    }
  }, [currentCategory, currentProductId]);

  if (recommended.length === 0) return null;

  return (
    <div className="pt-16 sm:pt-20 lg:pt-24 pb-12 sm:pb-16 bg-gradient-to-br from-pink-50 via-rose-50 to-fuchsia-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-6 sm:mb-8 text-center">
          Recomendados para ti
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {recommended.map((product) => (
            <ProductCard 
              key={product.id} 
              id={product.id}
              name={product.name}
              description={product.description}
              price={product.price}
              // Adaptamos la imagen (array a string)
              image={product.images && product.images.length > 0 ? product.images[0] : ''}
              category={product.category}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function CustomerReviews({ rating, totalReviews }: { rating: number; totalReviews: number }) {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Datos mock de reseñas (esto sigue hardcodeado porque no tenemos tabla de reviews aun)
  const reviews: Review[] = [
    {
      id: 1,
      userName: "María González",
      rating: 5,
      comment: "¡Excelente sabor y calidad! El pastel llegó fresco y la presentación fue hermosa.",
      date: "15 Oct 2024"
    },
    {
      id: 2,
      userName: "Carlos Ramírez",
      rating: 5,
      comment: "Superó mis expectativas. La textura es perfecta y el sabor increíble.",
      date: "12 Oct 2024"
    },
    {
      id: 3,
      userName: "Ana Patricia López",
      rating: 4,
      comment: "Muy rico y esponjoso. La decoración es preciosa.",
      date: "8 Oct 2024"
    }
  ];

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      );
    }
    return stars;
  };

  const renderOverallStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="h-5 w-5 sm:h-6 sm:w-6 fill-yellow-400 text-yellow-400" />);
    }
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="h-5 w-5 sm:h-6 sm:w-6 text-gray-300" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="h-5 w-5 sm:h-6 sm:w-6 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      );
    }
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-5 w-5 sm:h-6 sm:w-6 text-gray-300" />);
    }
    return stars;
  };

  const visibleReviews = isMobile ? 1 : 3;
  const maxIndex = Math.max(0, reviews.length - visibleReviews);

  const handlePrev = () => setCurrentReviewIndex(Math.max(0, currentReviewIndex - 1));
  const handleNext = () => setCurrentReviewIndex(Math.min(maxIndex, currentReviewIndex + 1));

  return (
    <div className="py-12 sm:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-6 sm:mb-8">
          Opiniones de los clientes
        </h2>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-1">
            {renderOverallStars(rating)}
          </div>
          <span className="text-xl sm:text-2xl font-bold text-foreground">{rating} de 5</span>
          <span className="text-sm sm:text-base text-muted-foreground">{totalReviews} calificaciones</span>
        </div>

        <div className="relative px-2 sm:px-0">
          <div className="overflow-hidden">
            <div
              className="flex gap-4 sm:gap-6 transition-transform duration-300 ease-in-out"
              style={{
                transform: `translateX(-${currentReviewIndex * (100 / visibleReviews)}%)`
              }}
            >
              {reviews.map((review) => (
                <Card
                  key={review.id}
                  className="flex-shrink-0 p-4 sm:p-6 bg-white border border-gray-200"
                  style={{ 
                    width: isMobile 
                      ? 'calc(100% - 2rem)' 
                      : `calc((100% - ${(visibleReviews - 1) * 1.5}rem) / ${visibleReviews})` 
                  }}
                >
                  <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <Avatar className="h-10 w-10 sm:h-12 sm:w-12 bg-primary/10 flex-shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm sm:text-base">
                        {review.userName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground mb-1 text-sm sm:text-base truncate">{review.userName}</h4>
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-0.5">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-xs sm:text-sm text-muted-foreground">{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    "{review.comment}"
                  </p>
                </Card>
              ))}
            </div>
          </div>

          {reviews.length > visibleReviews && (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrev}
                disabled={currentReviewIndex === 0}
                className="absolute left-0 sm:-left-4 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white shadow-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed z-10"
              >
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNext}
                disabled={currentReviewIndex >= maxIndex}
                className="absolute right-0 sm:-right-4 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white shadow-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed z-10"
              >
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}