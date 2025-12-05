// src/components/Header.tsx
import { ShoppingCart, Menu, X, User, LogOut, LogIn, Package} from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  const handleNavClick = (page: string) => {
    onNavigate(page);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    onNavigate('home');
  };

  // Estilos base para los links de navegación (Restaurando el estilo original)
  const navLinkClass = (page: string) => 
    `text-base font-medium transition-colors hover:text-pink-200 ${
      currentPage === page ? 'text-pink-200 font-bold' : 'text-white'
    }`;

  return (
    <header className="bg-primary shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* 1. LOGO */}
          <div 
            className="flex items-center cursor-pointer flex-shrink-0" 
            onClick={() => handleNavClick('home')}
          >
            <h1 className="text-2xl font-bold text-white">Glazee</h1>
          </div>

          {/* 2. NAVEGACIÓN DESKTOP (Corregido con GAP) */}
          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => handleNavClick('home')} className={navLinkClass('home')}>
              Inicio
            </button>
            <button onClick={() => handleNavClick('postres')} className={navLinkClass('postres')}>
              Postres
            </button>
            <button onClick={() => handleNavClick('pasteleria')} className={navLinkClass('pasteleria')}>
              Pastelería
            </button>
            <button onClick={() => handleNavClick('products')} className={navLinkClass('products')}>
              Catálogo
            </button>
          </nav>

          {/* 3. ACCIONES DERECHA */}
          <div className="flex items-center gap-4">
            
            {/* Botón Carrito */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative text-white hover:bg-white/20 hover:text-white"
              onClick={() => handleNavClick('cart')}
            >
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-primary">
                  {totalItems}
                </span>
              )}
            </Button>

            {/* Menú de Usuario (Desktop) */}
            <div className="hidden md:flex items-center gap-2">
              {isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-white/10 p-0">
                      <Avatar className="h-9 w-9 border-2 border-white/50">
                        <AvatarFallback className="bg-pink-700 text-white font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleNavClick('cart')} className="cursor-pointer">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      <span>Mi Carrito</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleNavClick('orders')} className="cursor-pointer">
                      <Package className="mr-2 h-4 w-4" /> {/* Asegúrate de importar Package de lucide-react arriba */}
                      <span>Mis Pedidos</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer focus:text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Cerrar Sesión</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>

                </DropdownMenu>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    className="text-white hover:bg-white/10 hover:text-white font-medium"
                    onClick={() => handleNavClick('login')}
                  >
                    Ingresar
                  </Button>
                  <Button 
                    className="bg-white text-primary hover:bg-white/90 font-bold shadow-md"
                    onClick={() => handleNavClick('register')}
                  >
                    Registrarse
                  </Button>
                </>
              )}
            </div>
            
            {/* Botón Menú Móvil */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white hover:bg-white/10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* 4. MENÚ MÓVIL */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20 animate-in slide-in-from-top-5">
            {/* Info Usuario Móvil */}
            {isAuthenticated && user && (
              <div className="mb-4 px-4 flex items-center gap-3 pb-4 border-b border-white/10">
                <Avatar className="h-10 w-10 border border-white/30">
                  <AvatarFallback className="bg-pink-700 text-white font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-white">
                  <p className="font-medium text-sm">Hola, {user.name}</p>
                  <p className="text-xs text-white/70">{user.email}</p>
                </div>
              </div>
            )}

            <nav className="flex flex-col space-y-2 px-2">
              <MobileNavLink onClick={() => handleNavClick('home')} label="Inicio" active={currentPage === 'home'} />
              <MobileNavLink onClick={() => handleNavClick('postres')} label="Postres" active={currentPage === 'postres'} />
              <MobileNavLink onClick={() => handleNavClick('pasteleria')} label="Pastelería" active={currentPage === 'pasteleria'} />
              <MobileNavLink onClick={() => handleNavClick('products')} label="Catálogo Completo" active={currentPage === 'products'} />
              
              <div className="h-px bg-white/10 my-2 mx-2" />
              
              {!isAuthenticated ? (
                <>
                  <button
                    className="flex items-center gap-2 px-4 py-3 text-white hover:bg-white/10 rounded-md transition-colors w-full text-left font-medium"
                    onClick={() => handleNavClick('login')}
                  >
                    <LogIn className="h-4 w-4" /> Iniciar Sesión
                  </button>
                  <button
                    className="flex items-center gap-2 px-4 py-3 text-white bg-white/10 hover:bg-white/20 rounded-md transition-colors w-full text-left font-bold"
                    onClick={() => handleNavClick('register')}
                  >
                    <User className="h-4 w-4" /> Crear Cuenta
                  </button>
                </>
              ) : (
                <button
                  className="flex items-center gap-2 px-4 py-3 text-red-200 hover:bg-red-500/20 rounded-md transition-colors w-full text-left font-medium"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" /> Cerrar Sesión
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

function MobileNavLink({ onClick, label, active }: { onClick: () => void, label: string, active: boolean }) {
  return (
    <button
      className={`text-left px-4 py-3 rounded-md transition-colors w-full ${
        active 
          ? 'bg-white/20 text-white font-bold' 
          : 'text-white/90 hover:bg-white/10 hover:text-white'
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}