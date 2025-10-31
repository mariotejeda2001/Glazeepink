import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Glazee</h3>
            <p className="text-primary-foreground/80">
              Creamos momentos dulces con nuestros pasteles y postres artesanales desde 2008.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 cursor-pointer hover:text-pink-300 transition-colors" />
              <Instagram className="h-5 w-5 cursor-pointer hover:text-pink-300 transition-colors" />
              <Twitter className="h-5 w-5 cursor-pointer hover:text-pink-300 transition-colors" />
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold">Contacto</h4>
            <div className="space-y-3 text-primary-foreground/80">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p>Av. de los Dulces, 123</p>
                  <p>06100 Roma Norte, CDMX</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <p>+52 55 1234 5678</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <p>info@glazee.mx</p>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div className="space-y-4">
            <h4 className="font-semibold">Horarios</h4>
            <div className="space-y-2 text-primary-foreground/80">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 flex-shrink-0" />
                <div>
                  <p>Lun - Vie: 8:00 - 20:00</p>
                  <p>Sáb - Dom: 9:00 - 21:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Enlaces Rápidos</h4>
            <div className="space-y-2 text-primary-foreground/80">
              <a href="#productos" className="block hover:text-pink-300 transition-colors">
                Productos
              </a>
              <a href="#sobre-nosotros" className="block hover:text-pink-300 transition-colors">
                Sobre Nosotros
              </a>
              <a href="#contacto" className="block hover:text-pink-300 transition-colors">
                Contacto
              </a>
              <a href="#" className="block hover:text-pink-300 transition-colors">
                Política de Privacidad
              </a>
              <a href="#" className="block hover:text-pink-300 transition-colors">
                Términos y Condiciones
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/60">
          <p>&copy; 2023 Glazee. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}