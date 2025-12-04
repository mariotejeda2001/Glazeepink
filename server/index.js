require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client'); // Importante: Cliente de BD
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
    const where = category ? { category } : {};
    const products = await prisma.product.findMany({
      where: where,
      orderBy: { id: 'asc' }
    });
    res.json(products);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// 2. Obtener un solo producto por ID
app.get('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!product) return res.status(404).json({ error: "Producto no encontrado" });
    
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
      amount: amount * 100, // Centavos
      currency: 'mxn',
      payment_method_types: ['card'],
    });
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Backend corriendo en puerto ${PORT}`));