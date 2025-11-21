import { useState, useEffect } from "react";
import { useCart } from "../contexts/CartContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

// Tu clave pública de Stripe (Test mode)
const stripePromise = loadStripe("");

// Componente del Formulario de Pago
function PaymentForm({ amount, onSuccess }: { amount: number, onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin, // Redirecciona aquí tras el pago
      },
      redirect: "if_required", // Evita redirección si no es necesaria (tarjetas)
    });

    if (error) {
      toast.error(error.message);
    } else {
      onSuccess();
    }
    setIsProcessing(false);
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
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    if (subtotal > 0) {
      // Solicitar PaymentIntent al backend
      fetch("http://localhost:4242/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: subtotal }),
      })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret));
    }
  }, [subtotal]);

  const handleSuccess = () => {
    toast.success("¡Pago realizado con éxito!");
    clearCart();
    setTimeout(() => onNavigate("home"), 2000);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <h1 className="mb-4">Carrito vacío</h1>
        <Button onClick={() => onNavigate('products')}>Volver a comprar</Button>
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
            <p className="text-muted-foreground">{items.length} productos</p>
          </CardContent>
        </Card>

        {/* Pasarela de Pago Stripe */}
        <Card>
          <CardHeader><CardTitle>Método de Pago</CardTitle></CardHeader>
          <CardContent>
            {clientSecret ? (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <PaymentForm amount={subtotal} onSuccess={handleSuccess} />
              </Elements>
            ) : (
              <p>Cargando pasarela de pago...</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}