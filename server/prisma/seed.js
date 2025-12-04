// server/prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const products = [
  {
    name: "Pastel de Cumpleaños",
    description: "Esponjoso pastel decorado con crema de mantequilla, cubierto con coloridos detalles y velas.",
    longDescription: "Nuestro Pastel de Cumpleaños es la elección perfecta para hacer de tu celebración un momento inolvidable. Elaborado con ingredientes de primera calidad...",
    price: 350,
    images: [
      "https://images.unsplash.com/photo-1635349135195-ea08a39fcc5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ0aGRheSUyMGNha2UlMjBjZWxlYnJhdGlvbnxlbnwxfHx8fDE3NjE1NDYzNjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=500",
      "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=500"
    ],
    category: "Pastelería",
    flavors: ["Vainilla", "Chocolate"],
    rating: 4.8,
    reviews: 45,
    servings: 8,
    ingredients: "Harina de trigo, huevos, mantequilla, azúcar, crema de mantequilla, colorante natural."
  },
  {
    name: "Cheesecake de Fresas",
    description: "Cremoso cheesecake con base de galleta y topping de fresas naturales y coulis de fresa.",
    longDescription: "Disfruta de nuestro exquisito Cheesecake de Fresas, una combinación perfecta de cremosidad y frescura.",
    price: 280,
    images: [
      "https://images.unsplash.com/photo-1553882299-9601a48ebe6a?w=500",
      "https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=500"
    ],
    category: "Postres",
    flavors: ["Fresa"],
    rating: 4.9,
    reviews: 67,
    servings: 6,
    ingredients: "Queso crema suave, base crujiente de galleta, crema batida y fresas naturales."
  },
  {
    name: "Cupcakes de Vainilla",
    description: "Set de 6 cupcakes de vainilla con buttercream de diferentes sabores y decoraciones artesanales.",
    price: 180,
    images: ["https://images.unsplash.com/photo-1658422928126-6120ea188353?w=500"],
    category: "Pastelería",
    flavors: ["Vainilla"],
    rating: 4.7,
    reviews: 52,
    servings: 6,
    ingredients: "Harina de trigo, vainilla natural, huevos frescos, mantequilla premium."
  },
  {
    name: "Tiramisú Tradicional",
    description: "Auténtico tiramisú italiano con mascarpone, café expresso y cacao en polvo.",
    price: 220,
    images: ["https://images.unsplash.com/photo-1710106519622-8c49d0bcff2f?w=500"],
    category: "Postres",
    flavors: ["Café", "Chocolate"],
    rating: 4.9,
    reviews: 78,
    servings: 4,
    ingredients: "Queso mascarpone importado, café expresso italiano, bizcochos savoiardi."
  },
  {
    name: "Mousse de Chocolate",
    description: "Suave mousse de chocolate belga con crema batida y virutas de chocolate.",
    price: 195,
    images: ["https://images.unsplash.com/photo-1702566039177-5b39c2126486?w=500"],
    category: "Postres",
    flavors: ["Chocolate"],
    rating: 4.8,
    reviews: 30
  },
  {
    name: "Panna Cotta de Vainilla",
    description: "Delicada panna cotta italiana con salsa de frutos rojos y flores comestibles.",
    price: 175,
    images: ["https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500"],
    category: "Postres",
    flavors: ["Vainilla", "Frutas"],
    rating: 4.6,
    reviews: 25
  },
  {
    name: "Crème Brûlée",
    description: "Clásico postre francés con crema de vainilla y costra de azúcar caramelizada crujiente.",
    longDescription: "Nuestro Crème Brûlée es la definición de elegancia en postres. La suave crema de vainilla contrasta perfectamente con la costra crujiente.",
    price: 205,
    images: ["https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=500"],
    category: "Postres",
    flavors: ["Vainilla", "Caramelo"],
    rating: 4.8,
    reviews: 62,
    servings: 1,
    ingredients: "Crema de vainilla francesa, yemas de huevo, azúcar caramelizado."
  },
  {
    name: "Tarta de Frutas Frescas",
    description: "Tarta de crema pastelera cubierta con frutas frescas de temporada y glaseado brillante.",
    price: 320,
    images: ["https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500"],
    category: "Pastelería",
    flavors: ["Vainilla", "Frutas"],
    rating: 4.7,
    reviews: 41,
    servings: 8,
    ingredients: "Crema pastelera artesanal, base de masa quebrada, frutas frescas."
  },
  {
    name: "Pastel Red Velvet",
    description: "Clásico pastel de terciopelo rojo con frosting de queso crema.",
    longDescription: "Nuestro Pastel Red Velvet es un clásico americano que ha conquistado corazones.",
    price: 380,
    images: ["https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=500"],
    category: "Pastelería",
    flavors: ["Chocolate", "Vainilla"],
    rating: 4.9,
    reviews: 89,
    servings: 10,
    ingredients: "Harina especial, cacao en polvo, colorante natural, frosting de queso crema."
  }
];

async function main() {
  console.log('🌱 Iniciando la carga de datos (Seeding)...');

  // Limpiar la tabla antes de cargar para no duplicar si lo corres dos veces
  await prisma.product.deleteMany({});

  for (const p of products) {
    const product = await prisma.product.create({
      data: p,
    });
    console.log(`✅ Creado producto: ${product.name}`);
  }
  console.log('✨ Seeding completado.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });