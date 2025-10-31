import { useState } from "react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card } from "../components/ui/card";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { ProductCard } from "../components/ProductCard";
import { Star, ShoppingCart, Heart, ChefHat, Users, Minus, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { useCart } from "../contexts/CartContext";

interface ProductDetailPageProps {
  productId: number;
  onNavigate: (page: string, productId?: number) => void;
}

interface Review {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

// Datos completos de productos con información detallada
const allProductsData = [
  {
    id: 1,
    name: "Pastel de Cumpleaños",
    description: "Esponjoso pastel decorado con crema de mantequilla, cubierto con coloridos detalles y velas. Perfecto para hacer de tu celebración un momento inolvidable.",
    price: 350,
    images: [
      "https://images.unsplash.com/photo-1635349135195-ea08a39fcc5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ0aGRheSUyMGNha2UlMjBjZWxlYnJhdGlvbnxlbnwxfHx8fDE3NjE1NDYzNjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=500",
      "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=500",
      "https://images.unsplash.com/photo-1607478900766-efe13248b125?w=500"
    ],
    category: "Pastelería",
    rating: 4.8,
    reviews: 45,
    servings: 8,
    ingredients: "Harina de trigo, huevos, mantequilla, azúcar, crema de mantequilla, colorante natural y decoraciones comestibles.",
    longDescription: "Nuestro Pastel de Cumpleaños es la elección perfecta para hacer de tu celebración un momento inolvidable. Elaborado con ingredientes de primera calidad, este pastel esponjoso está decorado con crema de mantequilla suave y cubierto con coloridos detalles que alegrarán cualquier fiesta. Personalizable en colores y mensaje, cada pastel es una obra de arte comestible que deleitará tanto a niños como adultos."
  },
  {
    id: 2,
    name: "Cheesecake de Fresas",
    description: "Cremoso cheesecake con base de galleta y topping de fresas naturales y coulis de fresa.",
    price: 280,
    images: [
      "https://images.unsplash.com/photo-1553882299-9601a48ebe6a?w=500",
      "https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=500",
      "https://images.unsplash.com/photo-1533134242820-b4f6b8595f6c?w=500",
      "https://images.unsplash.com/photo-1567327153941-e60e4e15e75a?w=500"
    ],
    category: "Postres",
    rating: 4.9,
    reviews: 67,
    servings: 6,
    ingredients: "Queso crema suave, base crujiente de galleta, crema batida y el toque fresco y frutal de fresas naturales.",
    longDescription: "Disfruta de nuestro exquisito Cheesecake de Fresas, una combinación perfecta de cremosidad y frescura. La base crujiente de galleta complementa maravillosamente el suave relleno de queso crema, mientras que las fresas naturales y el coulis de fresa añaden un toque frutal que eleva este postre a otro nivel. Ideal para compartir en cualquier ocasión especial o simplemente para darte un capricho."
  },
  {
    id: 3,
    name: "Cupcakes de Vainilla",
    description: "Set de 6 cupcakes de vainilla con buttercream de diferentes sabores y decoraciones artesanales.",
    price: 180,
    images: [
      "https://images.unsplash.com/photo-1658422928126-6120ea188353?w=500",
      "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=500",
      "https://images.unsplash.com/photo-1587241321921-91a834d82341?w=500",
      "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=500"
    ],
    category: "Pastelería",
    rating: 4.7,
    reviews: 52,
    servings: 6,
    ingredients: "Harina de trigo, vainilla natural, huevos frescos, mantequilla premium, buttercream artesanal y decoraciones comestibles.",
    longDescription: "Nuestro set de Cupcakes de Vainilla es perfecto para compartir o regalar. Cada cupcake está elaborado con vainilla natural y decorado con buttercream de diferentes sabores. Las decoraciones artesanales hacen de cada pieza una pequeña obra de arte deliciosa."
  },
  {
    id: 4,
    name: "Tiramisú Tradicional",
    description: "Auténtico tiramisú italiano con mascarpone, café expresso y cacao en polvo. Una delicia clásica.",
    price: 220,
    images: [
      "https://images.unsplash.com/photo-1710106519622-8c49d0bcff2f?w=500",
      "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500",
      "https://images.unsplash.com/photo-1534433269210-c2a87a1d3a70?w=500",
      "https://images.unsplash.com/photo-1528826007177-7d8e96e71d05?w=500"
    ],
    category: "Postres",
    rating: 4.9,
    reviews: 78,
    servings: 4,
    ingredients: "Queso mascarpone importado, café expresso italiano, bizcochos savoiardi, cacao en polvo premium y licor marsala.",
    longDescription: "Nuestro Tiramisú Tradicional es una experiencia italiana auténtica. Preparado con mascarpone importado y café expresso de alta calidad, cada capa ofrece la combinación perfecta de texturas y sabores. El cacao en polvo premium y el toque de marsala completan este clásico postre italiano que te transportará directamente a Roma."
  },
  {
    id: 5,
    name: "Pastel de Cumpleaños",
    description: "Esponjoso pastel decorado con crema de mantequilla, cubierto con coloridos detalles y velas. Perfecto para hacer de tu celebración un momento inolvidable.",
    price: 350,
    images: [
      "https://images.unsplash.com/photo-1635349135195-ea08a39fcc5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ0aGRheSUyMGNha2UlMjBjZWxlYnJhdGlvbnxlbnwxfHx8fDE3NjE1NDYzNjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=500",
      "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=500",
      "https://images.unsplash.com/photo-1607478900766-efe13248b125?w=500"
    ],
    category: "Pastelería",
    rating: 4.8,
    reviews: 45,
    servings: 8,
    ingredients: "Harina de trigo, huevos, mantequilla, azúcar, crema de mantequilla, colorante natural y decoraciones comestibles.",
    longDescription: "Nuestro Pastel de Cumpleaños es la elección perfecta para hacer de tu celebración un momento inolvidable. Elaborado con ingredientes de primera calidad, este pastel esponjoso está decorado con crema de mantequilla suave y cubierto con coloridos detalles que alegrarán cualquier fiesta."
  },
  {
    id: 10,
    name: "Crème Brûlée",
    description: "Clásico postre francés con crema de vainilla y costra de azúcar caramelizada crujiente.",
    price: 205,
    images: [
      "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=500",
      "https://images.unsplash.com/photo-1551404973-761c83935c77?w=500",
      "https://images.unsplash.com/photo-1587241321921-91a834d82341?w=500",
      "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500"
    ],
    category: "Postres",
    rating: 4.8,
    reviews: 62,
    servings: 1,
    ingredients: "Crema de vainilla francesa, yemas de huevo, azúcar caramelizado y vainilla de Madagascar.",
    longDescription: "Nuestro Crème Brûlée es la definición de elegancia en postres. La suave crema de vainilla contrasta perfectamente con la costra crujiente de azúcar caramelizado. Cada porción es preparada individualmente para garantizar la textura y sabor perfectos."
  },
  {
    id: 11,
    name: "Tarta de Frutas Frescas",
    description: "Tarta de crema pastelera cubierta con frutas frescas de temporada y glaseado brillante.",
    price: 320,
    images: [
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500",
      "https://images.unsplash.com/photo-1519915212116-7cfef71f1d3e?w=500",
      "https://images.unsplash.com/photo-1464347744102-11db6282f854?w=500",
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500"
    ],
    category: "Pastelería",
    rating: 4.7,
    reviews: 41,
    servings: 8,
    ingredients: "Crema pastelera artesanal, base de masa quebrada, frutas frescas de temporada y glaseado brillante.",
    longDescription: "Nuestra Tarta de Frutas Frescas es un festín visual y gastronómico. La crema pastelera artesanal sobre una base de masa quebrada perfectamente horneada se corona con una selección de frutas frescas de temporada. El glaseado brillante no solo añade un toque elegante sino que también realza los sabores naturales de las frutas."
  },
  {
    id: 12,
    name: "Pastel Red Velvet",
    description: "Clásico pastel de terciopelo rojo con frosting de queso crema. Suave, húmedo e irresistible.",
    price: 380,
    images: [
      "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=500",
      "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=500",
      "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=500",
      "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=500"
    ],
    category: "Pastelería",
    rating: 4.9,
    reviews: 89,
    servings: 10,
    ingredients: "Harina especial, cacao en polvo, colorante natural, buttermilk, frosting de queso crema y vainilla.",
    longDescription: "Nuestro Pastel Red Velvet es un clásico americano que ha conquistado corazones en todo el mundo. Su característico color rojo intenso y su textura aterciopelada lo hacen único. El frosting de queso crema añade el contraste perfecto de sabores, creando una experiencia inolvidable en cada bocado."
  }
];

export function ProductDetailPage({ productId, onNavigate }: ProductDetailPageProps) {
  const product = allProductsData.find(p => p.id === productId);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const { addToCart } = useCart();

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

  const handleQuantityChange = (delta: number) => {
    setQuantity(Math.max(1, quantity + delta));
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.images[0],
        category: product.category
      });
    }
    
    toast.success(`${quantity} ${product.name} agregado${quantity > 1 ? 's' : ''} al carrito`);
  };

  const handleBuyNow = () => {
    toast.success("Redirigiendo a la página de pago...");
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
      stars.push(
        <Star key={`full-${i}`} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
      );
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

    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="h-5 w-5 text-gray-300" />
      );
    }

    return stars;
  };

  return (
    <section className="py-6 sm:py-8 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-4 sm:mb-6 text-xs sm:text-sm text-muted-foreground overflow-x-auto whitespace-nowrap">
          <button onClick={() => onNavigate('home')} className="hover:text-primary">
            Inicio
          </button>
          <span className="mx-1 sm:mx-2">/</span>
          <button onClick={() => onNavigate('products')} className="hover:text-primary">
            Productos
          </button>
          <span className="mx-1 sm:mx-2">/</span>
          <span className="text-foreground truncate inline-block max-w-[150px] sm:max-w-none align-bottom">{product.name}</span>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Left Column - Images */}
          <div>
            {/* Main Image */}
            <div className="mb-3 sm:mb-4 relative overflow-hidden rounded-xl sm:rounded-2xl bg-gray-100 aspect-square">
              <ImageWithFallback
                src={product.images[selectedImageIndex]}
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
          </div>

          {/* Right Column - Product Info */}
          <div>
            {/* Category Badge */}
            <Badge variant="secondary" className="mb-3 bg-primary/10 text-primary border-primary/20">
              {product.category}
            </Badge>

            {/* Product Name */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="flex items-center gap-1">
                {renderStars(product.rating)}
              </div>
              <span className="font-semibold text-foreground text-sm sm:text-base">{product.rating}</span>
              <span className="text-muted-foreground text-sm sm:text-base">({product.reviews} reseñas)</span>
            </div>

            {/* Price */}
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
                {product.longDescription}
              </p>
            </div>

            {/* Ingredients */}
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

            {/* Servings */}
            <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 sm:gap-3">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                <div className="text-sm sm:text-base">
                  <span className="font-semibold">Porciones:</span>
                  <span className="ml-2 text-muted-foreground">{product.servings}</span>
                </div>
              </div>
            </div>
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

// Componente de productos recomendados
function RecommendedProducts({ 
  currentProductId, 
  currentCategory,
  onNavigate 
}: { 
  currentProductId: number; 
  currentCategory: string;
  onNavigate: (page: string, productId?: number) => void;
}) {
  // Obtener productos recomendados (de la misma categoría, excluyendo el actual)
  const recommendedProducts = allProductsData
    .filter(p => p.category === currentCategory && p.id !== currentProductId)
    .slice(0, 4);

  // Si no hay suficientes de la misma categoría, complementar con otros productos
  if (recommendedProducts.length < 4) {
    const remaining = allProductsData
      .filter(p => p.id !== currentProductId && !recommendedProducts.includes(p))
      .slice(0, 4 - recommendedProducts.length);
    recommendedProducts.push(...remaining);
  }

  return (
    <div className="pt-16 sm:pt-20 lg:pt-24 pb-12 sm:pb-16 bg-gradient-to-br from-pink-50 via-rose-50 to-fuchsia-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-6 sm:mb-8 text-center">
          Recomendados para ti
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {recommendedProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              id={product.id}
              name={product.name}
              description={product.description}
              price={product.price}
              image={product.images[0]}
              category={product.category}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Componente de opiniones de clientes
function CustomerReviews({ rating, totalReviews }: { rating: number; totalReviews: number }) {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si es móvil
  useState(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  });

  // Datos mock de reseñas
  const reviews: Review[] = [
    {
      id: 1,
      userName: "María González",
      rating: 5,
      comment: "¡Excelente sabor y calidad! El pastel llegó fresco y la presentación fue hermosa. Definitivamente volveré a comprar.",
      date: "15 Oct 2024"
    },
    {
      id: 2,
      userName: "Carlos Ramírez",
      rating: 5,
      comment: "Superó mis expectativas. La textura es perfecta y el sabor increíble. El mejor pastel que he probado en mucho tiempo.",
      date: "12 Oct 2024"
    },
    {
      id: 3,
      userName: "Ana Patricia López",
      rating: 4,
      comment: "Muy rico y esponjoso. La decoración es preciosa. Solo le daría 4 estrellas porque me gustaría que fuera un poco más grande.",
      date: "8 Oct 2024"
    },
    {
      id: 4,
      userName: "Roberto Sánchez",
      rating: 5,
      comment: "Pedí este pastel para el cumpleaños de mi hijo y fue todo un éxito. Los niños lo adoraron y los adultos también.",
      date: "5 Oct 2024"
    },
    {
      id: 5,
      userName: "Laura Martínez",
      rating: 5,
      comment: "Delicioso y hermoso. La atención al cliente fue excelente y la entrega muy puntual. ¡Altamente recomendado!",
      date: "1 Oct 2024"
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
      stars.push(
        <Star key={`full-${i}`} className="h-5 w-5 sm:h-6 sm:w-6 fill-yellow-400 text-yellow-400" />
      );
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

    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="h-5 w-5 sm:h-6 sm:w-6 text-gray-300" />
      );
    }

    return stars;
  };

  // Responsive: 1 en móvil, 3 en desktop
  const visibleReviews = isMobile ? 1 : 3;
  const maxIndex = Math.max(0, reviews.length - visibleReviews);

  const handlePrev = () => {
    setCurrentReviewIndex(Math.max(0, currentReviewIndex - 1));
  };

  const handleNext = () => {
    setCurrentReviewIndex(Math.min(maxIndex, currentReviewIndex + 1));
  };

  return (
    <div className="py-12 sm:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-6 sm:mb-8">
          Opiniones de los clientes
        </h2>

        {/* Overall Rating */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-1">
            {renderOverallStars(rating)}
          </div>
          <span className="text-xl sm:text-2xl font-bold text-foreground">{rating} de 5</span>
          <span className="text-sm sm:text-base text-muted-foreground">{totalReviews} calificaciones</span>
        </div>

        {/* Reviews Carousel */}
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

          {/* Navigation Buttons */}
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
