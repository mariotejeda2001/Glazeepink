require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors());
app.use(express.json());

app.post('/create-payment-intent', async (req, res) => {
      const { amount } = req.body;

      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount * 100, 
          currency: 'mxn',
          // CAMBIO AQUÍ: Usamos 'payment_method_types' en lugar de 'automatic_payment_methods'
          payment_method_types: ['card'], 
          // automatic_payment_methods: { enabled: true }, <--- Comenta o borra esto
        });

        res.send({ clientSecret: paymentIntent.client_secret });
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

app.listen(4242, () => console.log('Backend corriendo en puerto 4242'));