import { ShoppingCart, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { useCart } from "../contexts/CartContext";

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems } = useCart();

  const handleNavClick = (page: string) => {
    onNavigate(page);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="bg-primary shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => handleNavClick('home')}
          >
            <h1 className="text-2xl font-bold text-primary-foreground">Glazee</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <button 
              onClick={() => handleNavClick('home')}
              className={`text-primary-foreground hover:text-pink-200 transition-colors ${
                currentPage === 'home' ? 'text-pink-200' : ''
              }`}
            >
              Inicio
            </button>
            <button 
              onClick={() => handleNavClick('postres')}
              className={`text-primary-foreground hover:text-pink-200 transition-colors ${
                currentPage === 'postres' ? 'text-pink-200' : ''
              }`}
            >
              Postres
            </button>
            <button 
              onClick={() => handleNavClick('pasteleria')}
              className={`text-primary-foreground hover:text-pink-200 transition-colors ${
                currentPage === 'pasteleria' ? 'text-pink-200' : ''
              }`}
            >
              Pastelería
            </button>
            <button 
              onClick={() => handleNavClick('products')}
              className={`text-primary-foreground hover:text-pink-200 transition-colors ${
                currentPage === 'products' ? 'text-pink-200' : ''
              }`}
            >
              Todos los Productos
            </button>
            <button 
              className="text-primary-foreground hover:text-pink-200 transition-colors"
            >
              Contacto
            </button>
          </nav>

          {/* Cart and Menu Button */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="secondary" 
              size="sm" 
              className="relative"
              onClick={() => handleNavClick('cart')}
            >
              <ShoppingCart className="h-4 w-4" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-primary-foreground hover:text-pink-200 hover:bg-primary-foreground/10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-primary-foreground/20">
            <nav className="flex flex-col space-y-4">
              <button
                className={`text-left text-primary-foreground hover:text-pink-200 transition-colors ${
                  currentPage === 'home' ? 'text-pink-200' : ''
                }`}
                onClick={() => handleNavClick('home')}
              >
                Inicio
              </button>
              <button
                className={`text-left text-primary-foreground hover:text-pink-200 transition-colors ${
                  currentPage === 'postres' ? 'text-pink-200' : ''
                }`}
                onClick={() => handleNavClick('postres')}
              >
                Postres
              </button>
              <button
                className={`text-left text-primary-foreground hover:text-pink-200 transition-colors ${
                  currentPage === 'pasteleria' ? 'text-pink-200' : ''
                }`}
                onClick={() => handleNavClick('pasteleria')}
              >
                Pastelería
              </button>
              <button
                className={`text-left text-primary-foreground hover:text-pink-200 transition-colors ${
                  currentPage === 'products' ? 'text-pink-200' : ''
                }`}
                onClick={() => handleNavClick('products')}
              >
                Todos los Productos
              </button>
              <button
                className="text-left text-primary-foreground hover:text-pink-200 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contacto
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}