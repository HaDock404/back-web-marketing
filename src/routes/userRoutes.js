const express = require('express');
const { createUserHandler, validateCodeHandler, loginUserHandler } = require('../controllers/userController');
const authenticateUser = require('../middlewares/authMiddleware');
const db = require('../config/db');

const router = express.Router();

router.post('/create-user', createUserHandler);

router.post('/validate-code', validateCodeHandler);

router.post('/login-user', loginUserHandler);

router.get('/dashboard', authenticateUser, async (req, res) => {
    try {
      // Récupère l'email et l'id de l'utilisateur connecté
      const userId = req.user.userId;
  
      const [rows] = await db.query('SELECT email FROM users WHERE id = ?', [userId]);
  
      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Utilisateur introuvable.' });
      }
  
      const user = rows[0];
      res.status(200).json({ success: true, message: 'Bienvenue au tableau de bord.', user });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Erreur serveur.' });
    }
});

router.get('/auth/validate', authenticateUser, (req, res) => {
  res.status(200).json({ success: true, message: 'Utilisateur authentifié.' });
});

module.exports = router;
