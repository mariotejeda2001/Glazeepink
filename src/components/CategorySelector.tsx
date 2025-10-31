import { motion } from "motion/react";

interface CategoryCardProps {
  title: string;
  image: string;
  page: string;
  onNavigate?: (page: string) => void;
}

function CategoryCard({ title, image, page, onNavigate }: CategoryCardProps) {
  const handleClick = () => {
    if (onNavigate) {
      // Navegar a la página específica
      onNavigate(page);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className="cursor-pointer group"
    >
      <div className="relative rounded-2xl overflow-hidden shadow-xl h-80 bg-muted">
        <img
          src={image}
          alt={`Categoría ${title}`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        
        {/* Title */}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <h3 className="text-3xl font-bold mb-2">{title}</h3>
          <div className="flex items-center gap-2 text-sm opacity-90">
            <span>Ver productos</span>
            <svg 
              className="w-4 h-4 group-hover:translate-x-1 transition-transform" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </motion.div>
  );
}

interface CategorySelectorProps {
  onNavigate?: (page: string) => void;
}

export function CategorySelector({ onNavigate }: CategorySelectorProps) {
  return (
    <section className="py-16 bg-muted/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-primary mb-4">
            Nuestros Productos
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explora nuestras categorías de productos artesanales
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <CategoryCard
            title="Postres"
            image="https://images.unsplash.com/photo-1671652640587-1d302c15a89f?w=600"
            page="postres"
            onNavigate={onNavigate}
          />
          <CategoryCard
            title="Pastelería"
            image="https://images.unsplash.com/photo-1741244133042-970251e76066?w=600"
            page="pasteleria"
            onNavigate={onNavigate}
          />
        </div>
      </div>
    </section>
  );
}
