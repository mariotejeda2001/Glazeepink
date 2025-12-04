require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client'); // Importar el cliente de BD
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// --- RUTAS DE PRODUCTOS (API) ---

// 1. Obtener todos los productos (con filtro opcional por categoría)
app.get('/api/products', async (req, res) => {
  const { category } = req.query;
  try {
    // Si viene ?category=Postres en la URL, filtra. Si no, trae todo.
    const where = category ? { category } : {};
    
    const products = await prisma.product.findMany({
      where: where,
      orderBy: { id: 'asc' } // Ordenar por ID para consistencia
    });
    
    res.json(products);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ error: "Error interno del servidor al obtener productos" });
  }
});

// 2. Obtener un solo producto por ID (para la página de detalles)
app.get('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) }
    });

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error al buscar producto:", error);
    res.status(500).json({ error: "Error al buscar el producto" });
  }
});

// --- RUTA DE PAGOS (STRIPE) ---
app.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe usa centavos
      currency: 'mxn',
      payment_method_types: ['card'],
    });

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`🚀 Backend listo en puerto ${PORT}`));