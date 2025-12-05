// server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const app = express();

const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta_temporal_para_desarrollo';

app.use(cors());
app.use(express.json());

// ==========================================
// 🛡️ MIDDLEWARE DE SEGURIDAD (NUEVO)
// ==========================================
// Esta función verifica que el usuario tenga un token válido antes de dejarlo pasar
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

  if (token == null) return res.sendStatus(401); // Si no hay token, error 401

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Si el token no sirve, error 403
    req.user = user; // Guardamos los datos del usuario en la petición
    next(); // Continuamos
  });
}

// ==========================================
// 🔐 RUTAS DE AUTENTICACIÓN
// ==========================================

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: "Este correo ya está registrado" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword }
    });

    const token = jwt.sign({ userId: user.id, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: "Error al registrar usuario" });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: "Credenciales inválidas" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(400).json({ error: "Credenciales inválidas" });

    const token = jwt.sign({ userId: user.id, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
});

// ==========================================
// 📦 RUTAS DE ÓRDENES (NUEVO)
// ==========================================

// 1. Guardar una nueva orden (Protegido con authenticateToken)
app.post('/api/orders', authenticateToken, async (req, res) => {
  const { items, total } = req.body; // El frontend nos manda el carrito y el total
  const userId = req.user.userId;    // Obtenemos el ID del usuario del token

  try {
    const order = await prisma.order.create({
      data: {
        userId: userId,
        total: parseFloat(total),
        items: {
          create: items.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: {
        items: true // Para que la respuesta incluya los detalles creados
      }
    });
    res.json(order);
  } catch (error) {
    console.error("Error creando orden:", error);
    res.status(500).json({ error: "No se pudo guardar la orden" });
  }
});

// 2. Obtener historial de órdenes del usuario (Protegido)
app.get('/api/orders', authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  try {
    const orders = await prisma.order.findMany({
      where: { userId: userId },
      include: {
        items: {
          include: {
            product: true // Incluir detalles del producto (nombre, imagen)
          }
        }
      },
      orderBy: { createdAt: 'desc' } // Las más recientes primero
    });
    res.json(orders);
  } catch (error) {
    console.error("Error obteniendo órdenes:", error);
    res.status(500).json({ error: "Error al obtener historial" });
  }
});

// ==========================================
// 📦 RUTAS DE PRODUCTOS
// ==========================================

app.get('/api/products', async (req, res) => {
  const { category } = req.query;
  try {
    const where = category ? { category } : {};
    const products = await prisma.product.findMany({ where, orderBy: { id: 'asc' } });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error interno" });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!product) return res.status(404).json({ error: "No encontrado" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Error al buscar" });
  }
});

// ==========================================
// 💳 PAGOS
// ==========================================

app.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
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