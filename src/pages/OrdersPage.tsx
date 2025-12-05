// src/pages/OrdersPage.tsx
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Calendar, Package, ShoppingBag } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  product: {
    name: string;
    images: string[];
  };
}

interface Order {
  id: number;
  createdAt: string;
  total: number;
  status: string;
  items: OrderItem[];
}

export function OrdersPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4242';
        const response = await fetch(`${apiUrl}/api/orders`, {
          headers: {
            'Authorization': `Bearer ${token}` // Autenticación
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        }
      } catch (error) {
        console.error("Error cargando órdenes:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchOrders();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Buscando tus pedidos...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
        <h2 className="text-2xl font-bold mb-2">Aún no tienes pedidos</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          Parece que no has realizado ninguna compra todavía. ¡Nuestros postres te están esperando!
        </p>
        <Button onClick={() => onNavigate('products')}>
          Ir a la Tienda
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <Package className="h-8 w-8 text-primary" />
        Mis Pedidos
      </h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.id} className="overflow-hidden border-2 hover:border-primary/20 transition-colors">
            <CardHeader className="bg-muted/30 py-4 flex flex-row items-center justify-between">
              <div className="flex flex-col sm:flex-row sm:gap-6 text-sm">
                <div>
                  <p className="text-muted-foreground font-medium">Pedido #{order.id}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="mt-2 sm:mt-0">
                  <p className="text-muted-foreground font-medium">Total</p>
                  <p className="font-bold text-foreground">${order.total} MXN</p>
                </div>
              </div>
              <Badge 
                variant={order.status === 'pagado' ? 'default' : 'secondary'}
                className="capitalize"
              >
                {order.status}
              </Badge>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {order.items.map((item) => (
                  <div key={item.id} className="p-4 flex gap-4 items-center">
                    <div className="h-16 w-16 bg-muted rounded-md overflow-hidden flex-shrink-0">
                      <ImageWithFallback 
                        src={item.product.images[0] || ''} 
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm sm:text-base truncate">{item.product.name}</h4>
                      <p className="text-sm text-muted-foreground">Cantidad: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm sm:text-base">${item.price} c/u</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}