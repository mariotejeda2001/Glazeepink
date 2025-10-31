import { useState } from "react";
import { useCart } from "../contexts/CartContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { Textarea } from "../components/ui/textarea";
import { Lock } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { useForm } from "react-hook-form@7.55.0";

interface CheckoutPageProps {
  onNavigate: (page: string) => void;
}

interface PaymentFormData {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

interface ShippingFormData {
  fullName: string;
  streetAddress: string;
  postalCode: string;
  phone: string;
  deliveryInstructions: string;
}

export function CheckoutPage({ onNavigate }: CheckoutPageProps) {
  const { items, subtotal } = useCart();
  const [isGift, setIsGift] = useState(false);
  const [paymentAdded, setPaymentAdded] = useState(false);
  const [shippingAdded, setShippingAdded] = useState(false);

  const selectedItems = items.filter(item => item.selected);
  const selectedCount = selectedItems.length;

  const {
    register: registerPayment,
    handleSubmit: handleSubmitPayment,
    formState: { errors: paymentErrors },
    reset: resetPayment
  } = useForm<PaymentFormData>();

  const {
    register: registerShipping,
    handleSubmit: handleSubmitShipping,
    formState: { errors: shippingErrors },
    reset: resetShipping
  } = useForm<ShippingFormData>();

  const onSubmitPayment = (data: PaymentFormData) => {
    console.log("Payment data:", data);
    setPaymentAdded(true);
    toast.success("Método de pago agregado correctamente");
  };

  const onSubmitShipping = (data: ShippingFormData) => {
    console.log("Shipping data:", data);
    setShippingAdded(true);
    toast.success("Dirección de envío agregada correctamente");
  };

  const handleCompleteOrder = () => {
    if (!paymentAdded) {
      toast.error("Por favor agrega un método de pago");
      return;
    }
    if (!shippingAdded) {
      toast.error("Por favor agrega una dirección de envío");
      return;
    }
    toast.success("¡Pedido realizado con éxito! Gracias por tu compra.");
    setTimeout(() => {
      onNavigate('home');
    }, 2000);
  };

  if (selectedCount === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="mb-4">No hay productos seleccionados</h1>
          <p className="text-muted-foreground mb-6">
            Por favor selecciona productos en tu carrito antes de proceder al pago.
          </p>
          <Button onClick={() => onNavigate('cart')} size="lg">
            Volver al Carrito
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1 className="mb-8 sm:mb-12">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Columna izquierda - Resumen y Método de Pago */}
        <div className="space-y-6">
          {/* Resumen del pedido */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-muted-foreground mb-1">
                    Subtotal ({selectedCount} {selectedCount === 1 ? 'producto' : 'productos'}):
                  </p>
                  <p className="text-2xl sm:text-3xl font-semibold">
                    ${subtotal} MXN
                  </p>
                </div>

                <div className="flex items-start space-x-2 pt-2">
                  <Checkbox
                    id="gift-checkout"
                    checked={isGift}
                    onCheckedChange={(checked) => setIsGift(checked as boolean)}
                  />
                  <label
                    htmlFor="gift-checkout"
                    className="text-sm cursor-pointer select-none"
                  >
                    Este pedido es un regalo
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Método de pago */}
          <Card>
            <CardHeader>
              <CardTitle>Agrega un método de pago</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Logos de tarjetas */}
              <div className="flex items-center gap-2 flex-wrap pb-2">
                <div className="flex items-center gap-1.5">
                  <div className="h-8 w-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded flex items-center justify-center text-white text-xs">
                    VISA
                  </div>
                  <div className="h-8 w-12 bg-gradient-to-br from-red-600 via-orange-500 to-yellow-500 rounded flex items-center justify-center">
                    <div className="flex gap-0.5">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-orange-400"></div>
                    </div>
                  </div>
                  <div className="h-8 w-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded flex items-center justify-center text-white text-[10px]">
                    AMEX
                  </div>
                  <div className="h-8 w-12 bg-gradient-to-br from-orange-400 to-blue-600 rounded"></div>
                  <div className="h-8 w-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded flex items-center justify-center text-white text-[10px]">
                    DISCOVER
                  </div>
                  <div className="h-8 w-12 bg-gradient-to-br from-red-600 to-green-600 rounded flex items-center justify-center text-white text-[10px]">
                    JCB
                  </div>
                  <div className="h-8 w-12 bg-gradient-to-br from-red-500 to-red-700 rounded flex items-center justify-center text-white text-[10px]">
                    CHINA
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmitPayment(onSubmitPayment)} className="space-y-4">
                {/* Número de tarjeta */}
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">* Número de tarjeta</Label>
                  <div className="relative">
                    <Input
                      id="cardNumber"
                      placeholder="Número de tarjeta"
                      {...registerPayment("cardNumber", {
                        required: "El número de tarjeta es requerido",
                        pattern: {
                          value: /^[0-9]{16}$/,
                          message: "Ingresa un número de tarjeta válido (16 dígitos)"
                        }
                      })}
                      maxLength={16}
                      className={paymentErrors.cardNumber ? "border-red-500" : ""}
                    />
                    {!paymentErrors.cardNumber && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                  {paymentErrors.cardNumber && (
                    <p className="text-sm text-red-500">{paymentErrors.cardNumber.message}</p>
                  )}
                </div>

                {/* Fecha de vencimiento y CVV */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>* Fecha de vencimiento</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <select
                          {...registerPayment("expiryMonth", {
                            required: "Mes requerido"
                          })}
                          className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                        >
                          <option value="">Mes</option>
                          {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                            <option key={month} value={month.toString().padStart(2, '0')}>
                              {month.toString().padStart(2, '0')}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <select
                          {...registerPayment("expiryYear", {
                            required: "Año requerido"
                          })}
                          className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                        >
                          <option value="">Año</option>
                          {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {(paymentErrors.expiryMonth || paymentErrors.expiryYear) && (
                      <p className="text-sm text-red-500">Fecha de vencimiento requerida</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cvv">* CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="Código de 3 a 4 dígitos"
                      {...registerPayment("cvv", {
                        required: "CVV requerido",
                        pattern: {
                          value: /^[0-9]{3,4}$/,
                          message: "CVV inválido"
                        }
                      })}
                      maxLength={4}
                      className={paymentErrors.cvv ? "border-red-500" : ""}
                    />
                    {paymentErrors.cvv && (
                      <p className="text-sm text-red-500">{paymentErrors.cvv.message}</p>
                    )}
                  </div>
                </div>

                {/* Mensaje de seguridad */}
                <div className="flex items-start gap-2 text-xs text-muted-foreground pt-2">
                  <Lock className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <p>En Glazee tu información siempre está segura</p>
                </div>

                {/* Botón */}
                <Button type="submit" className="w-full" disabled={paymentAdded}>
                  {paymentAdded ? "Tarjeta agregada ✓" : "Agregar tarjeta"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Columna derecha - Dirección de envío */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Agrega una dirección de envío</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitShipping(onSubmitShipping)} className="space-y-4">
                {/* Nombre completo */}
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nombre y apellido completo</Label>
                  <Input
                    id="fullName"
                    {...registerShipping("fullName", {
                      required: "El nombre completo es requerido",
                      minLength: {
                        value: 3,
                        message: "El nombre debe tener al menos 3 caracteres"
                      }
                    })}
                    className={shippingErrors.fullName ? "border-red-500" : ""}
                  />
                  {shippingErrors.fullName && (
                    <p className="text-sm text-red-500">{shippingErrors.fullName.message}</p>
                  )}
                </div>

                {/* Calle y número */}
                <div className="space-y-2">
                  <Label htmlFor="streetAddress">Calle y número (ext o int)</Label>
                  <Input
                    id="streetAddress"
                    {...registerShipping("streetAddress", {
                      required: "La dirección es requerida"
                    })}
                    className={shippingErrors.streetAddress ? "border-red-500" : ""}
                  />
                  {shippingErrors.streetAddress && (
                    <p className="text-sm text-red-500">{shippingErrors.streetAddress.message}</p>
                  )}
                </div>

                {/* Código postal */}
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Código Postal</Label>
                  <Input
                    id="postalCode"
                    {...registerShipping("postalCode", {
                      required: "El código postal es requerido",
                      pattern: {
                        value: /^[0-9]{5}$/,
                        message: "Ingresa un código postal válido (5 dígitos)"
                      }
                    })}
                    maxLength={5}
                    className={shippingErrors.postalCode ? "border-red-500" : ""}
                  />
                  {shippingErrors.postalCode && (
                    <p className="text-sm text-red-500">{shippingErrors.postalCode.message}</p>
                  )}
                </div>

                {/* Teléfono */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Número de teléfono</Label>
                  <Input
                    id="phone"
                    {...registerShipping("phone", {
                      required: "El teléfono es requerido",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Ingresa un número de teléfono válido (10 dígitos)"
                      }
                    })}
                    maxLength={10}
                    className={shippingErrors.phone ? "border-red-500" : ""}
                  />
                  {shippingErrors.phone && (
                    <p className="text-sm text-red-500">{shippingErrors.phone.message}</p>
                  )}
                </div>

                {/* Instrucciones de entrega */}
                <div className="space-y-2">
                  <Label htmlFor="deliveryInstructions">Agregar instrucciones de entrega</Label>
                  <Textarea
                    id="deliveryInstructions"
                    placeholder="Puntos de referencia"
                    rows={4}
                    {...registerShipping("deliveryInstructions")}
                  />
                </div>

                {/* Botón */}
                <Button type="submit" className="w-full" disabled={shippingAdded}>
                  {shippingAdded ? "Dirección agregada ✓" : "Agregar dirección"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Botón para completar pedido */}
      <div className="mt-8 flex justify-center">
        <Button
          size="lg"
          onClick={handleCompleteOrder}
          disabled={!paymentAdded || !shippingAdded}
          className="w-full sm:w-auto min-w-[280px]"
        >
          Completar pedido - ${subtotal} MXN
        </Button>
      </div>
    </div>
  );
}
