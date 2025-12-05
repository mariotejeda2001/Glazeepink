// src/pages/CheckoutPage.tsx
import { useState, useEffect } from "react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext"; // Importamos el Auth
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

// Tu clave pública de Stripe (Test mode)
const stripePromise = loadStripe("pk_test_51SQgDABcfT5UmNPbd6qeSGBPJB4k1k1BInaFth2HsiqDkntelgdHvzFkdTIypf4cYVz3lDjGwbuNNftaYfKzcUDj00dL8OvBlJ");

// Componente del Formulario de Pago
function PaymentForm({ amount, onSuccess }: { amount: number, onSuccess: () => Promise<void> }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    // Confirmar el pago con Stripe
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin, 
      },
      redirect: "if_required", // Evita redirección forzosa si no es necesaria
    });

    if (error) {
      toast.error(error.message);
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      // Si Stripe dice "Éxito", guardamos la orden en nuestra BD
      await onSuccess();
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button type="submit" disabled={!stripe || isProcessing} className="w-full">
        {isProcessing ? "Procesando..." : `Pagar $${amount} MXN`}
      </Button>
    </form>
  );
}

// Página Principal de Checkout
export function CheckoutPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { items, subtotal, clearCart } = useCart();
  const { token } = useAuth(); // Necesitamos el token para guardar la orden
  const [clientSecret, setClientSecret] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4242';

  // Obtener la intención de pago al cargar
  useEffect(() => {
    if (subtotal > 0) {
      fetch(`${apiUrl}/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: subtotal }),
      })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret))
        .catch(err => console.error("Error Stripe:", err));
    }
  }, [subtotal]);

  // Función que se ejecuta DESPUÉS de que Stripe cobra el dinero
  const handleOrderSuccess = async () => {
    try {
      // 1. Guardar la orden en nuestra base de datos (PostgreSQL)
      const response = await fetch(`${apiUrl}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // ¡Importante! Enviamos el token
        },
        body: JSON.stringify({
          items: items.filter(i => i.selected), // Solo enviamos lo seleccionado
          total: subtotal
        })
      });

      if (!response.ok) throw new Error("Error al guardar la orden en el servidor");

      // 2. Éxito total
      toast.success("¡Pago exitoso! Tu orden ha sido guardada.");
      clearCart();
      
      // 3. Redirigir (Pronto cambiaremos esto a 'orders')
      setTimeout(() => onNavigate("home"), 2000);

    } catch (error) {
      console.error(error);
      toast.error("El pago se procesó, pero hubo un error guardando el historial. Contáctanos.");
    }
  };

  const selectedItemsCount = items.filter(i => i.selected).length;

  if (selectedItemsCount === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <h1 className="mb-4">No hay productos seleccionados</h1>
        <Button onClick={() => onNavigate('cart')}>Volver al Carrito</Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">Finalizar Compra</h1>

      <div className="grid gap-8">
        {/* Resumen */}
        <Card>
          <CardHeader><CardTitle>Resumen</CardTitle></CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${subtotal} MXN</p>
            <p className="text-muted-foreground">{selectedItemsCount} productos seleccionados</p>
          </CardContent>
        </Card>

        {/* Pasarela de Pago Stripe */}
        <Card>
          <CardHeader><CardTitle>Método de Pago</CardTitle></CardHeader>
          <CardContent>
            {clientSecret ? (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <PaymentForm amount={subtotal} onSuccess={handleOrderSuccess} />
              </Elements>
            ) : (
              <div className="text-center py-4">Cargando pasarela de pago...</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}