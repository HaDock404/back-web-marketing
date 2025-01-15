const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middlewares/errorHandler');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Configuration CORS
app.use(cors({
  origin: 'http://localhost:3000', // URL du frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Méthodes autorisées
  allowedHeaders: ['Content-Type', 'Authorization'], // En-têtes autorisés
}));

app.use(express.json());

// Routes utilisateur
app.use('/api/users', userRoutes);

// Middleware de gestion des erreurs
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur le port ${port}`);
});
