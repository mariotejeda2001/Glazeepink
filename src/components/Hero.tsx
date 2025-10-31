import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { ArrowRight, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const slides = [
  {
    id: 1,
    title: "Pasteles y Postres",
    subtitle: "Artesanales",
    description: "Descubre nuestra selección de pasteles, tartas y postres hechos con amor y los mejores ingredientes. Cada bocado es una experiencia única que endulzará tus momentos especiales.",
    image: "https://images.unsplash.com/photo-1652365283468-c507a8fc0dd8?w=1200",
    badge: "🎂 Pasteles Personalizados",
    badgeSubtext: "Desde $180 MXN"
  },
  {
    id: 2,
    title: "Tartas de Chocolate",
    subtitle: "Premium",
    description: "Nuestras tartas de chocolate son elaboradas con cacao premium de origen. Una explosión de sabor que conquistará tus sentidos en cada bocado.",
    image: "https://images.unsplash.com/photo-1745342542427-93d9acdabd20?w=1200",
    badge: "🍫 Chocolate Premium",
    badgeSubtext: "Edición Especial"
  },
  {
    id: 3,
    title: "Postres de Temporada",
    subtitle: "Especiales",
    description: "Disfruta de nuestras creaciones especiales de temporada. Sabores únicos que solo encuentras en esta época del año, preparados con ingredientes frescos.",
    image: "https://images.unsplash.com/photo-1702566039177-5b39c2126486?w=1200",
    badge: "🎄 Temporada Navideña",
    badgeSubtext: "Ofertas exclusivas"
  },
  {
    id: 4,
    title: "Cheesecakes",
    subtitle: "Cremosos",
    description: "El equilibrio perfecto entre cremosidad y sabor. Nuestros cheesecakes son elaborados con queso crema premium y topped con las mejores frutas frescas.",
    image: "https://images.unsplash.com/photo-1553882299-9601a48ebe6a?w=1200",
    badge: "🍓 Fresas Frescas",
    badgeSubtext: "Sabor Natural"
  }
];

interface HeroProps {
  onNavigate?: (page: string) => void;
}

export function Hero({ onNavigate }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <section id="inicio" className="relative bg-gradient-to-br from-pink-50 via-rose-50 to-fuchsia-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content - Animated */}
          <div className="space-y-6 relative z-10">
            <div className="flex items-center space-x-2 text-primary">
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <span className="text-sm">Más de 1000 clientes satisfechos</span>
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl lg:text-6xl font-bold text-primary leading-tight">
                  {currentSlideData.title}
                  <span className="text-pink-600 block">{currentSlideData.subtitle}</span>
                </h1>
              </motion.div>
            </AnimatePresence>
            
            <AnimatePresence mode="wait">
              <motion.p
                key={`desc-${currentSlide}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-lg text-muted-foreground max-w-lg"
              >
                {currentSlideData.description}
              </motion.p>
            </AnimatePresence>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="text-lg px-8"
                onClick={() => onNavigate?.('products')}
              >
                Ver Productos
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8">
                Contactar
              </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground">Productos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">15</div>
                <div className="text-sm text-muted-foreground">Años de experiencia</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">24h</div>
                <div className="text-sm text-muted-foreground">Entrega rápida</div>
              </div>
            </div>
          </div>
          
          {/* Carousel */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentSlide}
                  src={currentSlideData.image}
                  alt={`${currentSlideData.title} ${currentSlideData.subtitle}`}
                  className="w-full h-[500px] object-cover"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6 }}
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              
              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-primary rounded-full p-3 shadow-lg transition-all hover:scale-110 z-10"
                aria-label="Slide anterior"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-primary rounded-full p-3 shadow-lg transition-all hover:scale-110 z-10"
                aria-label="Siguiente slide"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
              
              {/* Dots Navigation */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      index === currentSlide
                        ? "bg-white w-8"
                        : "bg-white/60 hover:bg-white/80"
                    }`}
                    aria-label={`Ir al slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
            
            {/* Floating Cards - Animated */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`badge-${currentSlide}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="absolute -bottom-6 -left-6 bg-white rounded-lg shadow-lg p-4 max-w-xs"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                    {currentSlideData.badge.split(' ')[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{currentSlideData.badge}</div>
                    <div className="text-xs text-muted-foreground">{currentSlideData.badgeSubtext}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            
            <div className="absolute -top-6 -right-6 bg-white rounded-lg shadow-lg p-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">✨</span>
                <div>
                  <div className="font-semibold text-sm">Calidad Premium</div>
                  <div className="text-xs text-muted-foreground">Ingredientes frescos</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
